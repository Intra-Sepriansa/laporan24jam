<?php

namespace App\Http\Controllers;

use App\Models\ShiftReport;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ShiftReportExport;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    /**
     * Export report to PDF
     */
    public function exportPdf(ShiftReport $report)
    {
        // Check authorization
        if ($report->store_id !== auth()->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }

        $report->load(['user', 'store', 'details' => function ($query) {
            $query->orderBy('day_number');
        }]);

        $data = [
            'report' => $report,
            'totals' => [
                'spd' => $report->details->sum('spd'),
                'std' => $report->details->sum('std'),
                'pulsa' => $report->details->sum('pulsa'),
                'average_apc' => $report->details->avg('apc'),
            ],
        ];

        $pdf = Pdf::loadView('reports.pdf', $data);
        $pdf->setPaper('a4', 'portrait');

        $filename = 'Laporan_' . $report->store->code . '_' . str_replace(' ', '_', $report->month_year) . '.pdf';

        return $pdf->download($filename);
    }

    /**
     * Export report to Excel
     */
    public function exportExcel(ShiftReport $report)
    {
        // Check authorization
        if ($report->store_id !== auth()->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }

        $report->load(['user', 'store', 'details' => function ($query) {
            $query->orderBy('day_number');
        }]);

        $filename = 'Laporan_' . $report->store->code . '_' . str_replace(' ', '_', $report->month_year) . '.xlsx';

        return Excel::download(new ShiftReportExport($report), $filename);
    }
}
