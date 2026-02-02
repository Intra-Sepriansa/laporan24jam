import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    TrendingUp, 
    FileText, 
    ShoppingCart, 
    DollarSign, 
    Plus,
    Eye,
    Calendar
} from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface Statistics {
    total_reports_this_month: number;
    total_sales_this_month: number;
    total_transactions_this_month: number;
    average_apc_this_month: number;
}

interface RecentReport {
    id: number;
    month_year: string;
    shift: number;
    report_date: string;
    created_by: string;
    total_days: number;
    total_spd: number;
    total_std: number;
    created_at: string;
}

interface SalesTrend {
    date: string;
    spd: number;
    std: number;
    apc: number;
}

interface Props {
    statistics: Statistics;
    recentReports: RecentReport[];
    salesTrend: SalesTrend[];
    currentMonth: string;
}

export default function Dashboard({ statistics, recentReports, salesTrend, currentMonth }: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            Selamat datang di Sistem Laporan Shift 3 Alfamart
                        </p>
                    </div>
                    <Button asChild size="lg" className="gap-2">
                        <a href={route('reports.create')}>
                            <Plus className="w-5 h-5" />
                            Buat Laporan Baru
                        </a>
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Sales */}
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Penjualan
                            </CardTitle>
                            <DollarSign className="h-5 w-5 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">
                                {formatCurrency(statistics.total_sales_this_month)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Bulan {currentMonth}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Transactions */}
                    <Card className="border-l-4 border-l-secondary">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Transaksi
                            </CardTitle>
                            <ShoppingCart className="h-5 w-5 text-secondary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-secondary">
                                {formatNumber(statistics.total_transactions_this_month)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Struk bulan ini
                            </p>
                        </CardContent>
                    </Card>

                    {/* Average APC */}
                    <Card className="border-l-4 border-l-accent">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Rata-rata APC
                            </CardTitle>
                            <TrendingUp className="h-5 w-5 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-accent">
                                {formatCurrency(statistics.average_apc_this_month || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Average Per Customer
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Reports */}
                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Laporan
                            </CardTitle>
                            <FileText className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">
                                {statistics.total_reports_this_month}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Laporan bulan ini
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sales Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Tren Penjualan 7 Hari Terakhir
                        </CardTitle>
                        <CardDescription>
                            Grafik penjualan harian minggu ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {salesTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={salesTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                    />
                                    <Tooltip 
                                        formatter={(value: number) => formatCurrency(value)}
                                        contentStyle={{ 
                                            backgroundColor: 'white', 
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="spd" 
                                        stroke="hsl(var(--primary))" 
                                        strokeWidth={2}
                                        name="Penjualan"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-500">
                                Belum ada data penjualan
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Reports */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Laporan Terbaru
                                </CardTitle>
                                <CardDescription>
                                    5 laporan terakhir yang dibuat
                                </CardDescription>
                            </div>
                            <Button variant="outline" asChild>
                                <a href={route('reports.index')}>
                                    Lihat Semua
                                </a>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentReports.length > 0 ? (
                            <div className="space-y-4">
                                {recentReports.map((report) => (
                                    <div 
                                        key={report.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-gray-900">
                                                    {report.month_year}
                                                </h3>
                                                <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                                                    Shift {report.shift}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Total SPD:</span>
                                                    <p className="font-semibold text-primary">
                                                        {formatCurrency(report.total_spd)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Total STD:</span>
                                                    <p className="font-semibold">
                                                        {formatNumber(report.total_std)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Hari:</span>
                                                    <p className="font-semibold">
                                                        {report.total_days} hari
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Dibuat:</span>
                                                    <p className="font-semibold">
                                                        {report.created_at}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href={route('reports.show', report.id)}>
                                                <Eye className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">Belum ada laporan</p>
                                <Button asChild>
                                    <a href={route('reports.create')}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Buat Laporan Pertama
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
