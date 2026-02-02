import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Download, Printer, FileText } from 'lucide-react';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';

interface Detail {
    id: number;
    day_number: number;
    transaction_date: string;
    spd: number;
    std: number;
    apc: number;
    pulsa: number;
    notes: string | null;
}

interface Report {
    id: number;
    month_year: string;
    shift: number;
    report_date: string;
    store_code: string;
    store_name: string;
    created_by: string;
    created_at: string;
    details: Detail[];
    totals: {
        spd: number;
        std: number;
        pulsa: number;
        average_apc: number;
    };
}

interface Props {
    report: Report;
}

export default function ShowReport({ report }: Props) {
    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
            router.delete(route('reports.destroy', report.id));
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout>
            <Head title={`Laporan ${report.month_year}`} />

            <div className="space-y-6 print:space-y-4">
                {/* Header - Hide on print */}
                <div className="flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" asChild>
                            <a href={route('reports.index')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </a>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Detail Laporan</h1>
                            <p className="text-gray-600 mt-1">
                                {report.month_year} - Shift {report.shift}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="outline" asChild>
                            <a href={route('reports.edit', report.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </a>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                        </Button>
                    </div>
                </div>

                {/* Print Header - Show only on print */}
                <div className="hidden print:block text-center mb-6">
                    <h1 className="text-2xl font-bold text-primary">ALFAMART</h1>
                    <h2 className="text-xl font-semibold mt-2">LAPORAN SHIFT {report.shift}</h2>
                    <p className="text-lg mt-1">{report.month_year}</p>
                </div>

                {/* Report Info */}
                <Card className="print:shadow-none print:border-2">
                    <CardHeader className="print:pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">
                                    {report.month_year}
                                </CardTitle>
                                <CardDescription className="mt-2">
                                    <div className="space-y-1">
                                        <p><strong>Kode Toko:</strong> {report.store_code}</p>
                                        <p><strong>Nama Toko:</strong> {report.store_name}</p>
                                        <p><strong>Shift:</strong> {report.shift}</p>
                                        <p><strong>Tanggal Laporan:</strong> {report.report_date}</p>
                                        <p><strong>Dibuat oleh:</strong> {report.created_by}</p>
                                        <p><strong>Dibuat pada:</strong> {report.created_at}</p>
                                    </div>
                                </CardDescription>
                            </div>
                            <Badge variant="default" className="text-lg px-4 py-2 print:hidden">
                                Shift {report.shift}
                            </Badge>
                        </div>
                    </CardHeader>
                </Card>

                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:gap-2">
                    <Card className="border-l-4 border-l-primary print:shadow-none">
                        <CardHeader className="pb-2 print:pb-1">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total SPD
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-primary print:text-xl">
                                {formatCurrency(report.totals.spd)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-secondary print:shadow-none">
                        <CardHeader className="pb-2 print:pb-1">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total STD
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-secondary print:text-xl">
                                {formatNumber(report.totals.std)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-accent print:shadow-none">
                        <CardHeader className="pb-2 print:pb-1">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Rata-rata APC
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-accent print:text-xl">
                                {formatCurrency(report.totals.average_apc)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500 print:shadow-none">
                        <CardHeader className="pb-2 print:pb-1">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Pulsa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-600 print:text-xl">
                                {formatCurrency(report.totals.pulsa)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Daily Details Table */}
                <Card className="print:shadow-none print:border-2">
                    <CardHeader className="print:pb-2">
                        <CardTitle>Data Harian</CardTitle>
                        <CardDescription>
                            Detail transaksi per hari ({report.details.length} hari)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b-2 print:bg-gray-100">
                                        <th className="p-2 text-left font-semibold">No</th>
                                        <th className="p-2 text-left font-semibold">Tanggal</th>
                                        <th className="p-2 text-right font-semibold">SPD (Rp)</th>
                                        <th className="p-2 text-right font-semibold">STD</th>
                                        <th className="p-2 text-right font-semibold">APC (Rp)</th>
                                        <th className="p-2 text-right font-semibold">Pulsa (Rp)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.details.map((detail) => (
                                        <tr key={detail.id} className="border-b hover:bg-gray-50 print:hover:bg-white">
                                            <td className="p-2 font-medium">{detail.day_number}</td>
                                            <td className="p-2">{formatDate(detail.transaction_date)}</td>
                                            <td className="p-2 text-right">{formatCurrency(detail.spd)}</td>
                                            <td className="p-2 text-right">{formatNumber(detail.std)}</td>
                                            <td className="p-2 text-right text-accent font-semibold">
                                                {formatCurrency(detail.apc)}
                                            </td>
                                            <td className="p-2 text-right">{formatCurrency(detail.pulsa)}</td>
                                        </tr>
                                    ))}
                                    {/* Totals Row */}
                                    <tr className="bg-primary/5 font-bold border-t-2 print:bg-gray-100">
                                        <td colSpan={2} className="p-2 text-right">TOTAL:</td>
                                        <td className="p-2 text-right text-primary">
                                            {formatCurrency(report.totals.spd)}
                                        </td>
                                        <td className="p-2 text-right text-secondary">
                                            {formatNumber(report.totals.std)}
                                        </td>
                                        <td className="p-2 text-right text-accent">
                                            {formatCurrency(report.totals.average_apc)}
                                        </td>
                                        <td className="p-2 text-right text-green-600">
                                            {formatCurrency(report.totals.pulsa)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Print Footer */}
                <div className="hidden print:block mt-8 text-center text-sm text-gray-600">
                    <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                    <p className="mt-2">© 2026 Alfamart - Sistem Laporan Shift 3</p>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    @page {
                        margin: 1cm;
                    }
                }
            `}</style>
        </AppLayout>
    );
}
