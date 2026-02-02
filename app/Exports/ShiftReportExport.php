<?php

namespace App\Exports;

use App\Models\ShiftReport;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ShiftReportExport implements FromCollection, WithHeadings, WithMapping, WithTitle, WithStyles
{
    protected $report;

    public function __construct(ShiftReport $report)
    {
        $this->report = $report;
    }

    public function collection()
    {
        return $this->report->details()->orderBy('day_number')->get();
    }

    public function headings(): array
    {
        return [
            ['ALFAMART'],
            ['LAPORAN SHIFT ' . $this->report->shift],
            [$this->report->month_year],
            ['Kode Toko: ' . $this->report->store->code],
            ['Nama Toko: ' . $this->report->store->name],
            [''],
            ['No', 'Tanggal', 'SPD (Rp)', 'STD', 'APC (Rp)', 'Pulsa (Rp)'],
        ];
    }

    public function map($detail): array
    {
        return [
            $detail->day_number,
            $detail->transaction_date->format('d/m/Y'),
            $detail->spd,
            $detail->std,
            $detail->apc,
            $detail->pulsa,
        ];
    }

    public function title(): string
    {
        return 'Laporan ' . $this->report->month_year;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 16]],
            2 => ['font' => ['bold' => true, 'size' => 14]],
            3 => ['font' => ['bold' => true, 'size' => 12]],
            7 => ['font' => ['bold' => true], 'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'E31E24']]],
        ];
    }
}
