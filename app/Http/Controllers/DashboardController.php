<?php

namespace App\Http\Controllers;

use App\Models\ShiftReport;
use App\Models\ShiftReportDetail;
use App\Models\Store;
use App\Models\CashTransaction;
use App\Models\CashBalance;
use App\Models\Attendance;
use App\Models\Target;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * @OA\Get(
     *      path="/dashboard",
     *      operationId="getDashboardStatistics",
     *      tags={"Dashboard"},
     *      summary="Get dashboard statistics",
     *      description="Returns statistics, recent reports, and sales trend data",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="statistics",
     *                  type="object",
     *                  @OA\Property(property="total_reports_this_month", type="integer", example=15),
     *                  @OA\Property(property="total_sales_this_month", type="number", example=45000000),
     *                  @OA\Property(property="total_transactions_this_month", type="integer", example=1200),
     *                  @OA\Property(property="average_apc_this_month", type="number", example=37500)
     *              ),
     *              @OA\Property(
     *                  property="recentReports",
     *                  type="array",
     *                  @OA\Items(
     *                      type="object",
     *                      @OA\Property(property="id", type="integer", example=1),
     *                      @OA\Property(property="month_year", type="string", example="FEBRUARY 2026"),
     *                      @OA\Property(property="shift", type="integer", example=3),
     *                      @OA\Property(property="report_date", type="string", example="01 Feb 2026"),
     *                      @OA\Property(property="created_by", type="string", example="John Doe"),
     *                      @OA\Property(property="total_spd", type="number", example=2500000)
     *                  )
     *              ),
     *              @OA\Property(property="salesTrend", type="array", @OA\Items(type="object")),
     *              @OA\Property(property="currentMonth", type="string", example="February 2026")
     *          )
     *      )
     * )
     */
    public function index(Request $request)
    {
        $user = $request->user()->load('employee.store');
        $storeId = $user->employee->store_id;
        
        // Get current month statistics
        $currentMonth = now()->format('F Y');
        $currentMonthUpper = strtoupper($currentMonth);
        
        // Shift Reports Statistics
        $statistics = [
            'total_reports_this_month' => ShiftReport::where('month_year', $currentMonthUpper)
                ->where('store_id', $storeId)
                ->count(),
            
            'total_sales_this_month' => ShiftReportDetail::whereHas('shiftReport', function ($query) use ($currentMonthUpper, $storeId) {
                    $query->where('month_year', $currentMonthUpper)
                          ->where('store_id', $storeId);
                })
                ->sum('spd'),
            
            'total_transactions_this_month' => ShiftReportDetail::whereHas('shiftReport', function ($query) use ($currentMonthUpper, $storeId) {
                    $query->where('month_year', $currentMonthUpper)
                          ->where('store_id', $storeId);
                })
                ->sum('std'),
            
            'average_apc_this_month' => ShiftReportDetail::whereHas('shiftReport', function ($query) use ($currentMonthUpper, $storeId) {
                    $query->where('month_year', $currentMonthUpper)
                          ->where('store_id', $storeId);
                })
                ->avg('apc'),
        ];

        // Cash Management Statistics
        $cashStats = [
            'current_balance' => CashBalance::where('store_id', $storeId)
                ->orderBy('balance_date', 'desc')
                ->first()?->closing_balance ?? 0,
            
            'total_income_this_month' => CashTransaction::where('store_id', $storeId)
                ->where('type', 'income')
                ->where('status', 'approved')
                ->whereYear('transaction_date', now()->year)
                ->whereMonth('transaction_date', now()->month)
                ->sum('amount'),
            
            'total_expense_this_month' => CashTransaction::where('store_id', $storeId)
                ->where('type', 'expense')
                ->where('status', 'approved')
                ->whereYear('transaction_date', now()->year)
                ->whereMonth('transaction_date', now()->month)
                ->sum('amount'),
            
            'pending_approvals' => CashTransaction::where('store_id', $storeId)
                ->where('status', 'pending')
                ->count(),
        ];

        // Attendance Statistics
        $attendanceStats = [
            'total_employees' => Employee::where('store_id', $storeId)->count(),
            
            'present_today' => Attendance::where('store_id', $storeId)
                ->whereDate('attendance_date', now())
                ->where('status', 'present')
                ->count(),
            
            'late_today' => Attendance::where('store_id', $storeId)
                ->whereDate('attendance_date', now())
                ->where('status', 'late')
                ->count(),
            
            'attendance_rate_this_month' => $this->calculateAttendanceRate($storeId),
        ];

        // Target Achievement
        $targetStats = [
            'monthly_target' => Target::where('store_id', $storeId)
                ->where('target_type', 'monthly')
                ->whereYear('target_date', now()->year)
                ->whereMonth('target_date', now()->month)
                ->first()?->target_amount ?? 0,
            
            'achievement_percentage' => $this->calculateAchievementPercentage($storeId, $statistics['total_sales_this_month']),
        ];
        
        // Recent reports (last 5)
        $recentReports = ShiftReport::with(['user', 'details'])
            ->where('store_id', $storeId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'month_year' => $report->month_year,
                    'shift' => $report->shift,
                    'report_date' => $report->report_date->format('d M Y'),
                    'created_by' => $report->user->name,
                    'total_days' => $report->details->count(),
                    'total_spd' => $report->details->sum('spd'),
                    'total_std' => $report->details->sum('std'),
                    'created_at' => $report->created_at->diffForHumans(),
                ];
            });
        
        // Sales trend (last 7 days)
        $salesTrend = ShiftReportDetail::whereHas('shiftReport', function ($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->where('transaction_date', '>=', now()->subDays(7))
            ->orderBy('transaction_date')
            ->get()
            ->groupBy(function ($item) {
                return $item->transaction_date->format('Y-m-d');
            })
            ->map(function ($group, $date) {
                return [
                    'date' => \Carbon\Carbon::parse($date)->format('d M'),
                    'spd' => $group->sum('spd'),
                    'std' => $group->sum('std'),
                    'apc' => $group->avg('apc'),
                ];
            })
            ->values();

        // Cash Flow Trend (last 7 days)
        $cashFlowTrend = CashTransaction::where('store_id', $storeId)
            ->where('status', 'approved')
            ->where('transaction_date', '>=', now()->subDays(7))
            ->orderBy('transaction_date')
            ->get()
            ->groupBy(function ($item) {
                return $item->transaction_date->format('Y-m-d');
            })
            ->map(function ($group, $date) {
                return [
                    'date' => \Carbon\Carbon::parse($date)->format('d M'),
                    'income' => $group->where('type', 'income')->sum('amount'),
                    'expense' => $group->where('type', 'expense')->sum('amount'),
                ];
            })
            ->values();

        // Attendance Trend (last 7 days)
        $attendanceTrend = Attendance::where('store_id', $storeId)
            ->where('attendance_date', '>=', now()->subDays(7))
            ->orderBy('attendance_date')
            ->get()
            ->groupBy(function ($item) {
                return $item->attendance_date->format('Y-m-d');
            })
            ->map(function ($group, $date) {
                return [
                    'date' => \Carbon\Carbon::parse($date)->format('d M'),
                    'present' => $group->where('status', 'present')->count(),
                    'late' => $group->where('status', 'late')->count(),
                    'absent' => $group->where('status', 'absent')->count(),
                ];
            })
            ->values();

        // Top Performers (employees with most reports)
        $topPerformers = ShiftReport::where('store_id', $storeId)
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->select('user_id', DB::raw('count(*) as report_count'))
            ->groupBy('user_id')
            ->orderBy('report_count', 'desc')
            ->take(5)
            ->with('user.employee')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->user->name,
                    'nik' => $item->user->employee->nik ?? '-',
                    'report_count' => $item->report_count,
                ];
            });
        
        return Inertia::render('dashboard/index', [
            'statistics' => $statistics,
            'cashStats' => $cashStats,
            'attendanceStats' => $attendanceStats,
            'targetStats' => $targetStats,
            'recentReports' => $recentReports,
            'salesTrend' => $salesTrend,
            'cashFlowTrend' => $cashFlowTrend,
            'attendanceTrend' => $attendanceTrend,
            'topPerformers' => $topPerformers,
            'currentMonth' => $currentMonth,
        ]);
    }

    private function calculateAttendanceRate($storeId)
    {
        $totalEmployees = Employee::where('store_id', $storeId)->count();
        if ($totalEmployees === 0) return 0;

        $workingDays = now()->day; // Days passed in current month
        $totalExpectedAttendance = $totalEmployees * $workingDays;
        
        $actualAttendance = Attendance::where('store_id', $storeId)
            ->whereYear('attendance_date', now()->year)
            ->whereMonth('attendance_date', now()->month)
            ->whereIn('status', ['present', 'late'])
            ->count();

        return $totalExpectedAttendance > 0 
            ? round(($actualAttendance / $totalExpectedAttendance) * 100, 1)
            : 0;
    }

    private function calculateAchievementPercentage($storeId, $currentSales)
    {
        $target = Target::where('store_id', $storeId)
            ->where('target_type', 'monthly')
            ->whereYear('target_date', now()->year)
            ->whereMonth('target_date', now()->month)
            ->first();

        if (!$target || $target->target_amount == 0) return 0;

        return round(($currentSales / $target->target_amount) * 100, 1);
    }
}
