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
    Settings,
    Clock,
    ArrowUpRight,
    List,
    Wallet,
    Users,
    Target as TargetIcon,
    TrendingDown,
    CheckCircle,
    AlertCircle,
    Award,
    Activity
} from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { create, index, show } from '@/routes/reports';

interface Statistics {
    total_reports_this_month: number;
    total_sales_this_month: number;
    total_transactions_this_month: number;
    average_apc_this_month: number;
}

interface CashStats {
    current_balance: number;
    total_income_this_month: number;
    total_expense_this_month: number;
    pending_approvals: number;
}

interface AttendanceStats {
    total_employees: number;
    present_today: number;
    late_today: number;
    attendance_rate_this_month: number;
}

interface TargetStats {
    monthly_target: number;
    achievement_percentage: number;
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

interface TrendData {
    date: string;
    [key: string]: any;
}

interface TopPerformer {
    name: string;
    nik: string;
    report_count: number;
}

interface Props {
    statistics: Statistics;
    cashStats: CashStats;
    attendanceStats: AttendanceStats;
    targetStats: TargetStats;
    recentReports: RecentReport[];
    salesTrend: TrendData[];
    cashFlowTrend: TrendData[];
    attendanceTrend: TrendData[];
    topPerformers: TopPerformer[];
    currentMonth: string;
    currentPeriod: string;
}

export default function Dashboard({ 
    statistics, 
    cashStats,
    attendanceStats,
    targetStats,
    recentReports, 
    salesTrend,
    cashFlowTrend,
    attendanceTrend,
    topPerformers,
    currentMonth,
    currentPeriod 
}: Props) {
    const changePeriod = (period: string) => {
        router.get('/dashboard', { period }, { preserveState: true });
    };
    const quickActions = [
        {
            title: 'Buat Laporan',
            description: 'Laporan shift baru',
            icon: Plus,
            color: 'red',
            bgColor: 'bg-red-500',
            hoverColor: 'hover:bg-red-600',
            action: () => router.visit(create.url())
        },
        {
            title: 'Uang Kas',
            description: 'Kelola kas toko',
            icon: Wallet,
            color: 'green',
            bgColor: 'bg-green-500',
            hoverColor: 'hover:bg-green-600',
            action: () => router.visit('/cash')
        },
        {
            title: 'Absensi',
            description: 'Jadwal & kehadiran',
            icon: Users,
            color: 'blue',
            bgColor: 'bg-blue-500',
            hoverColor: 'hover:bg-blue-600',
            action: () => router.visit('/attendance-schedule')
        },
        {
            title: 'Analitik',
            description: 'Performa toko',
            icon: BarChart3,
            color: 'purple',
            bgColor: 'bg-purple-500',
            hoverColor: 'hover:bg-purple-600',
            action: () => router.visit('/analytics')
        }
    ];

    const netCashFlow = cashStats.total_income_this_month - cashStats.total_expense_this_month;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="space-y-6 animate-in fade-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 via-red-500 to-blue-600 rounded-2xl p-6 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <Activity className="w-8 h-8 text-red-600" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white mb-1">Dashboard</h1>
                                <p className="text-white/90 text-lg">
                                    Sistem Laporan Shift 3 Alfamart
                                </p>
                                <p className="text-white/80 text-sm mt-1 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {new Date().toLocaleDateString('id-ID', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => router.visit(create.url())}
                            size="lg"
                            className="gap-2 bg-white text-red-600 hover:bg-gray-100 shadow-lg h-14 px-8 text-base font-bold"
                        >
                            <Plus className="w-5 h-5" />
                            Buat Laporan Baru
                        </Button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.action}
                            className={`${action.bgColor} ${action.hoverColor} text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 group relative overflow-hidden`}
                        >
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -mr-12 -mt-12"></div>
                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full -ml-8 -mb-8"></div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <action.icon className="w-10 h-10" />
                                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-xl font-bold mb-1 text-left">{action.title}</h3>
                                <p className="text-sm text-white/90 text-left">{action.description}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Main Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Sales */}
                    <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-red-600" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Total Penjualan</p>
                            <p className="text-2xl font-black text-gray-900">
                                {formatCurrency(statistics.total_sales_this_month)}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">Bulan {currentMonth}</p>
                        </CardContent>
                    </Card>

                    {/* Cash Balance */}
                    <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Wallet className="w-6 h-6 text-green-600" />
                                </div>
                                {netCashFlow >= 0 ? (
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                ) : (
                                    <TrendingDown className="w-5 h-5 text-red-500" />
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Saldo Kas</p>
                            <p className="text-2xl font-black text-gray-900">
                                {formatCurrency(cashStats.current_balance)}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Arus: {formatCurrency(netCashFlow)}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Attendance Rate */}
                    <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Kehadiran Hari Ini</p>
                            <p className="text-2xl font-black text-gray-900">
                                {attendanceStats.present_today}/{attendanceStats.total_employees}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Rate: {attendanceStats.attendance_rate_this_month}%
                            </p>
                        </CardContent>
                    </Card>

                    {/* Target Achievement */}
                    <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <TargetIcon className="w-6 h-6 text-purple-600" />
                                </div>
                                <Award className="w-5 h-5 text-yellow-500" />
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Pencapaian Target</p>
                            <p className="text-2xl font-black text-gray-900">
                                {targetStats.achievement_percentage}%
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Target: {formatCurrency(targetStats.monthly_target)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Period Filter */}
                <Card className="shadow-xl bg-gradient-to-r from-gray-50 to-gray-100">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Filter Periode Data</h3>
                                    <p className="text-sm text-gray-600">Pilih rentang waktu untuk melihat data</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={currentPeriod === 'week' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => changePeriod('week')}
                                    className={currentPeriod === 'week' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                >
                                    1 Minggu
                                </Button>
                                <Button
                                    variant={currentPeriod === 'month' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => changePeriod('month')}
                                    className={currentPeriod === 'month' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                >
                                    1 Bulan
                                </Button>
                                <Button
                                    variant={currentPeriod === '3months' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => changePeriod('3months')}
                                    className={currentPeriod === '3months' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                >
                                    3 Bulan
                                </Button>
                                <Button
                                    variant={currentPeriod === '6months' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => changePeriod('6months')}
                                    className={currentPeriod === '6months' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                >
                                    6 Bulan
                                </Button>
                                <Button
                                    variant={currentPeriod === '9months' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => changePeriod('9months')}
                                    className={currentPeriod === '9months' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                >
                                    9 Bulan
                                </Button>
                                <Button
                                    variant={currentPeriod === 'year' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => changePeriod('year')}
                                    className={currentPeriod === 'year' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                >
                                    1 Tahun
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Trend */}
                    <Card className="shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b-2">
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-red-600" />
                                Tren Penjualan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesTrend}>
                                        <defs>
                                            <linearGradient id="colorSpd" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                        <Area type="monotone" dataKey="spd" stroke="#ef4444" strokeWidth={2} fill="url(#colorSpd)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cash Flow Trend */}
                    <Card className="shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b-2">
                            <CardTitle className="flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-green-600" />
                                Arus Kas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                        <Legend />
                                        <Bar dataKey="income" fill="#10b981" name="Pemasukan" radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Attendance Trend */}
                    <Card className="shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                Kehadiran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={attendanceTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} name="Hadir" />
                                        <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} name="Terlambat" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Performers */}
                    <Card className="shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b-2">
                            <CardTitle className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-600" />
                                Top Performers
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                {topPerformers.length > 0 ? (
                                    topPerformers.map((performer, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-white rounded-lg border border-yellow-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{performer.name}</p>
                                                    <p className="text-xs text-gray-600">{performer.nik}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-yellow-600">{performer.report_count}</p>
                                                <p className="text-xs text-gray-600">laporan</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-8">Belum ada data</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b-2">
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-purple-600" />
                                Statistik Cepat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-200">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm text-gray-600">Total Laporan</span>
                                    </div>
                                    <span className="text-lg font-bold text-purple-600">{statistics.total_reports_this_month}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm text-gray-600">Total Transaksi</span>
                                    </div>
                                    <span className="text-lg font-bold text-blue-600">{formatNumber(statistics.total_transactions_this_month)}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                        <span className="text-sm text-gray-600">Rata-rata APC</span>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">{formatCurrency(statistics.average_apc_this_month || 0)}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-white rounded-lg border border-yellow-200">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                                        <span className="text-sm text-gray-600">Pending Approval</span>
                                    </div>
                                    <span className="text-lg font-bold text-yellow-600">{cashStats.pending_approvals}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Reports */}
                <Card className="shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    Laporan Terbaru
                                </CardTitle>
                                <CardDescription className="mt-1">5 laporan terakhir yang dibuat</CardDescription>
                            </div>
                            <Button variant="outline" onClick={() => router.visit(index.url())}>
                                <List className="w-4 h-4 mr-2" />
                                Lihat Semua
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {recentReports.length > 0 ? (
                            <div className="space-y-3">
                                {recentReports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-red-300 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Calendar className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-gray-900">{report.month_year}</h3>
                                                    <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded">
                                                        Shift {report.shift}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>{formatCurrency(report.total_spd)}</span>
                                                    <span>•</span>
                                                    <span>{formatNumber(report.total_std)} transaksi</span>
                                                    <span>•</span>
                                                    <span>{report.created_at}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.visit(show.url({ report: report.id }))}
                                            className="group-hover:bg-blue-600 group-hover:text-white"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">Belum ada laporan</p>
                                <Button onClick={() => router.visit(create.url())}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Buat Laporan Pertama
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
