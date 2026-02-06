<?php

namespace App\Http\Controllers;

use App\Models\ShiftReport;
use App\Models\ShiftReportDetail;
use App\Models\Store;
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
        
        // Get current month statistics
        $currentMonth = now()->format('F Y');
        $currentMonthUpper = strtoupper($currentMonth);
        
        // Statistics
        $statistics = [
            'total_reports_this_month' => ShiftReport::where('month_year', $currentMonthUpper)
                ->where('store_id', $user->employee->store_id)
                ->count(),
            
            'total_sales_this_month' => ShiftReportDetail::whereHas('shiftReport', function ($query) use ($currentMonthUpper, $user) {
                    $query->where('month_year', $currentMonthUpper)
                          ->where('store_id', $user->employee->store_id);
                })
                ->sum('spd'),
            
            'total_transactions_this_month' => ShiftReportDetail::whereHas('shiftReport', function ($query) use ($currentMonthUpper, $user) {
                    $query->where('month_year', $currentMonthUpper)
                          ->where('store_id', $user->employee->store_id);
                })
                ->sum('std'),
            
            'average_apc_this_month' => ShiftReportDetail::whereHas('shiftReport', function ($query) use ($currentMonthUpper, $user) {
                    $query->where('month_year', $currentMonthUpper)
                          ->where('store_id', $user->employee->store_id);
                })
                ->avg('apc'),
        ];
        
        // Recent reports (last 5)
        $recentReports = ShiftReport::with(['user', 'details'])
            ->where('store_id', $user->employee->store_id)
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
        $salesTrend = ShiftReportDetail::whereHas('shiftReport', function ($query) use ($user) {
                $query->where('store_id', $user->employee->store_id);
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
        
        return Inertia::render('dashboard/index', [
            'statistics' => $statistics,
            'recentReports' => $recentReports,
            'salesTrend' => $salesTrend,
            'currentMonth' => $currentMonth,
        ]);
    }
}
