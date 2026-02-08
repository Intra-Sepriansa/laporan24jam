<?php

namespace App\Http\Controllers;

use App\Models\ShiftReport;
use App\Models\ShiftReportDetail;
use App\Models\Target;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SummaryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load('employee.store');
        $storeId = $user->employee->store_id;
        $store = $user->employee->store;

        $currentMonth = now()->format('F Y');
        $currentMonthUpper = strtoupper($currentMonth);

        // Get all reports for current month
        $reports = ShiftReport::with(['user', 'details' => function ($q) {
            $q->orderBy('day_number');
        }])
            ->where('store_id', $storeId)
            ->where('month_year', $currentMonthUpper)
            ->orderBy('shift')
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'month_year' => $report->month_year,
                    'shift' => $report->shift,
                    'report_date' => $report->report_date->format('d M Y'),
                    'created_by' => $report->user->name,
                    'total_days' => $report->details->count(),
                    'total_spd' => round($report->details->sum('spd'), 2),
                    'total_std' => $report->details->sum('std'),
                    'total_pulsa' => round($report->details->sum('pulsa'), 2),
                    'avg_apc' => round($report->details->avg('apc') ?? 0, 2),
                    'created_at' => $report->created_at->format('d M Y H:i'),
                ];
            });

        // Monthly summary
        $allDetails = ShiftReportDetail::whereHas('shiftReport', function ($q) use ($currentMonthUpper, $storeId) {
            $q->where('month_year', $currentMonthUpper)->where('store_id', $storeId);
        })->get();

        $summary = [
            'total_spd' => round($allDetails->sum('spd'), 2),
            'total_std' => $allDetails->sum('std'),
            'total_pulsa' => round($allDetails->sum('pulsa'), 2),
            'avg_apc' => round($allDetails->avg('apc') ?? 0, 2),
            'total_days' => $allDetails->count(),
            'total_reports' => $reports->count(),
            'avg_daily_spd' => $allDetails->count() > 0 ? round($allDetails->sum('spd') / $allDetails->groupBy(fn($d) => $d->transaction_date->format('Y-m-d'))->count(), 2) : 0,
            'avg_daily_std' => $allDetails->count() > 0 ? round($allDetails->sum('std') / $allDetails->groupBy(fn($d) => $d->transaction_date->format('Y-m-d'))->count()) : 0,
        ];

        // Target comparison
        $target = Target::where('store_id', $storeId)
            ->where('month_year', $currentMonthUpper)
            ->first();

        $targetComparison = null;
        if ($target) {
            $targetComparison = [
                'target_spd' => $target->target_spd,
                'target_std' => $target->target_std,
                'target_apc' => $target->target_apc,
                'target_pulsa' => $target->target_pulsa,
                'progress_spd' => $target->target_spd > 0 ? min(round(($summary['total_spd'] / $target->target_spd) * 100, 1), 100) : 0,
                'progress_std' => $target->target_std > 0 ? min(round(($summary['total_std'] / $target->target_std) * 100, 1), 100) : 0,
                'progress_apc' => $target->target_apc > 0 ? min(round(($summary['avg_apc'] / $target->target_apc) * 100, 1), 100) : 0,
                'progress_pulsa' => $target->target_pulsa > 0 ? min(round(($summary['total_pulsa'] / $target->target_pulsa) * 100, 1), 100) : 0,
            ];
        }

        // Available months for export
        $availableMonths = ShiftReport::where('store_id', $storeId)
            ->select('month_year')
            ->distinct()
            ->orderBy('month_year', 'desc')
            ->pluck('month_year');

        // Export history (all reports)
        $allReports = ShiftReport::with('user')
            ->where('store_id', $storeId)
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'month_year' => $report->month_year,
                    'shift' => $report->shift,
                    'created_by' => $report->user->name,
                    'created_at' => $report->created_at->format('d M Y H:i'),
                ];
            });

        return Inertia::render('summary/index', [
            'store' => [
                'code' => $store->code,
                'name' => $store->name,
            ],
            'reports' => $reports,
            'summary' => $summary,
            'targetComparison' => $targetComparison,
            'availableMonths' => $availableMonths,
            'allReports' => $allReports,
            'currentMonth' => $currentMonth,
        ]);
    }
}
