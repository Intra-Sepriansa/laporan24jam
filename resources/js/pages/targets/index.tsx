import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Target,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Smartphone,
    Trophy,
    Flame,
    CheckCircle2,
    AlertTriangle,
    Plus,
    Trash2,
    Calendar,
    Zap,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { FormEvent, useState } from 'react';

interface TargetData {
    id: number;
    month_year: string;
    shift: number;
    target_spd: number;
    target_std: number;
    target_apc: number;
    target_pulsa: number;
    notes: string | null;
}

interface Performance {
    actual_spd: number;
    actual_std: number;
    actual_apc: number;
    actual_pulsa: number;
    days_reported: number;
    progress_spd?: number;
    progress_std?: number;
    progress_apc?: number;
    progress_pulsa?: number;
}

interface TargetHistory {
    id: number;
    month_year: string;
    shift: number;
    target_spd: number;
    target_std: number;
    target_apc: number;
    target_pulsa: number;
    actual_spd: number;
    actual_std: number;
    actual_apc: number;
    actual_pulsa: number;
    notes: string | null;
    created_at: string;
}

interface Props {
    currentTarget: TargetData | null;
    performance: Performance;
    targets: TargetHistory[];
    currentMonth: string;
    daysInMonth: number;
    daysPassed: number;
    projectedSpd: number;
    projectedStd: number;
}

function ProgressRing({ percentage, color, size = 80 }: { percentage: number; color: string; size?: number }) {
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={strokeWidth} fill="none" />
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black">{Math.round(percentage)}%</span>
            </div>
        </div>
    );
}

function getStatusIcon(progress: number) {
    if (progress >= 100) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (progress >= 75) return <Flame className="w-5 h-5 text-orange-500" />;
    if (progress >= 50) return <TrendingUp className="w-5 h-5 text-blue-500" />;
    return <AlertTriangle className="w-5 h-5 text-red-500" />;
}

function getStatusText(progress: number) {
    if (progress >= 100) return 'Target Tercapai! 🎉';
    if (progress >= 75) return 'Hampir Tercapai!';
    if (progress >= 50) return 'Sedang Berjalan';
    return 'Perlu Ditingkatkan';
}

