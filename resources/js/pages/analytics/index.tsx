import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    Star,
    Zap,
    Info,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    DollarSign,
    ShoppingCart,
    Smartphone,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Chart3DWrapper, Chart3DTooltipStyle } from '@/components/chart-3d-wrapper';
import { Bar3DShape } from '@/components/bar-3d-shape';

interface Comparison {
    current: {
        month: string;
        total_spd: number;
        total_std: number;
        avg_apc: number;
        total_pulsa: number;
        total_days: number;
    };
    previous: {
        month: string;
        total_spd: number;
        total_std: number;
        avg_apc: number;
        total_pulsa: number;
        total_days: number;
    };
    growth: {
        spd: number;
        std: number;
        apc: number;
        pulsa: number;
    };
}

interface DailyData {
    date: string;
    full_date: string;
    spd: number;
    std: number;
    apc: number;
    pulsa: number;
}

interface WeeklyData {
    week: string;
    spd: number;
    std: number;
    avg_apc: number;
}

interface DayOfWeekData {
    day: string;
    avg_spd: number;
    avg_std: number;
    avg_apc: number;
    count: number;
}

interface MonthlyTrend {
    month: string;
    month_short: string;
    spd: number;
    std: number;
    avg_apc: number;
    pulsa: number;
}

interface Insight {
    type: 'positive' | 'negative' | 'info';
    icon: string;
    message: string;
}

interface Props {
    comparison: Comparison;
    dailyData: DailyData[];
    weeklyData: WeeklyData[];
    dayOfWeekData: DayOfWeekData[];
    monthlyTrend: MonthlyTrend[];
    bestDay: DailyData | null;
    worstDay: DailyData | null;
    insights: Insight[];
    currentMonth: string;
}

const COLORS = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#8b5cf6', '#f97316', '#06b6d4'];

function GrowthBadge({ value }: { value: number }) {
    if (value === 0) return <span className="text-xs text-gray-400 font-medium">0%</span>;
    const isPositive = value > 0;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(value)}%
        </span>
    );
}

function InsightIcon({ icon }: { icon: string }) {
    switch (icon) {
        case 'trending-up': return <TrendingUp className="w-5 h-5" />;
        case 'trending-down': return <TrendingDown className="w-5 h-5" />;
        case 'star': return <Star className="w-5 h-5" />;
        case 'zap': return <Zap className="w-5 h-5" />;
        default: return <Info className="w-5 h-5" />;
    }
}

