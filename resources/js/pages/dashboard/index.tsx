import { Head, router } from '@inertiajs/react';
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
    Calendar,
    User,
    BarChart3,
    Download,
    Search,
    Settings,
    Clock,
    ArrowUpRight,
    Edit,
    List
} from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { create } from '@/routes/reports';
import { index, show } from '@/routes/reports';

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
    const quickActions = [
        {
            title: 'Buat Laporan',
            description: 'Buat laporan shift baru',
            icon: Plus,
            color: 'red',
            bgColor: 'bg-red-500',
            hoverColor: 'hover:bg-red-600',
            action: () => router.visit(create.url())
        },
        {
            title: 'Lihat Laporan',
            description: 'Daftar semua laporan',
            icon: List,
            color: 'blue',
            bgColor: 'bg-blue-500',
            hoverColor: 'hover:bg-blue-600',
            action: () => router.visit(index.url())
        },
        {
            title: 'Statistik',
            description: 'Analisis performa',
            icon: BarChart3,
            color: 'yellow',
            bgColor: 'bg-yellow-500',
            hoverColor: 'hover:bg-yellow-600',
            action: () => router.visit(index.url())
        },
        {
            title: 'Pengaturan',
            description: 'Kelola akun Anda',
            icon: Settings,
            color: 'green',
            bgColor: 'bg-green-500',
            hoverColor: 'hover:bg-green-600',
            action: () => router.visit('/settings/profile')
        }
    ];

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Header with Gradient Background */}
                <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl p-5 shadow-xl sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg sm:w-16 sm:h-16">
                                <FileText className="w-6 h-6 text-red-600 sm:w-8 sm:h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white mb-2 sm:text-4xl">Dashboard</h1>
                                <p className="text-white/90 text-sm sm:text-lg">
                                    Selamat datang di Sistem Laporan Shift 3 Alfamart
                                </p>
                                <p className="text-white/80 text-xs mt-1 flex items-center gap-2 sm:text-sm">
                                    <TrendingUp className="w-4 h-4" />
                                    Pantau performa toko Anda secara real-time
                                </p>
                            </div>
                        </div>
                        <Button
                            asChild
                            size="lg"
                            className="gap-2 bg-white text-red-600 hover:bg-gray-100 shadow-lg h-12 px-6 text-base font-bold w-full sm:w-auto sm:h-14 sm:px-8"
                        >
                            <a href={create.url()}>
                                <Plus className="w-5 h-5" />
                                Buat Laporan Baru
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Quick Actions Grid - ENHANCED */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.action}
                            className={`${action.bgColor} ${action.hoverColor} text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group relative overflow-hidden`}
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -mr-12 -mt-12"></div>
                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full -ml-8 -mb-8"></div>
                            </div>
                            
                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <action.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-1 text-left">{action.title}</h3>
                                <p className="text-xs sm:text-sm text-white/90 text-left">{action.description}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Sales */}
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-red-50 to-red-100 overflow-hidden relative cursor-pointer group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                            <CardTitle className="text-sm font-semibold text-red-900">
                                Total Penjualan
                            </CardTitle>
                            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <DollarSign className="h-6 w-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-2xl font-black text-red-600 mb-1 sm:text-3xl">
                                {formatCurrency(statistics.total_sales_this_month)}
                            </div>
                            <p className="text-sm text-red-700 font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Bulan {currentMonth}
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                                <TrendingUp className="w-3 h-3" />
                                <span className="font-semibold">Target tercapai</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Transactions */}
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden relative cursor-pointer group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                            <CardTitle className="text-sm font-semibold text-blue-900">
                                Total Transaksi
                            </CardTitle>
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <ShoppingCart className="h-6 w-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-2xl font-black text-blue-600 mb-1 sm:text-3xl">
                                {formatNumber(statistics.total_transactions_this_month)}
                            </div>
                            <p className="text-sm text-blue-700 font-medium flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Struk bulan ini
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                                <Clock className="w-3 h-3" />
                                <span className="font-semibold">Update real-time</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Average APC */}
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden relative cursor-pointer group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                            <CardTitle className="text-sm font-semibold text-yellow-900">
                                Rata-rata APC
                            </CardTitle>
                            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-2xl font-black text-yellow-600 mb-1 sm:text-3xl">
                                {formatCurrency(statistics.average_apc_this_month || 0)}
                            </div>
                            <p className="text-sm text-yellow-700 font-medium flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                Average Per Customer
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600">
                                <BarChart3 className="w-3 h-3" />
                                <span className="font-semibold">Performa baik</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Reports */}
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden relative cursor-pointer group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                            <CardTitle className="text-sm font-semibold text-green-900">
                                Total Laporan
                            </CardTitle>
                            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-2xl font-black text-green-600 mb-1 sm:text-3xl">
                                {statistics.total_reports_this_month}
                            </div>
                            <p className="text-sm text-green-700 font-medium flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Laporan bulan ini
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                                <Calendar className="w-3 h-3" />
                                <span className="font-semibold">Tepat waktu</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sales Trend Chart */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    Tren Penjualan 7 Hari Terakhir
                                </CardTitle>
                                <CardDescription className="text-base mt-1">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4" />
                                        Grafik penjualan harian minggu ini
                                    </div>
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="w-4 h-4" />
                                Export
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {salesTrend.length > 0 ? (
                            <div className="h-56 sm:h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis 
                                            dataKey="date" 
                                            tick={{ fontSize: 12 }}
                                            stroke="#6b7280"
                                        />
                                        <YAxis 
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value: number | undefined) => value ? `${(value / 1000000).toFixed(1)}M` : '0'}
                                            stroke="#6b7280"
                                        />
                                        <Tooltip 
                                            formatter={(value) => {
                                                if (typeof value === 'number') {
                                                    return formatCurrency(value);
                                                }
                                                return String(value || '');
                                            }}
                                            contentStyle={{ 
                                                backgroundColor: 'white', 
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '12px',
                                                padding: '12px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="spd" 
                                            stroke="#E31E24" 
                                            strokeWidth={3}
                                            name="Penjualan"
                                            dot={{ fill: '#E31E24', r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
                                <BarChart3 className="w-16 h-16 text-gray-300 mb-4" />
                                <p className="text-lg font-semibold">Belum ada data penjualan</p>
                                <p className="text-sm mt-2">Buat laporan pertama untuk melihat grafik</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Reports */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    Laporan Terbaru
                                </CardTitle>
                                <CardDescription className="text-base mt-1">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        5 laporan terakhir yang dibuat
                                    </div>
                                </CardDescription>
                            </div>
                            <Button variant="outline" asChild className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold w-full sm:w-auto">
                                <a href={index.url()}>
                                    <List className="w-4 h-4 mr-2" />
                                    Lihat Semua
                                </a>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {recentReports.length > 0 ? (
                            <div className="space-y-4">
                                {recentReports.map((report) => (
                                    <div 
                                        key={report.id}
                                        className="flex flex-col gap-4 p-5 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50/50 transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between group"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Calendar className="w-6 h-6 text-red-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900">
                                                        {report.month_year}
                                                    </h3>
                                                    <span className="px-3 py-1 text-xs font-bold bg-red-600 text-white rounded-lg shadow">
                                                        Shift {report.shift}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div className="bg-red-50 p-3 rounded-lg border border-red-200 hover:border-red-300 transition-colors">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <DollarSign className="w-3 h-3 text-red-600" />
                                                        <span className="text-gray-600 text-xs font-medium">Total SPD</span>
                                                    </div>
                                                    <p className="font-bold text-red-600 text-base">
                                                        {formatCurrency(report.total_spd)}
                                                    </p>
                                                </div>
                                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <ShoppingCart className="w-3 h-3 text-blue-600" />
                                                        <span className="text-gray-600 text-xs font-medium">Total STD</span>
                                                    </div>
                                                    <p className="font-bold text-blue-600 text-base">
                                                        {formatNumber(report.total_std)}
                                                    </p>
                                                </div>
                                                <div className="bg-green-50 p-3 rounded-lg border border-green-200 hover:border-green-300 transition-colors">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Calendar className="w-3 h-3 text-green-600" />
                                                        <span className="text-gray-600 text-xs font-medium">Hari</span>
                                                    </div>
                                                    <p className="font-bold text-green-600 text-base">
                                                        {report.total_days} hari
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User className="w-3 h-3 text-gray-600" />
                                                        <span className="text-gray-600 text-xs font-medium">Dibuat</span>
                                                    </div>
                                                    <p className="font-bold text-gray-700 text-base">
                                                        {report.created_at}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="lg" 
                                            asChild 
                                            className="w-full hover:bg-blue-100 hover:text-blue-600 sm:ml-4 sm:w-auto group-hover:bg-blue-600 group-hover:text-white transition-colors"
                                        >
                                            <a href={show.url({ report: report.id })}>
                                                <Eye className="w-5 h-5 mr-2 sm:mr-0" />
                                                <span className="sm:hidden">Lihat Detail</span>
                                            </a>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-gray-900 font-semibold text-lg mb-2">Belum ada laporan</p>
                                <p className="text-gray-500 mb-6">Mulai buat laporan shift pertama Anda</p>
                                <Button asChild size="lg" className="gap-2">
                                    <a href={create.url()}>
                                        <Plus className="w-5 h-5" />
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
