<?php

namespace App\Http\Controllers\Api;

use App\Models\ShiftReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportApiController extends ApiController
{
    /**
     * @OA\Get(
     *     path="/api/reports",
     *     tags={"Reports"},
     *     summary="Get all shift reports",
     *     description="Mendapatkan daftar semua laporan shift dengan pagination",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Items per page",
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search by month_year",
     *         @OA\Schema(type="string", example="FEBRUARY 2026")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of reports",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="data", type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="month_year", type="string", example="FEBRUARY 2026"),
     *                         @OA\Property(property="shift", type="integer", example=3),
     *                         @OA\Property(property="report_date", type="string", example="2026-02-06"),
     *                         @OA\Property(property="store_code", type="string", example="TB56"),
     *                         @OA\Property(property="store_name", type="string", example="RAYA CANGKUDU CISOKA"),
     *                         @OA\Property(property="total_spd", type="number", example=185000000),
     *                         @OA\Property(property="total_std", type="integer", example=3500)
     *                     )
     *                 ),
     *                 @OA\Property(property="per_page", type="integer", example=10),
     *                 @OA\Property(property="total", type="integer", example=50)
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = ShiftReport::with(['store', 'user'])
            ->where('store_id', $request->user()->employee->store_id);

        if ($request->has('search')) {
            $query->where('month_year', 'like', '%' . $request->search . '%');
        }

        $reports = $query->orderBy('report_date', 'desc')
            ->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $reports,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/reports/{id}",
     *     tags={"Reports"},
     *     summary="Get report by ID",
     *     description="Mendapatkan detail laporan shift berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Report ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Report details",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="month_year", type="string", example="FEBRUARY 2026"),
     *                 @OA\Property(property="shift", type="integer", example=3),
     *                 @OA\Property(property="report_date", type="string", example="2026-02-06"),
     *                 @OA\Property(property="store_code", type="string", example="TB56"),
     *                 @OA\Property(property="store_name", type="string", example="RAYA CANGKUDU CISOKA"),
     *                 @OA\Property(property="details", type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="day_number", type="integer", example=1),
     *                         @OA\Property(property="transaction_date", type="string", example="2026-02-01"),
     *                         @OA\Property(property="spd", type="number", example=6360500),
     *                         @OA\Property(property="std", type="integer", example=107),
     *                         @OA\Property(property="apc", type="number", example=59443),
     *                         @OA\Property(property="pulsa", type="number", example=0)
     *                     )
     *                 ),
     *                 @OA\Property(property="totals", type="object",
     *                     @OA\Property(property="spd", type="number", example=185000000),
     *                     @OA\Property(property="std", type="integer", example=3500),
     *                     @OA\Property(property="pulsa", type="number", example=5000000),
     *                     @OA\Property(property="average_apc", type="number", example=52857)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Report not found"
     *     )
     * )
     */
    public function show($id)
    {
        $report = ShiftReport::with(['store', 'user', 'details'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $report->id,
                'month_year' => $report->month_year,
                'shift' => $report->shift,
                'report_date' => $report->report_date,
                'store_code' => $report->store->code,
                'store_name' => $report->store->name,
                'created_by' => $report->user->name,
                'details' => $report->details,
                'totals' => [
                    'spd' => $report->total_spd,
                    'std' => $report->total_std,
                    'pulsa' => $report->total_pulsa,
                    'average_apc' => $report->average_apc,
                ],
            ],
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/reports",
     *     tags={"Reports"},
     *     summary="Create new report",
     *     description="Membuat laporan shift baru",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"month_year","shift","report_date","details"},
     *             @OA\Property(property="month_year", type="string", example="FEBRUARY 2026"),
     *             @OA\Property(property="shift", type="integer", example=3),
     *             @OA\Property(property="report_date", type="string", format="date", example="2026-02-06"),
     *             @OA\Property(property="details", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="day_number", type="integer", example=1),
     *                     @OA\Property(property="transaction_date", type="string", format="date", example="2026-02-01"),
     *                     @OA\Property(property="spd", type="number", example=6360500),
     *                     @OA\Property(property="std", type="integer", example=107),
     *                     @OA\Property(property="pulsa", type="number", example=0),
     *                     @OA\Property(property="notes", type="string", example="")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Report created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Laporan berhasil dibuat"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'month_year' => 'required|string',
            'shift' => 'required|integer|in:1,2,3',
            'report_date' => 'required|date',
            'details' => 'required|array|min:1',
            'details.*.day_number' => 'required|integer|min:1|max:31',
            'details.*.transaction_date' => 'required|date',
            'details.*.spd' => 'required|numeric|min:0',
            'details.*.std' => 'required|integer|min:0',
            'details.*.pulsa' => 'required|numeric|min:0',
            'details.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $report = ShiftReport::create([
                'store_id' => $request->user()->employee->store_id,
                'user_id' => $request->user()->id,
                'month_year' => $validated['month_year'],
                'shift' => $validated['shift'],
                'report_date' => $validated['report_date'],
            ]);

            foreach ($validated['details'] as $detail) {
                $apc = $detail['std'] > 0 ? $detail['spd'] / $detail['std'] : 0;
                
                $report->details()->create([
                    'day_number' => $detail['day_number'],
                    'transaction_date' => $detail['transaction_date'],
                    'spd' => $detail['spd'],
                    'std' => $detail['std'],
                    'apc' => $apc,
                    'pulsa' => $detail['pulsa'],
                    'notes' => $detail['notes'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Laporan berhasil dibuat',
                'data' => ['id' => $report->id],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat laporan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/reports/{id}",
     *     tags={"Reports"},
     *     summary="Update report",
     *     description="Update laporan shift yang sudah ada",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Report ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"month_year","shift","report_date","details"},
     *             @OA\Property(property="month_year", type="string", example="FEBRUARY 2026"),
     *             @OA\Property(property="shift", type="integer", example=3),
     *             @OA\Property(property="report_date", type="string", format="date", example="2026-02-06"),
     *             @OA\Property(property="details", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="day_number", type="integer", example=1),
     *                     @OA\Property(property="transaction_date", type="string", format="date", example="2026-02-01"),
     *                     @OA\Property(property="spd", type="number", example=6360500),
     *                     @OA\Property(property="std", type="integer", example=107),
     *                     @OA\Property(property="pulsa", type="number", example=0),
     *                     @OA\Property(property="notes", type="string", example="")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Report updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Laporan berhasil diupdate")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $report = ShiftReport::findOrFail($id);

        $validated = $request->validate([
            'month_year' => 'required|string',
            'shift' => 'required|integer|in:1,2,3',
            'report_date' => 'required|date',
            'details' => 'required|array|min:1',
            'details.*.day_number' => 'required|integer|min:1|max:31',
            'details.*.transaction_date' => 'required|date',
            'details.*.spd' => 'required|numeric|min:0',
            'details.*.std' => 'required|integer|min:0',
            'details.*.pulsa' => 'required|numeric|min:0',
            'details.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $report->update([
                'month_year' => $validated['month_year'],
                'shift' => $validated['shift'],
                'report_date' => $validated['report_date'],
            ]);

            $report->details()->delete();

            foreach ($validated['details'] as $detail) {
                $apc = $detail['std'] > 0 ? $detail['spd'] / $detail['std'] : 0;
                
                $report->details()->create([
                    'day_number' => $detail['day_number'],
                    'transaction_date' => $detail['transaction_date'],
                    'spd' => $detail['spd'],
                    'std' => $detail['std'],
                    'apc' => $apc,
                    'pulsa' => $detail['pulsa'],
                    'notes' => $detail['notes'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Laporan berhasil diupdate',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal update laporan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/reports/{id}",
     *     tags={"Reports"},
     *     summary="Delete report",
     *     description="Hapus laporan shift",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Report ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Report deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Laporan berhasil dihapus")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Report not found"
     *     )
     * )
     */
    public function destroy($id)
    {
        $report = ShiftReport::findOrFail($id);
        $report->delete();

        return response()->json([
            'success' => true,
            'message' => 'Laporan berhasil dihapus',
        ]);
    }
}