export default function Targets({
    currentTarget,
    performance,
    targets,
    currentMonth,
    daysInMonth,
    daysPassed,
    projectedSpd,
    projectedStd,
}: Props) {
    const [showForm, setShowForm] = useState(!currentTarget);

    const form = useForm({
        month_year: currentTarget?.month_year || currentMonth.toUpperCase(),
        shift: currentTarget?.shift || 3,
        target_spd: currentTarget?.target_spd || 0,
        target_std: currentTarget?.target_std || 0,
        target_apc: currentTarget?.target_apc || 0,
        target_pulsa: currentTarget?.target_pulsa || 0,
        notes: currentTarget?.notes || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.post('/targets', {
            onSuccess: () => setShowForm(false),
        });
    };

    const avgProgress = currentTarget
        ? Math.round(((performance.progress_spd || 0) + (performance.progress_std || 0) + (performance.progress_apc || 0) + (performance.progress_pulsa || 0)) / 4)
        : 0;

    return (
        <AppLayout>
            <Head title="Target & KPI" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-linear-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-5 shadow-xl sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center sm:w-16 sm:h-16">
                                <Target className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white sm:text-4xl">Target & KPI</h1>
                                <p className="text-white/80 text-sm sm:text-lg">Pantau pencapaian target bulanan</p>
                                <p className="text-white/60 text-xs mt-1 sm:text-sm">
                                    <Calendar className="w-3 h-3 inline mr-1" />
                                    {currentMonth} — Hari ke-{daysPassed} dari {daysInMonth}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {currentTarget ? 'Edit Target' : 'Set Target'}
                        </Button>
                    </div>
                </div>

                {/* Set Target Form */}
                {showForm && (
                    <Card className="border-2 border-orange-200 shadow-lg">
                        <CardHeader className="bg-orange-50 border-b border-orange-100">
                            <CardTitle className="text-lg font-bold text-orange-800">
                                {currentTarget ? 'Edit Target Bulan Ini' : 'Set Target Baru'}
                            </CardTitle>
                            <CardDescription>Tentukan target untuk bulan {currentMonth}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-600">Target SPD (Rp)</Label>
                                        <Input
                                            type="number"
                                            value={form.data.target_spd}
                                            onChange={e => form.setData('target_spd', parseFloat(e.target.value) || 0)}
                                            className="mt-1"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-600">Target STD</Label>
                                        <Input
                                            type="number"
                                            value={form.data.target_std}
                                            onChange={e => form.setData('target_std', parseInt(e.target.value) || 0)}
                                            className="mt-1"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-600">Target APC (Rp)</Label>
                                        <Input
                                            type="number"
                                            value={form.data.target_apc}
                                            onChange={e => form.setData('target_apc', parseFloat(e.target.value) || 0)}
                                            className="mt-1"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-600">Target Pulsa (Rp)</Label>
                                        <Input
                                            type="number"
                                            value={form.data.target_pulsa}
                                            onChange={e => form.setData('target_pulsa', parseFloat(e.target.value) || 0)}
                                            className="mt-1"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold text-gray-600">Catatan (opsional)</Label>
                                    <Input
                                        value={form.data.notes}
                                        onChange={e => form.setData('notes', e.target.value)}
                                        className="mt-1"
                                        placeholder="Catatan target..."
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={form.processing} className="bg-orange-600 hover:bg-orange-700">
                                        {form.processing ? 'Menyimpan...' : 'Simpan Target'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Overall Progress */}
                {currentTarget && (
                    <Card className="border-0 shadow-lg bg-linear-to-br from-white to-orange-50">
                        <CardContent className="p-5 sm:p-8">
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
                                <ProgressRing percentage={avgProgress} color="#f97316" size={100} />
                                <div className="text-center sm:text-left">
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        {getStatusIcon(avgProgress)}
                                        <h3 className="text-xl font-black text-gray-900">{getStatusText(avgProgress)}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Rata-rata pencapaian {avgProgress}% — {performance.days_reported} hari dilaporkan
                                    </p>
                                    {projectedSpd > 0 && (
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-center sm:justify-start">
                                            <Zap className="w-3 h-3" />
                                            Proyeksi SPD akhir bulan: {formatCurrency(projectedSpd)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* KPI Progress Cards */}
                {currentTarget && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* SPD Progress */}
                        <Card className="border-0 shadow-lg hover:-translate-y-1 transition-all">
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-red-600" />
                                    </div>
                                    <ProgressRing percentage={performance.progress_spd || 0} color="#ef4444" size={50} />
                                </div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SPD</p>
                                <p className="text-lg font-black text-gray-900 mt-1">{formatCurrency(performance.actual_spd)}</p>
                                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                                    <div className="bg-red-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(performance.progress_spd || 0, 100)}%` }} />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Target: {formatCurrency(currentTarget.target_spd)}</p>
                            </CardContent>
                        </Card>

                        {/* STD Progress */}
                        <Card className="border-0 shadow-lg hover:-translate-y-1 transition-all">
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <ProgressRing percentage={performance.progress_std || 0} color="#3b82f6" size={50} />
                                </div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">STD</p>
                                <p className="text-lg font-black text-gray-900 mt-1">{formatNumber(performance.actual_std)}</p>
                                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(performance.progress_std || 0, 100)}%` }} />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Target: {formatNumber(currentTarget.target_std)}</p>
                            </CardContent>
                        </Card>

                        {/* APC Progress */}
                        <Card className="border-0 shadow-lg hover:-translate-y-1 transition-all">
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <ProgressRing percentage={performance.progress_apc || 0} color="#eab308" size={50} />
                                </div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">APC</p>
                                <p className="text-lg font-black text-gray-900 mt-1">{formatCurrency(performance.actual_apc)}</p>
                                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                                    <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(performance.progress_apc || 0, 100)}%` }} />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Target: {formatCurrency(currentTarget.target_apc)}</p>
                            </CardContent>
                        </Card>

                        {/* Pulsa Progress */}
                        <Card className="border-0 shadow-lg hover:-translate-y-1 transition-all">
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Smartphone className="w-5 h-5 text-green-600" />
                                    </div>
                                    <ProgressRing percentage={performance.progress_pulsa || 0} color="#22c55e" size={50} />
                                </div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pulsa</p>
                                <p className="text-lg font-black text-gray-900 mt-1">{formatCurrency(performance.actual_pulsa)}</p>
                                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                                    <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(performance.progress_pulsa || 0, 100)}%` }} />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Target: {formatCurrency(currentTarget.target_pulsa)}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* No Target Set */}
                {!currentTarget && !showForm && (
                    <Card className="border-2 border-dashed border-orange-300 bg-orange-50/50">
                        <CardContent className="p-8 text-center">
                            <Target className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Target</h3>
                            <p className="text-gray-500 mb-4">Set target bulanan untuk memantau pencapaian KPI toko Anda</p>
                            <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Set Target Sekarang
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Target History */}
                {targets.length > 0 && (
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-orange-600" />
                                </div>
                                Riwayat Target
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {targets.map((t) => {
                                    const spdProgress = t.target_spd > 0 ? Math.min(Math.round((t.actual_spd / t.target_spd) * 100), 100) : 0;
                                    return (
                                        <div key={t.id} className="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl hover:border-orange-200 hover:bg-orange-50/30 transition-all sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-bold text-gray-900">{t.month_year}</span>
                                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-full">Shift {t.shift}</span>
                                                    {getStatusIcon(spdProgress)}
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                                    <div>
                                                        <span className="text-gray-400">SPD</span>
                                                        <p className="font-bold">{formatCurrency(t.actual_spd)} / {formatCurrency(t.target_spd)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">STD</span>
                                                        <p className="font-bold">{formatNumber(t.actual_std)} / {formatNumber(t.target_std)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">APC</span>
                                                        <p className="font-bold">{formatCurrency(t.actual_apc)} / {formatCurrency(t.target_apc)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Pulsa</span>
                                                        <p className="font-bold">{formatCurrency(t.actual_pulsa)} / {formatCurrency(t.target_pulsa)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => router.delete(`/targets/${t.id}`)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
