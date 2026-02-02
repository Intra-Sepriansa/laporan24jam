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
    Download
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useState } from 'react';

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

export default function ReportsIndex({ reports, filters }: Props) {
    const [searchMonth, setSearchMonth] = useState(filters.month_year || '');
    const [searchShift, setSearchShift] = useState(filters.shift || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleFilter = () => {
        router.get(route('reports.index'), {
            month_year: searchMonth,
            shift: searchShift,
        }, {
            preserveState: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
            router.delete(route('reports.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Laporan Shift" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Laporan Shift</h1>
                        <p className="text-gray-600 mt-1">
                            Kelola semua laporan shift toko Anda
                        </p>
                    </div>
                    <Button asChild size="lg" className="gap-2">
                        <a href={route('reports.create')}>
                            <Plus className="w-5 h-5" />
                            Buat Laporan Baru
                        </a>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filter Laporan
                        </CardTitle>
                        <CardDescription>
                            Cari laporan berdasarkan bulan atau shift
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Input
                                    placeholder="Cari bulan (contoh: FEBRUARY 2026)"
                                    value={searchMonth}
                                    onChange={(e) => setSearchMonth(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Select value={searchShift} onValueChange={setSearchShift}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Shift" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Semua Shift</SelectItem>
                                        <SelectItem value="1">Shift 1</SelectItem>
                                        <SelectItem value="2">Shift 2</SelectItem>
                                        <SelectItem value="3">Shift 3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleFilter} className="flex-1">
                                    <Search className="w-4 h-4 mr-2" />
                                    Cari
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setSearchMonth('');
                                        setSearchShift('');
                                        router.get(route('reports.index'));
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reports List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Daftar Laporan
                        </CardTitle>
                        <CardDescription>
                            Total {reports.data.length} laporan ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {reports.data.length > 0 ? (
                            <div className="space-y-4">
                                {reports.data.map((report) => (
                                    <div 
                                        key={report.id}
                                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900">
                                                        {report.month_year}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="default">
                                                            Shift {report.shift}
                                                        </Badge>
                                                        <span className="text-sm text-gray-500">
                                                            {report.report_date}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a href={route('reports.show', report.id)}>
                                                        <Eye className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a href={route('reports.edit', report.id)}>
                                                        <Edit className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm"
                                                    onClick={() => handleDelete(report.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Total SPD</span>
                                                <p className="font-bold text-primary">
                                                    {formatCurrency(report.total_spd)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Total STD</span>
                                                <p className="font-bold text-secondary">
                                                    {formatNumber(report.total_std)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Rata-rata APC</span>
                                                <p className="font-bold text-accent">
                                                    {formatCurrency(report.average_apc)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Total Pulsa</span>
                                                <p className="font-bold text-green-600">
                                                    {formatCurrency(report.total_pulsa)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Jumlah Hari</span>
                                                <p className="font-bold">
                                                    {report.total_days} hari
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm text-gray-500">
                                            <span>Dibuat oleh: <strong>{report.created_by}</strong></span>
                                            <span>{report.created_at}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination */}
                                {reports.last_page > 1 && (
                                    <div className="flex justify-center gap-2 mt-6">
                                        {reports.links.map((link, index) => (
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
                                    <a href={route('reports.create')}>
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