export default function Analytics({
    comparison,
    dailyData,
    weeklyData,
    dayOfWeekData,
    monthlyTrend,
    bestDay,
    worstDay,
    insights,
    currentMonth,
}: Props) {
    return (
        <AppLayout>
            <Head title="Analitik & Perbandingan" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-5 shadow-xl sm:p-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center sm:w-16 sm:h-16">
                            <BarChart3 className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white sm:text-4xl">Analitik</h1>
                            <p className="text-white/80 text-sm sm:text-lg">Perbandingan & insight performa toko</p>
                            <p className="text-white/60 text-xs mt-1 sm:text-sm">{currentMonth}</p>
                        </div>
                    </div>
                </div>

                {/* Insights */}
                {insights.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {insights.map((insight, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                                    insight.type === 'positive'
                                        ? 'bg-green-50 border-green-200 text-green-800'
                                        : insight.type === 'negative'
                                        ? 'bg-red-50 border-red-200 text-red-800'
                                        : 'bg-blue-50 border-blue-200 text-blue-800'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                    insight.type === 'positive' ? 'bg-green-200' : insight.type === 'negative' ? 'bg-red-200' : 'bg-blue-200'
                                }`}>
                                    <InsightIcon icon={insight.icon} />
                                </div>
                                <p className="text-sm font-medium">{insight.message}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Monthly Comparison Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* SPD */}
                    <Card className="border-0 shadow-lg overflow-hidden group hover:-translate-y-1 transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                        <CardHeader className="pb-1 relative z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SPD</CardTitle>
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-4 h-4 text-red-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-lg font-black text-gray-900 sm:text-2xl">{formatCurrency(comparison.current.total_spd)}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <GrowthBadge value={comparison.growth.spd} />
                                <span className="text-[10px] text-gray-400">vs bulan lalu</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* STD */}
                    <Card className="border-0 shadow-lg overflow-hidden group hover:-translate-y-1 transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                        <CardHeader className="pb-1 relative z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">STD</CardTitle>
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-lg font-black text-gray-900 sm:text-2xl">{formatNumber(comparison.current.total_std)}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <GrowthBadge value={comparison.growth.std} />
                                <span className="text-[10px] text-gray-400">vs bulan lalu</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* APC */}
                    <Card className="border-0 shadow-lg overflow-hidden group hover:-translate-y-1 transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                        <CardHeader className="pb-1 relative z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">APC</CardTitle>
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-yellow-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-lg font-black text-gray-900 sm:text-2xl">{formatCurrency(comparison.current.avg_apc)}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <GrowthBadge value={comparison.growth.apc} />
                                <span className="text-[10px] text-gray-400">vs bulan lalu</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pulsa */}
                    <Card className="border-0 shadow-lg overflow-hidden group hover:-translate-y-1 transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                        <CardHeader className="pb-1 relative z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pulsa</CardTitle>
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Smartphone className="w-4 h-4 text-green-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-lg font-black text-gray-900 sm:text-2xl">{formatCurrency(comparison.current.total_pulsa)}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <GrowthBadge value={comparison.growth.pulsa} />
                                <span className="text-[10px] text-gray-400">vs bulan lalu</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Best & Worst Day */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {bestDay && (
                        <Card className="border-2 border-green-200 bg-linear-to-br from-green-50 to-emerald-50 shadow-lg">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <Star className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Hari Terbaik</p>
                                        <p className="text-lg font-black text-green-900">{bestDay.date}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-white/80 rounded-lg p-2 text-center">
                                        <p className="text-[10px] text-gray-500">SPD</p>
                                        <p className="text-sm font-bold text-green-700">{formatCurrency(bestDay.spd)}</p>
                                    </div>
                                    <div className="bg-white/80 rounded-lg p-2 text-center">
                                        <p className="text-[10px] text-gray-500">STD</p>
                                        <p className="text-sm font-bold text-green-700">{formatNumber(bestDay.std)}</p>
                                    </div>
                                    <div className="bg-white/80 rounded-lg p-2 text-center">
                                        <p className="text-[10px] text-gray-500">APC</p>
                                        <p className="text-sm font-bold text-green-700">{formatCurrency(bestDay.apc)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {worstDay && (
                        <Card className="border-2 border-orange-200 bg-linear-to-br from-orange-50 to-amber-50 shadow-lg">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <TrendingDown className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Hari Terendah</p>
                                        <p className="text-lg font-black text-orange-900">{worstDay.date}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-white/80 rounded-lg p-2 text-center">
                                        <p className="text-[10px] text-gray-500">SPD</p>
                                        <p className="text-sm font-bold text-orange-700">{formatCurrency(worstDay.spd)}</p>
                                    </div>
                                    <div className="bg-white/80 rounded-lg p-2 text-center">
                                        <p className="text-[10px] text-gray-500">STD</p>
                                        <p className="text-sm font-bold text-orange-700">{formatNumber(worstDay.std)}</p>
                                    </div>
                                    <div className="bg-white/80 rounded-lg p-2 text-center">
                                        <p className="text-[10px] text-gray-500">APC</p>
                                        <p className="text-sm font-bold text-orange-700">{formatCurrency(worstDay.apc)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Daily SPD Chart */}
                <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-red-600" />
                            </div>
                            Penjualan Harian
                        </CardTitle>
                        <CardDescription>SPD per hari bulan {currentMonth}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-8">
                        {dailyData.length > 0 ? (
                            <Chart3DWrapper intensity="medium">
                                <div className="h-62.5 sm:h-75 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dailyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
                                                    <stop offset="50%" stopColor="#ef4444" stopOpacity={0.2} />
                                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
                                                </linearGradient>
                                                <filter id="shadow3dDailyArea">
                                                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#ef4444" floodOpacity="0.3" />
                                                </filter>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                            <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} axisLine={false} tickLine={false} />
                                            <Tooltip formatter={(value) => typeof value === 'number' ? formatCurrency(value) : String(value ?? '')} contentStyle={Chart3DTooltipStyle()} />
                                            <Area type="monotone" dataKey="spd" stroke="#ef4444" strokeWidth={3} fill="url(#dailyGrad)" filter="url(#shadow3dDailyArea)" activeDot={{ r: 7, fill: '#ef4444', stroke: '#fff', strokeWidth: 3 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Chart3DWrapper>
                        ) : (
                            <div className="h-50 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                    <p>Belum ada data</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 6 Month Trend */}
                <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-indigo-600" />
                            </div>
                            Tren 6 Bulan Terakhir
                        </CardTitle>
                        <CardDescription>Perbandingan performa antar bulan</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-8">
                        {monthlyTrend.length > 0 ? (
                            <Chart3DWrapper intensity="medium">
                                <div className="h-62.5 sm:h-75 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                            <XAxis dataKey="month_short" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}M`} axisLine={false} tickLine={false} />
                                            <Tooltip formatter={(value) => typeof value === 'number' ? formatCurrency(value) : String(value ?? '')} contentStyle={Chart3DTooltipStyle()} />
                                            <Bar dataKey="spd">
                                                {monthlyTrend.map((_, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Chart3DWrapper>
                        ) : (
                            <div className="h-50 flex items-center justify-center text-gray-400">
                                <p>Belum ada data</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Day of Week Analysis */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-purple-600" />
                            </div>
                            Analisis Per Hari
                        </CardTitle>
                        <CardDescription>Rata-rata performa berdasarkan hari dalam seminggu</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {dayOfWeekData.length > 0 ? (
                            <div className="space-y-3">
                                {dayOfWeekData.map((day, i) => {
                                    const maxSpd = Math.max(...dayOfWeekData.map(d => d.avg_spd));
                                    const percentage = maxSpd > 0 ? (day.avg_spd / maxSpd) * 100 : 0;
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-gray-600 w-16 shrink-0">{day.day}</span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden relative">
                                                <div
                                                    className="h-full rounded-full bg-linear-to-r from-red-500 to-blue-500 transition-all duration-1000 flex items-center justify-end pr-3"
                                                    style={{ width: `${Math.max(percentage, 10)}%` }}
                                                >
                                                    <span className="text-[10px] font-bold text-white whitespace-nowrap">
                                                        {formatCurrency(day.avg_spd)}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 w-12 text-right shrink-0">{day.count}x</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-37.5 flex items-center justify-center text-gray-400">
                                <p>Belum ada data</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Weekly Distribution */}
                {weeklyData.length > 0 && (
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4 text-teal-600" />
                                </div>
                                Distribusi Mingguan
                            </CardTitle>
                            <CardDescription>Penjualan per minggu bulan ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {weeklyData.map((week, i) => (
                                    <div key={i} className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{week.week}</p>
                                        <p className="text-lg font-black text-gray-900">{formatCurrency(week.spd)}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-gray-400">{formatNumber(week.std)} struk</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Month vs Month Comparison Table */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Perbandingan Bulan</CardTitle>
                        <CardDescription>{comparison.current.month} vs {comparison.previous.month}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto -mx-6 px-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 font-semibold text-gray-600">Metrik</th>
                                        <th className="text-right py-3 font-semibold text-gray-600">{comparison.previous.month.split(' ')[0]}</th>
                                        <th className="text-right py-3 font-semibold text-gray-600">{comparison.current.month.split(' ')[0]}</th>
                                        <th className="text-right py-3 font-semibold text-gray-600">Perubahan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 font-medium">Total SPD</td>
                                        <td className="py-3 text-right text-gray-600">{formatCurrency(comparison.previous.total_spd)}</td>
                                        <td className="py-3 text-right font-bold">{formatCurrency(comparison.current.total_spd)}</td>
                                        <td className="py-3 text-right"><GrowthBadge value={comparison.growth.spd} /></td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 font-medium">Total STD</td>
                                        <td className="py-3 text-right text-gray-600">{formatNumber(comparison.previous.total_std)}</td>
                                        <td className="py-3 text-right font-bold">{formatNumber(comparison.current.total_std)}</td>
                                        <td className="py-3 text-right"><GrowthBadge value={comparison.growth.std} /></td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 font-medium">Rata-rata APC</td>
                                        <td className="py-3 text-right text-gray-600">{formatCurrency(comparison.previous.avg_apc)}</td>
                                        <td className="py-3 text-right font-bold">{formatCurrency(comparison.current.avg_apc)}</td>
                                        <td className="py-3 text-right"><GrowthBadge value={comparison.growth.apc} /></td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 font-medium">Total Pulsa</td>
                                        <td className="py-3 text-right text-gray-600">{formatCurrency(comparison.previous.total_pulsa)}</td>
                                        <td className="py-3 text-right font-bold">{formatCurrency(comparison.current.total_pulsa)}</td>
                                        <td className="py-3 text-right"><GrowthBadge value={comparison.growth.pulsa} /></td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 font-medium">Hari Dilaporkan</td>
                                        <td className="py-3 text-right text-gray-600">{comparison.previous.total_days} hari</td>
                                        <td className="py-3 text-right font-bold">{comparison.current.total_days} hari</td>
                                        <td className="py-3 text-right">—</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
