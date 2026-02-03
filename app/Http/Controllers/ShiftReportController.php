<?php

namespace App\Http\Controllers;

use App\Models\ShiftReport;
use App\Models\ShiftReportDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ShiftReportController extends Controller
{
    /**
     * Display a listing of the reports.
     */
    public function index(Request $request)
    {
        $user = $request->user()->load('employee.store');
        
        // Check if user has employee
        if (!$user->employee) {
            return Inertia::render('reports/index', [
                'reports' => [
                    'data' => [],
                    'links' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                ],
                'filters' => $request->only(['month_year', 'shift']),
            ]);
        }
        
        $query = ShiftReport::with(['user', 'details'])
            ->where('store_id', $user->employee->store_id);
        
        // Filter by month_year
        if ($request->filled('month_year')) {
            $query->where('month_year', 'like', '%' . $request->month_year . '%');
        }
        
        // Filter by shift
        if ($request->filled('shift')) {
            $query->where('shift', $request->shift);
        }
        
        $reports = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($report) {
                return [
                    'id' => $report->id,
                    'month_year' => $report->month_year,
                    'shift' => $report->shift,
                    'report_date' => $report->report_date->format('d M Y'),
                    'created_by' => $report->user->name,
                    'total_days' => $report->details->count(),
                    'total_spd' => $report->details->sum('spd'),
                    'total_std' => $report->details->sum('std'),
                    'total_pulsa' => $report->details->sum('pulsa'),
                    'average_apc' => $report->details->avg('apc'),
                    'created_at' => $report->created_at->format('d M Y H:i'),
                ];
            });
        
        return Inertia::render('reports/index', [
            'reports' => $reports,
            'filters' => $request->only(['month_year', 'shift']),
        ]);
    }

    /**
     * Show the form for creating a new report.
     */
    public function create()
    {
        return Inertia::render('reports/create');
    }

    /**
     * Store a newly created report in storage.
     */
    public function store(Request $request)
    {
        $details = collect($request->input('details', []))
            ->filter(function ($detail) {
                $spd = (float) ($detail['spd'] ?? 0);
                $std = (int) ($detail['std'] ?? 0);
                $pulsa = (float) ($detail['pulsa'] ?? 0);
                $notes = trim((string) ($detail['notes'] ?? ''));

                return $spd > 0 || $std > 0 || $pulsa > 0 || $notes !== '';
            })
            ->values()
            ->all();

        $request->merge(['details' => $details]);

        $validated = $request->validate([
            'month_year' => 'required|string',
            'shift' => 'required|integer|between:1,3',
            'report_date' => 'required|date',
            'details' => 'required|array|min:1',
            'details.*.day_number' => 'required|integer|between:1,30',
            'details.*.transaction_date' => 'required|date',
            'details.*.spd' => 'required|numeric|min:0',
            'details.*.std' => 'required|integer|min:0',
            'details.*.pulsa' => 'nullable|numeric|min:0',
            'details.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        
        try {
            $user = $request->user()->load('employee.store');
            
            // Create report
            $report = ShiftReport::create([
                'store_id' => $user->employee->store_id,
                'user_id' => $user->id,
                'report_date' => $validated['report_date'],
                'shift' => $validated['shift'],
                'month_year' => strtoupper($validated['month_year']),
            ]);

            // Create details with auto-calculated APC
            foreach ($validated['details'] as $detail) {
                $apc = $detail['std'] > 0 ? round($detail['spd'] / $detail['std'], 2) : 0;
                
                $report->details()->create([
                    'day_number' => $detail['day_number'],
                    'transaction_date' => $detail['transaction_date'],
                    'spd' => $detail['spd'],
                    'std' => $detail['std'],
                    'apc' => $apc,
                    'pulsa' => $detail['pulsa'] ?? 0,
                    'notes' => $detail['notes'] ?? null,
                ]);
            }

            DB::commit();
            
            return redirect()->route('reports.show', $report->id)
                ->with('success', 'Laporan berhasil dibuat!');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Gagal membuat laporan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Display the specified report.
     */
    public function show(Request $request, ShiftReport $report)
    {
        $report->load(['user', 'store', 'details' => function ($query) {
            $query->orderBy('day_number');
        }]);
        
        // Check authorization
        if ($report->store_id !== $request->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }
        
        return Inertia::render('reports/show', [
            'report' => [
                'id' => $report->id,
                'month_year' => $report->month_year,
                'shift' => $report->shift,
                'report_date' => $report->report_date->format('d M Y'),
                'store_code' => $report->store->code,
                'store_name' => $report->store->name,
                'created_by' => $report->user->name,
                'created_at' => $report->created_at->format('d M Y H:i'),
                'details' => $report->details->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'day_number' => $detail->day_number,
                        'transaction_date' => $detail->transaction_date->format('Y-m-d'),
                        'spd' => $detail->spd,
                        'std' => $detail->std,
                        'apc' => $detail->apc,
                        'pulsa' => $detail->pulsa,
                        'notes' => $detail->notes,
                    ];
                }),
                'totals' => [
                    'spd' => $report->details->sum('spd'),
                    'std' => $report->details->sum('std'),
                    'pulsa' => $report->details->sum('pulsa'),
                    'average_apc' => $report->details->avg('apc'),
                ],
            ],
        ]);
    }

    /**
     * Show the form for editing the specified report.
     */
    public function edit(Request $request, ShiftReport $report)
    {
        $report->load(['details' => function ($query) {
            $query->orderBy('day_number');
        }]);
        
        // Check authorization
        if ($report->store_id !== $request->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }
        
        return Inertia::render('reports/edit', [
            'report' => [
                'id' => $report->id,
                'month_year' => $report->month_year,
                'shift' => $report->shift,
                'report_date' => $report->report_date->format('Y-m-d'),
                'details' => $report->details->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'day_number' => $detail->day_number,
                        'transaction_date' => $detail->transaction_date->format('Y-m-d'),
                        'spd' => $detail->spd,
                        'std' => $detail->std,
                        'apc' => $detail->apc,
                        'pulsa' => $detail->pulsa,
                        'notes' => $detail->notes,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Update the specified report in storage.
     */
    public function update(Request $request, ShiftReport $report)
    {
        // Check authorization
        if ($report->store_id !== $request->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }

        $details = collect($request->input('details', []))
            ->filter(function ($detail) {
                $spd = (float) ($detail['spd'] ?? 0);
                $std = (int) ($detail['std'] ?? 0);
                $pulsa = (float) ($detail['pulsa'] ?? 0);
                $notes = trim((string) ($detail['notes'] ?? ''));

                return $spd > 0 || $std > 0 || $pulsa > 0 || $notes !== '';
            })
            ->values()
            ->all();

        $request->merge(['details' => $details]);

        $validated = $request->validate([
            'month_year' => 'required|string',
            'shift' => 'required|integer|between:1,3',
            'report_date' => 'required|date',
            'details' => 'required|array|min:1',
            'details.*.id' => 'nullable|exists:shift_report_details,id',
            'details.*.day_number' => 'required|integer|between:1,30',
            'details.*.transaction_date' => 'required|date',
            'details.*.spd' => 'required|numeric|min:0',
            'details.*.std' => 'required|integer|min:0',
            'details.*.pulsa' => 'nullable|numeric|min:0',
            'details.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        
        try {
            // Update report
            $report->update([
                'report_date' => $validated['report_date'],
                'shift' => $validated['shift'],
                'month_year' => strtoupper($validated['month_year']),
            ]);

            // Delete old details
            $report->details()->delete();

            // Create new details
            foreach ($validated['details'] as $detail) {
                $apc = $detail['std'] > 0 ? round($detail['spd'] / $detail['std'], 2) : 0;
                
                $report->details()->create([
                    'day_number' => $detail['day_number'],
                    'transaction_date' => $detail['transaction_date'],
                    'spd' => $detail['spd'],
                    'std' => $detail['std'],
                    'apc' => $apc,
                    'pulsa' => $detail['pulsa'] ?? 0,
                    'notes' => $detail['notes'] ?? null,
                ]);
            }

            DB::commit();
            
            return redirect()->route('reports.show', $report->id)
                ->with('success', 'Laporan berhasil diupdate!');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Gagal mengupdate laporan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Remove the specified report from storage.
     */
    public function destroy(Request $request, ShiftReport $report)
    {
        // Check authorization
        if ($report->store_id !== $request->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }
        
        try {
            $report->delete();
            
            return redirect()->route('reports.index')
                ->with('success', 'Laporan berhasil dihapus!');
                
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Gagal menghapus laporan: ' . $e->getMessage()
            ]);
        }
    }
}
