<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load('employee.store');
        $storeId = $user->employee->store_id;

        $query = Employee::with(['user', 'store'])
            ->where('store_id', $storeId);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%");
            });
        }

        if ($request->filled('position')) {
            $query->where('position', $request->position);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $employees = $query->orderBy('name')
            ->get()
            ->map(function ($emp) {
                return [
                    'id' => $emp->id,
                    'nik' => $emp->nik,
                    'name' => $emp->name,
                    'position' => $emp->position,
                    'is_active' => $emp->is_active,
                    'has_account' => $emp->user !== null,
                    'total_reports' => $emp->user ? $emp->user->shiftReports()->count() : 0,
                    'last_report' => $emp->user ? optional($emp->user->shiftReports()->latest()->first())->created_at?->diffForHumans() : null,
                    'created_at' => $emp->created_at->format('d M Y'),
                ];
            });

        $stats = [
            'total' => Employee::where('store_id', $storeId)->count(),
            'active' => Employee::where('store_id', $storeId)->where('is_active', true)->count(),
            'inactive' => Employee::where('store_id', $storeId)->where('is_active', false)->count(),
            'with_account' => Employee::where('store_id', $storeId)->whereHas('user')->count(),
        ];

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'stats' => $stats,
            'filters' => $request->only(['search', 'position', 'is_active']),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user()->load('employee.store');

        $validated = $request->validate([
            'nik' => 'required|string|unique:employees,nik',
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:100',
        ]);

        $employee = Employee::create([
            'nik' => $validated['nik'],
            'name' => $validated['name'],
            'store_id' => $user->employee->store_id,
            'position' => $validated['position'],
            'is_active' => true,
        ]);

        // Auto-create user account
        $password = $employee->generatePassword();
        User::create([
            'employee_id' => $employee->id,
            'nik' => $employee->nik,
            'name' => $employee->name,
            'email' => $employee->nik . '@alfamart.local',
            'password' => Hash::make($password),
        ]);

        return back()->with('success', "Karyawan berhasil ditambahkan! Password: {$password}");
    }

    public function update(Request $request, Employee $employee)
    {
        if ($employee->store_id !== $request->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:100',
            'is_active' => 'required|boolean',
        ]);

        $employee->update($validated);

        if ($employee->user) {
            $employee->user->update(['name' => $validated['name']]);
        }

        return back()->with('success', 'Data karyawan berhasil diperbarui!');
    }

    public function destroy(Request $request, Employee $employee)
    {
        if ($employee->store_id !== $request->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }

        // Don't allow deleting self
        if ($employee->id === $request->user()->employee_id) {
            return back()->withErrors(['error' => 'Tidak dapat menghapus akun sendiri!']);
        }

        if ($employee->user) {
            $employee->user->delete();
        }

        $employee->delete();

        return back()->with('success', 'Karyawan berhasil dihapus!');
    }
}
