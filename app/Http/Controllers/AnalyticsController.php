<?php

namespace App\Http\Controllers;

use App\Models\ShiftReport;
use App\Models\ShiftReportDetail;
use App\Models\Target;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load('employee.store');
        $storeId = $user->employee->store_id;

        $currentMonth = now()->format('F Y');
        $currentMonthUpper = strtoupper($currentMonth);
        $lastMonth = now()->subMonth()->format('F Y');
        $lastMonthUpper = strtoupper($lastMonth);

        // Current month data
        $currentMonthDetails = ShiftReportDetail::whereHas('shiftReport', function ($q) use ($currentMonthUpper, $storeId) {
            $q->where('month_year', $currentMonthUpper)->where('store_id', $storeId);
        })->get();

        // Last month data
        $lastMonthDetails = ShiftReportDetail::whereHas('shiftReport', function ($q) use ($lastMonthUpper, $storeId) {
            $q->where('month_year', $lastMonthUpper)->where('store_id', $storeId);
        })->get();

        // Monthly comparison
        $comparison = [
            'current' => [
                'month' => $currentMonth,
                'total_spd' => $currentMonthDetails->sum('spd'),
                'total_std' => $currentMonthDetails->sum('std'),
                'avg_apc' => $currentMonthDetails->avg('apc') ?? 0,
                'total_pulsa' => $currentMonthDetails->sum('pulsa'),
                'total_days' => $currentMonthDetails->count(),
            ],
            'previous' => [
                'month' => $lastMonth,
                'total_spd' => $lastMonthDetails->sum('spd'),
                'total_std' => $lastMonthDetails->sum('std'),
                'avg_apc' => $lastMonthDetails->avg('apc') ?? 0,
                'total_pulsa' => $lastMonthDetails->sum('pulsa'),
                'total_days' => $lastMonthDetails->count(),
            ],
        ];

        // Growth percentages
        $comparison['growth'] = [
            'spd' => $comparison['previous']['total_spd'] > 0
                ? round((($comparison['current']['total_spd'] - $comparison['previous']['total_spd']) / $comparison['previous']['total_spd']) * 100, 1)
                : 0,
            'std' => $comparison['previous']['total_std'] > 0
                ? round((($comparison['current']['total_std'] - $comparison['previous']['total_std']) / $comparison['previous']['total_std']) * 100, 1)
                : 0,
            'apc' => $comparison['previous']['avg_apc'] > 0
                ? round((($comparison['current']['avg_apc'] - $comparison['previous']['avg_apc']) / $comparison['previous']['avg_apc']) * 100, 1)
                : 0,
            'pulsa' => $comparison['previous']['total_pulsa'] > 0
                ? round((($comparison['current']['total_pulsa'] - $comparison['previous']['total_pulsa']) / $comparison['previous']['total_pulsa']) * 100, 1)
                : 0,
        ];

        // Daily breakdown for current month (for chart)
        $dailyData = $currentMonthDetails
            ->sortBy('transaction_date')
            ->groupBy(fn($item) => $item->transaction_date->format('Y-m-d'))
            ->map(function ($group, $date) {
                return [
                    'date' => Carbon::parse($date)->format('d M'),
                    'full_date' => $date,
                    'spd' => round($group->sum('spd'), 2),
                    'std' => $group->sum('std'),
                    'apc' => round($group->avg('apc'), 2),
                    'pulsa' => round($group->sum('pulsa'), 2),
                ];
            })
            ->values();

        // Best & worst days
        $bestDay = $dailyData->sortByDesc('spd')->first();
        $worstDay = $dailyData->sortBy('spd')->first();

        // Weekly distribution
        $weeklyData = $currentMonthDetails
            ->groupBy(function ($item) {
                $weekNum = $item->transaction_date->weekOfMonth;
                return 'Minggu ' . $weekNum;
            })
            ->map(function ($group, $week) {
                return [
                    'week' => $week,
                    'spd' => round($group->sum('spd'), 2),
                    'std' => $group->sum('std'),
                    'avg_apc' => round($group->avg('apc'), 2),
                ];
            })
            ->values();

        // Day of week analysis
        $dayOfWeekData = $currentMonthDetails
            ->groupBy(function ($item) {
                $dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                return $dayNames[$item->transaction_date->dayOfWeek];
            })
            ->map(function ($group, $day) {
                return [
                    'day' => $day,
                    'avg_spd' => round($group->avg('spd'), 2),
                    'avg_std' => round($group->avg('std')),
                    'avg_apc' => round($group->avg('apc'), 2),
                    'count' => $group->count(),
                ];
            })
            ->values();

        // Last 6 months trend
        $monthlyTrend = collect();
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthUpper = strtoupper($month->format('F Y'));
            $details = ShiftReportDetail::whereHas('shiftReport', function ($q) use ($monthUpper, $storeId) {
                $q->where('month_year', $monthUpper)->where('store_id', $storeId);
            })->get();

            $monthlyTrend->push([
                'month' => $month->format('M Y'),
                'month_short' => $month->format('M'),
                'spd' => round($details->sum('spd'), 2),
                'std' => $details->sum('std'),
                'avg_apc' => round($details->avg('apc') ?? 0, 2),
                'pulsa' => round($details->sum('pulsa'), 2),
            ]);
        }

        // Insights
        $insights = [];
        if ($comparison['growth']['spd'] > 0) {
            $insights[] = [
                'type' => 'positive',
                'icon' => 'trending-up',
                'message' => "Penjualan naik {$comparison['growth']['spd']}% dibanding bulan lalu",
            ];
        } elseif ($comparison['growth']['spd'] < 0) {
            $insights[] = [
                'type' => 'negative',
                'icon' => 'trending-down',
                'message' => "Penjualan turun " . abs($comparison['growth']['spd']) . "% dibanding bulan lalu",
            ];
        }

        if ($bestDay) {
            $insights[] = [
                'type' => 'info',
                'icon' => 'star',
                'message' => "Hari terbaik: {$bestDay['date']} dengan SPD " . number_format($bestDay['spd'], 0, ',', '.'),
            ];
        }

        if ($comparison['growth']['apc'] > 0) {
            $insights[] = [
                'type' => 'positive',
                'icon' => 'zap',
                'message' => "APC meningkat {$comparison['growth']['apc']}% — pelanggan belanja lebih banyak!",
            ];
        }

        return Inertia::render('analytics/index', [
            'comparison' => $comparison,
            'dailyData' => $dailyData,
            'weeklyData' => $weeklyData,
            'dayOfWeekData' => $dayOfWeekData,
            'monthlyTrend' => $monthlyTrend,
            'bestDay' => $bestDay,
            'worstDay' => $worstDay,
            'insights' => $insights,
            'currentMonth' => $currentMonth,
        ]);
    }
}
