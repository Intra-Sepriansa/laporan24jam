import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Download,
    FileSpreadsheet,
    Printer,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Smartphone,
    Calendar,
    BarChart3,
    Target,
    CheckCircle2,
    Clock,
    Eye,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface Report {
    id: number;
    month_year: string;
    shift: number;
    report_date: string;
    created_by: string;
    total_days: number;
    total_spd: number;
    total_std: number;
    total_pulsa: number;
    avg_apc: number;
    created_at: string;
}

interface Summary {
    total_spd: number;
    total_std: number;
    total_pulsa: number;
    avg_apc: number;
    total_days: number;
    total_reports: number;
    avg_daily_spd: number;
    avg_daily_std: number;
}

interface TargetComparison {
    target_spd: number;
    target_std: number;
    target_apc: number;
    target_pulsa: number;
    progress_spd: number;
    progress_std: number;
    progress_apc: number;
    progress_pulsa: number;
}

interface AllReport {
    id: number;
    month_year: string;
    shift: number;
    created_by: string;
    created_at: string;
}

interface Props {
    store: { code: string; name: string };
    reports: Report[];
    summary: Summary;
    targetComparison: TargetComparison | null;
    availableMonths: string[];
    allReports: AllReport[];
    currentMonth: string;
}

export default function SummaryPage({
    store,
    reports,
    summary,
    targetComparison,
    availableMonths,
    allReports,
    currentMonth,
}: Props) {
    return (
        <AppLayout>
            <Head title="Ringkasan & Export" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-linear-to-r from-slate-700 via-slate-600 to-slate-800 rounded-2xl p-5 shadow-xl sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center sm:w-16 sm:h-16">
                                <FileText className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white sm:text-4xl">Ringkasan</h1>
                                <p className="text-white/80 text-sm sm:text-lg">Export & ringkasan laporan bulanan</p>
                                <p className="text-white/60 text-xs mt-1 sm:text-sm">
                                    {store.name} ({store.code}) — {currentMonth}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="border-0 shadow-lg hover:-translate-y-1 transition-all bg-linear-to-br from-red-50 to-white">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-red-600" />
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total SPD</p>
                            <p className="text-lg font-black text-gray-900 mt-1 sm:text-2xl">{formatCurrency(summary.total_spd)}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Rata-rata: {formatCurrency(summary.avg_daily_spd)}/hari</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:-translate-y-1 transition-all bg-linear-to-br from-blue-50 to-white">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total STD</p>
                            <p className="text-lg font-black text-gray-900 mt-1 sm:text-2xl">{formatNumber(summary.total_std)}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Rata-rata: {formatNumber(summary.avg_daily_std)}/hari</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:-translate-y-1 transition-all bg-linear-to-br from-yellow-50 to-white">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg APC</p>
                            <p className="text-lg font-black text-gray-900 mt-1 sm:text-2xl">{formatCurrency(summary.avg_apc)}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{summary.total_days} hari dilaporkan</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:-translate-y-1 transition-all bg-linear-to-br from-green-50 to-white">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Smartphone className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pulsa</p>
                            <p className="text-lg font-black text-gray-900 mt-1 sm:text-2xl">{formatCurrency(summary.total_pulsa)}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{summary.total_reports} laporan</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Target vs Actual */}
                {targetComparison && (
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Target className="w-4 h-4 text-orange-600" />
                                </div>
                                Target vs Realisasi
                            </CardTitle>
                            <CardDescription>Pencapaian target bulan {currentMonth}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* SPD */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold text-gray-700">SPD</span>
                                        <span className="text-sm font-bold text-red-600">{targetComparison.progress_spd}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div className="bg-linear-to-r from-red-500 to-red-400 h-3 rounded-full transition-all duration-1000" style={{ width: `${targetComparison.progress_spd}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                        <span>Aktual: {formatCurrency(summary.total_spd)}</span>
                                        <span>Target: {formatCurrency(targetComparison.target_spd)}</span>
                                    </div>
                                </div>

                                {/* STD */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold text-gray-700">STD</span>
                                        <span className="text-sm font-bold text-blue-600">{targetComparison.progress_std}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div className="bg-linear-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-1000" style={{ width: `${targetComparison.progress_std}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                        <span>Aktual: {formatNumber(summary.total_std)}</span>
                                        <span>Target: {formatNumber(targetComparison.target_std)}</span>
                                    </div>
                                </div>

                                {/* APC */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold text-gray-700">APC</span>
                                        <span className="text-sm font-bold text-yellow-600">{targetComparison.progress_apc}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div className="bg-linear-to-r from-yellow-500 to-yellow-400 h-3 rounded-full transition-all duration-1000" style={{ width: `${targetComparison.progress_apc}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                        <span>Aktual: {formatCurrency(summary.avg_apc)}</span>
                                        <span>Target: {formatCurrency(targetComparison.target_apc)}</span>
                                    </div>
                                </div>

                                {/* Pulsa */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold text-gray-700">Pulsa</span>
                                        <span className="text-sm font-bold text-green-600">{targetComparison.progress_pulsa}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div className="bg-linear-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-1000" style={{ width: `${targetComparison.progress_pulsa}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                        <span>Aktual: {formatCurrency(summary.total_pulsa)}</span>
                                        <span>Target: {formatCurrency(targetComparison.target_pulsa)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Reports This Month */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            Laporan Bulan Ini
                        </CardTitle>
                        <CardDescription>{reports.length} laporan untuk {currentMonth}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {reports.length > 0 ? (
                            <div className="space-y-3">
                                {reports.map((report) => (
                                    <div key={report.id} className="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold text-gray-900">{report.month_year}</span>
                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">Shift {report.shift}</span>
                                                <span className="text-xs text-gray-400">{report.total_days} hari</span>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                                <div>
                                                    <span className="text-gray-400">SPD</span>
                                                    <p className="font-bold text-red-600">{formatCurrency(report.total_spd)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">STD</span>
                                                    <p className="font-bold text-blue-600">{formatNumber(report.total_std)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">APC</span>
                                                    <p className="font-bold text-yellow-600">{formatCurrency(report.avg_apc)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Pulsa</span>
                                                    <p className="font-bold text-green-600">{formatCurrency(report.total_pulsa)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" asChild className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                                <a href={`/reports/${report.id}`}>
                                                    <Eye className="w-3 h-3 mr-1" /> Lihat
                                                </a>
                                            </Button>
                                            <Button size="sm" variant="outline" asChild className="text-red-600 border-red-200 hover:bg-red-50">
                                                <a href={`/reports/${report.id}/export/pdf`}>
                                                    <Download className="w-3 h-3 mr-1" /> PDF
                                                </a>
                                            </Button>
                                            <Button size="sm" variant="outline" asChild className="text-green-600 border-green-200 hover:bg-green-50">
                                                <a href={`/reports/${report.id}/export/excel`}>
                                                    <FileSpreadsheet className="w-3 h-3 mr-1" /> Excel
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-700 mb-2">Belum Ada Laporan</h3>
                                <p className="text-gray-500">Belum ada laporan untuk bulan ini</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Export Center */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                <Download className="w-4 h-4 text-slate-600" />
                            </div>
                            Export Center
                        </CardTitle>
                        <CardDescription>Download laporan dalam berbagai format</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {allReports.length > 0 ? (
                            <div className="overflow-x-auto -mx-6 px-6">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-3 font-semibold text-gray-600">Periode</th>
                                            <th className="text-left py-3 font-semibold text-gray-600">Shift</th>
                                            <th className="text-left py-3 font-semibold text-gray-600">Dibuat</th>
                                            <th className="text-right py-3 font-semibold text-gray-600">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {allReports.map((report) => (
                                            <tr key={report.id} className="hover:bg-gray-50">
                                                <td className="py-3 font-medium">{report.month_year}</td>
                                                <td className="py-3">
                                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">
                                                        Shift {report.shift}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-gray-500">{report.created_at}</td>
                                                <td className="py-3 text-right">
                                                    <div className="flex gap-1 justify-end">
                                                        <Button size="sm" variant="ghost" asChild className="h-8 px-2">
                                                            <a href={`/reports/${report.id}`}>
                                                                <Eye className="w-3 h-3" />
                                                            </a>
                                                        </Button>
                                                        <Button size="sm" variant="ghost" asChild className="h-8 px-2 text-red-600">
                                                            <a href={`/reports/${report.id}/export/pdf`}>
                                                                <Download className="w-3 h-3" />
                                                            </a>
                                                        </Button>
                                                        <Button size="sm" variant="ghost" asChild className="h-8 px-2 text-green-600">
                                                            <a href={`/reports/${report.id}/export/excel`}>
                                                                <FileSpreadsheet className="w-3 h-3" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Belum ada laporan untuk di-export</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
