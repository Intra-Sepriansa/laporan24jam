<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan {{ $report->month_year }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 3px solid #E31E24;
        }

        .header h1 {
            color: #E31E24;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .header h2 {
            color: #0066CC;
            font-size: 18px;
            margin-bottom: 3px;
        }

        .header p {
            font-size: 14px;
            color: #666;
        }

        .info-section {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f8f9fa;
            border-left: 4px solid #E31E24;
        }

        .info-section table {
            width: 100%;
        }

        .info-section td {
            padding: 3px 0;
        }

        .info-section td:first-child {
            font-weight: bold;
            width: 150px;
        }

        .summary-boxes {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }

        .summary-box {
            display: table-cell;
            width: 25%;
            padding: 10px;
            text-align: center;
            border: 2px solid #ddd;
            margin-right: 10px;
        }

        .summary-box:first-child {
            border-color: #E31E24;
        }

        .summary-box:nth-child(2) {
            border-color: #0066CC;
        }

        .summary-box:nth-child(3) {
            border-color: #FFB81C;
        }

        .summary-box:last-child {
            border-color: #10B981;
            margin-right: 0;
        }

        .summary-box .label {
            font-size: 10px;
            color: #666;
            margin-bottom: 5px;
        }

        .summary-box .value {
            font-size: 16px;
            font-weight: bold;
        }

        .summary-box:first-child .value {
            color: #E31E24;
        }

        .summary-box:nth-child(2) .value {
            color: #0066CC;
        }

        .summary-box:nth-child(3) .value {
            color: #FFB81C;
        }

        .summary-box:last-child .value {
            color: #10B981;
        }

        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        table.data-table th {
            background-color: #E31E24;
            color: white;
            padding: 8px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #ddd;
        }

        table.data-table th.text-right {
            text-align: right;
        }

        table.data-table td {
            padding: 6px 8px;
            border: 1px solid #ddd;
        }

        table.data-table td.text-right {
            text-align: right;
        }

        table.data-table tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        table.data-table tfoot tr {
            background-color: #fff3cd;
            font-weight: bold;
        }

        table.data-table tfoot td {
            padding: 10px 8px;
            border-top: 2px solid #E31E24;
        }

        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #ddd;
            text-align: center;
            font-size: 10px;
            color: #666;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>ALFAMART</h1>
        <h2>LAPORAN SHIFT {{ $report->shift }}</h2>
        <p>{{ $report->month_year }}</p>
    </div>

    <!-- Info Section -->
    <div class="info-section">
        <table>
            <tr>
                <td>Kode Toko</td>
                <td>: {{ $report->store->code }}</td>
            </tr>
            <tr>
                <td>Nama Toko</td>
                <td>: {{ $report->store->name }}</td>
            </tr>
            <tr>
                <td>Area</td>
                <td>: {{ $report->store->area }}</td>
            </tr>
            <tr>
                <td>Tanggal Laporan</td>
                <td>: {{ $report->report_date->format('d F Y') }}</td>
            </tr>
            <tr>
                <td>Dibuat oleh</td>
                <td>: {{ $report->user->name }}</td>
            </tr>
        </table>
    </div>

    <!-- Summary Boxes -->
    <div class="summary-boxes">
        <div class="summary-box">
            <div class="label">Total SPD</div>
            <div class="value">Rp {{ number_format($totals['spd'], 0, ',', '.') }}</div>
        </div>
        <div class="summary-box">
            <div class="label">Total STD</div>
            <div class="value">{{ number_format($totals['std'], 0, ',', '.') }}</div>
        </div>
        <div class="summary-box">
            <div class="label">Rata-rata APC</div>
            <div class="value">Rp {{ number_format($totals['average_apc'], 0, ',', '.') }}</div>
        </div>
        <div class="summary-box">
            <div class="label">Total Pulsa</div>
            <div class="value">Rp {{ number_format($totals['pulsa'], 0, ',', '.') }}</div>
        </div>
    </div>

    <!-- Data Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 15%;">Tanggal</th>
                <th class="text-right" style="width: 20%;">SPD (Rp)</th>
                <th class="text-right" style="width: 15%;">STD</th>
                <th class="text-right" style="width: 20%;">APC (Rp)</th>
                <th class="text-right" style="width: 20%;">Pulsa (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($report->details as $detail)
            <tr>
                <td>{{ $detail->day_number }}</td>
                <td>{{ $detail->transaction_date->format('d/m/Y') }}</td>
                <td class="text-right">{{ number_format($detail->spd, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($detail->std, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($detail->apc, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($detail->pulsa, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2" style="text-align: right;">TOTAL:</td>
                <td class="text-right">{{ number_format($totals['spd'], 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($totals['std'], 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($totals['average_apc'], 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($totals['pulsa'], 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <!-- Footer -->
    <div class="footer">
        <p>Dicetak pada: {{ now()->format('d F Y H:i:s') }}</p>
        <p>© 2026 Alfamart - Sistem Laporan Shift 3</p>
        <p>Belanja Puas, Harga Pas!</p>
    </div>
</body>
</html>
