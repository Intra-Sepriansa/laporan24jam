import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
    Plus, 
    Eye, 
    Edit, 
    Trash2, 
    FileText,
    Search,
    Filter,
    Calendar,
    TrendingUp,
    User
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useState } from 'react';
import { index, create, show, edit, destroy } from '@/routes/reports';

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
    average_apc: number;
    created_at: string;
}

interface Props {
    reports: {
        data: Report[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        month_year?: string;
        shift?: string;
    };
}

export default function ReportsIndex({
    reports = {
        data: [],
        links: [],
        current_page: 1,
        last_page: 1,
    },
    filters = {},
}: Props) {
    const safeFilters = Array.isArray(filters) ? {} : filters;
    const allShiftValue = 'all';
    const [searchMonth, setSearchMonth] = useState(
        safeFilters.month_year || '',
    );
    const [searchShift, setSearchShift] = useState(
        safeFilters.shift || allShiftValue,
    );
    const reportData = Array.isArray(reports.data) ? reports.data : [];
    const reportLinks = Array.isArray(reports.links) ? reports.links : [];

    const handleFilter = () => {
        router.get(index.url(), {
            month_year: searchMonth,
            shift: searchShift === allShiftValue ? '' : searchShift,
        }, {
            preserveState: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
            router.delete(destroy.url({ report: id }));
        }
    };

    return (
        <AppLayout>
            <Head title="Laporan Shift" />

            <div className="space-y-6 sm:space-y-8">
                {/* Header with Gradient Background */}
                <div className="bg-gradient-to-r from-blue-600 to-red-600 rounded-2xl p-5 shadow-xl sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black text-white mb-2 sm:text-4xl">Laporan Shift</h1>
                            <p className="text-white/90 text-sm sm:text-lg">
                                Kelola semua laporan shift toko Anda
                            </p>
                            <p className="text-white/80 text-xs mt-1 flex items-center gap-2 sm:text-sm">
                                <FileText className="w-4 h-4" />
                                Pantau dan kelola laporan dengan mudah
                            </p>
                        </div>
                        <Button
                            asChild
                            size="lg"
                            className="gap-2 bg-white text-blue-600 hover:bg-gray-100 shadow-lg h-12 px-6 text-base font-bold w-full sm:h-14 sm:w-auto sm:px-8"
                        >
                            <a href={create.url()}>
                                <Plus className="w-5 h-5" />
                                Buat Laporan Baru
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center sm:w-10 sm:h-10">
                                <Filter className="w-5 h-5 text-white" />
                            </div>
                            Filter Laporan
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            <div className="flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                Cari laporan berdasarkan bulan atau shift
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Input
                                    placeholder="Cari bulan (contoh: FEBRUARY 2026)"
                                    value={searchMonth}
                                    onChange={(e) => setSearchMonth(e.target.value)}
                                    className="w-full h-11 border-2 focus:border-blue-500 sm:h-12"
                                />
                            </div>
                            <div>
                                <Select value={searchShift} onValueChange={setSearchShift}>
                                    <SelectTrigger className="h-11 border-2 focus:border-blue-500 sm:h-12">
                                        <SelectValue placeholder="Pilih Shift" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={allShiftValue}>Semua Shift</SelectItem>
                                        <SelectItem value="1">Shift 1</SelectItem>
                                        <SelectItem value="2">Shift 2</SelectItem>
                                        <SelectItem value="3">Shift 3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button onClick={handleFilter} className="w-full h-11 font-semibold bg-blue-600 hover:bg-blue-700 sm:h-12 sm:flex-1">
                                    <Search className="w-4 h-4 mr-2" />
                                    Cari
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-11 border-2 font-semibold sm:h-12"
                                    onClick={() => {
                                        setSearchMonth('');
                                        setSearchShift(allShiftValue);
                                        router.get(index.url());
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reports List */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center sm:w-10 sm:h-10">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            Daftar Laporan
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Total {reportData.length} laporan ditemukan
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {reportData.length > 0 ? (
                            <div className="space-y-4">
                                {reportData.map((report) => (
                                    <div 
                                        key={report.id}
                                        className="border-2 border-gray-200 rounded-xl p-4 hover:border-red-300 hover:bg-red-50/30 transition-all hover:shadow-md sm:p-6"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg sm:w-14 sm:h-14">
                                                    <FileText className="w-6 h-6 text-white sm:w-7 sm:h-7" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-lg text-gray-900 sm:text-xl">
                                                        {report.month_year}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge className="bg-red-600 text-white font-bold px-3 py-1 text-xs sm:text-sm">
                                                            Shift {report.shift}
                                                        </Badge>
                                                        <span className="text-xs text-gray-600 font-medium flex items-center gap-1 sm:text-sm">
                                                            <Calendar className="w-3 h-3" />
                                                            {report.report_date}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex w-full gap-2 sm:w-auto">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                                                    asChild
                                                >
                                                    <a href={show.url({ report: report.id })}>
                                                        <Eye className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    className="border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                                                    asChild
                                                >
                                                    <a href={edit.url({ report: report.id })}>
                                                        <Edit className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm"
                                                    className="border-2 border-red-600 bg-red-600 hover:bg-red-700"
                                                    onClick={() => handleDelete(report.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                                <span className="text-gray-600 text-xs font-medium">Total SPD</span>
                                                <p className="font-black text-red-600 text-sm mt-1 sm:text-base">
                                                    {formatCurrency(report.total_spd)}
                                                </p>
                                            </div>
                                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                                <span className="text-gray-600 text-xs font-medium">Total STD</span>
                                                <p className="font-black text-blue-600 text-sm mt-1 sm:text-base">
                                                    {formatNumber(report.total_std)}
                                                </p>
                                            </div>
                                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                                <span className="text-gray-600 text-xs font-medium">Rata-rata APC</span>
                                                <p className="font-black text-yellow-600 text-sm mt-1 sm:text-base">
                                                    {formatCurrency(report.average_apc)}
                                                </p>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                                <span className="text-gray-600 text-xs font-medium">Total Pulsa</span>
                                                <p className="font-black text-green-600 text-sm mt-1 sm:text-base">
                                                    {formatCurrency(report.total_pulsa)}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                <span className="text-gray-600 text-xs font-medium">Jumlah Hari</span>
                                                <p className="font-black text-gray-700 text-sm mt-1 sm:text-base">
                                                    {report.total_days} hari
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t-2 border-gray-200 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                                            <span className="text-gray-600 flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Dibuat oleh: <strong className="text-gray-900">{report.created_by}</strong>
                                            </span>
                                            <span className="text-gray-600 font-medium flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {report.created_at}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination */}
                                {reports.last_page > 1 && (
                                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                                        {reportLinks.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Belum Ada Laporan
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Mulai buat laporan shift pertama Anda
                                </p>
                                <Button asChild>
                                    <a href={create.url()}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Buat Laporan Baru
                                    </a>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
