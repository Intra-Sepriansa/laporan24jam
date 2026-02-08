<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\ShiftReport;
use App\Models\ShiftReportDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StoreProfileController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load('employee.store');
        $store = $user->employee->store;
        $storeId = $store->id;

        // Store stats
        $totalReports = ShiftReport::where('store_id', $storeId)->count();
        $totalSales = ShiftReportDetail::whereHas('shiftReport', function ($q) use ($storeId) {
            $q->where('store_id', $storeId);
        })->sum('spd');
        $totalTransactions = ShiftReportDetail::whereHas('shiftReport', function ($q) use ($storeId) {
            $q->where('store_id', $storeId);
        })->sum('std');
        $avgApc = ShiftReportDetail::whereHas('shiftReport', function ($q) use ($storeId) {
            $q->where('store_id', $storeId);
        })->avg('apc');

        $totalEmployees = Employee::where('store_id', $storeId)->where('is_active', true)->count();

        // Monthly sales for last 6 months
        $monthlySales = collect();
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthUpper = strtoupper($month->format('F Y'));
            $sales = ShiftReportDetail::whereHas('shiftReport', function ($q) use ($monthUpper, $storeId) {
                $q->where('month_year', $monthUpper)->where('store_id', $storeId);
            })->sum('spd');

            $monthlySales->push([
                'month' => $month->format('M Y'),
                'month_short' => $month->format('M'),
                'sales' => round($sales, 2),
            ]);
        }

        // First report date
        $firstReport = ShiftReport::where('store_id', $storeId)->oldest()->first();

        return Inertia::render('store/index', [
            'store' => [
                'id' => $store->id,
                'code' => $store->code,
                'name' => $store->name,
                'area' => $store->area,
                'address' => $store->address,
                'phone' => $store->phone,
                'description' => $store->description,
                'photo_url' => $store->photo_path ? Storage::url($store->photo_path) : null,
                'is_active' => $store->is_active,
            ],
            'stats' => [
                'total_reports' => $totalReports,
                'total_sales' => round($totalSales, 2),
                'total_transactions' => $totalTransactions,
                'avg_apc' => round($avgApc ?? 0, 2),
                'total_employees' => $totalEmployees,
                'member_since' => $firstReport ? $firstReport->created_at->format('d M Y') : now()->format('d M Y'),
            ],
            'monthlySales' => $monthlySales,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user()->load('employee.store');
        $store = $user->employee->store;

        $validated = $request->validate([
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'description' => 'nullable|string|max:1000',
            'photo' => 'nullable|image|max:5120',
        ]);

        $data = [
            'address' => $validated['address'] ?? $store->address,
            'phone' => $validated['phone'] ?? $store->phone,
            'description' => $validated['description'] ?? $store->description,
        ];

        if ($request->hasFile('photo')) {
            if ($store->photo_path && Storage::disk('public')->exists($store->photo_path)) {
                Storage::disk('public')->delete($store->photo_path);
            }
            $data['photo_path'] = $request->file('photo')->store('store-photos', 'public');
        }

        $store->update($data);

        return back()->with('success', 'Profil toko berhasil diperbarui!');
    }
}
