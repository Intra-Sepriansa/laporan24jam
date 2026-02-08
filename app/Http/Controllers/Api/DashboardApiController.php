<?php

namespace App\Http\Controllers\Api;

use App\Models\ShiftReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardApiController extends ApiController
{
    /**
     * @OA\Get(
     *     path="/api/dashboard/statistics",
     *     tags={"Dashboard"},
     *     summary="Get dashboard statistics",
     *     description="Mendapatkan statistik dashboard untuk bulan ini",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dashboard statistics",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="total_reports_this_month", type="integer", example=5),
     *                 @OA\Property(property="total_sales_this_month", type="number", example=185000000),
     *                 @OA\Property(property="total_transactions_this_month", type="integer", example=3500),
     *                 @OA\Property(property="average_apc_this_month", type="number", example=52857),
     *                 @OA\Property(property="current_month", type="string", example="FEBRUARY 2026")
     *             )
     *         )
     *     )
     * )
     */
    public function statistics(Request $request)
    {
        $user = $request->user();
        $currentMonth = now()->format('F Y');
        $storeId = $user->employee->store_id;

        $statistics = ShiftReport::where('store_id', $storeId)
            ->where('month_year', strtoupper($currentMonth))
            ->selectRaw('
                COUNT(*) as total_reports_this_month,
                COALESCE(SUM(total_spd), 0) as total_sales_this_month,
                COALESCE(SUM(total_std), 0) as total_transactions_this_month,
                COALESCE(AVG(average_apc), 0) as average_apc_this_month
            ')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'total_reports_this_month' => $statistics->total_reports_this_month ?? 0,
                'total_sales_this_month' => $statistics->total_sales_this_month ?? 0,
                'total_transactions_this_month' => $statistics->total_transactions_this_month ?? 0,
                'average_apc_this_month' => $statistics->average_apc_this_month ?? 0,
                'current_month' => strtoupper($currentMonth),
            ],
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/dashboard/sales-trend",
     *     tags={"Dashboard"},
     *     summary="Get sales trend",
     *     description="Mendapatkan tren penjualan 7 hari terakhir",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Sales trend data",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="date", type="string", example="01 Feb"),
     *                     @OA\Property(property="spd", type="number", example=6360500),
     *                     @OA\Property(property="std", type="integer", example=107),
     *                     @OA\Property(property="apc", type="number", example=59443)
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function salesTrend(Request $request)
    {
        $user = $request->user();
        $storeId = $user->employee->store_id;
        $sevenDaysAgo = now()->subDays(7);

        $salesTrend = DB::table('shift_report_details')
            ->join('shift_reports', 'shift_report_details.shift_report_id', '=', 'shift_reports.id')
            ->where('shift_reports.store_id', $storeId)
            ->where('shift_report_details.transaction_date', '>=', $sevenDaysAgo)
            ->select(
                'shift_report_details.transaction_date as date',
                DB::raw('SUM(shift_report_details.spd) as spd'),
                DB::raw('SUM(shift_report_details.std) as std'),
                DB::raw('AVG(shift_report_details.apc) as apc')
            )
            ->groupBy('shift_report_details.transaction_date')
            ->orderBy('shift_report_details.transaction_date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('d M'),
                    'spd' => (float) $item->spd,
                    'std' => (int) $item->std,
                    'apc' => (float) $item->apc,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $salesTrend,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/dashboard/recent-reports",
     *     tags={"Dashboard"},
     *     summary="Get recent reports",
     *     description="Mendapatkan 5 laporan terbaru",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Recent reports",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="month_year", type="string", example="FEBRUARY 2026"),
     *                     @OA\Property(property="shift", type="integer", example=3),
     *                     @OA\Property(property="report_date", type="string", example="2026-02-06"),
     *                     @OA\Property(property="created_by", type="string", example="SUNARDI"),
     *                     @OA\Property(property="total_days", type="integer", example=28),
     *                     @OA\Property(property="total_spd", type="number", example=185000000),
     *                     @OA\Property(property="total_std", type="integer", example=3500),
     *                     @OA\Property(property="created_at", type="string", example="06 Feb 2026")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function recentReports(Request $request)
    {
        $user = $request->user();
        $storeId = $user->employee->store_id;

        $recentReports = ShiftReport::with('user')
            ->where('store_id', $storeId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'month_year' => $report->month_year,
                    'shift' => $report->shift,
                    'report_date' => $report->report_date,
                    'created_by' => $report->user->name,
                    'total_days' => $report->details()->count(),
                    'total_spd' => $report->total_spd,
                    'total_std' => $report->total_std,
                    'created_at' => Carbon::parse($report->created_at)->format('d M Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $recentReports,
        ]);
    }
}
