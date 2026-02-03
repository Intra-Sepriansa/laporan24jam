import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { index, store as storeRoute } from '@/routes/reports';
import type { SharedData } from '@/types';

interface DetailRow {
    day_number: number;
    transaction_date: string;
    spd: number;
    std: number;
    apc: number;
    pulsa: number;
    notes: string;
}

const toLocalDateInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const createDetailRow = (date: Date): DetailRow => ({
    day_number: date.getDate(),
    transaction_date: toLocalDateInput(date),
    spd: 0,
    std: 0,
    apc: 0,
    pulsa: 0,
    notes: '',
});

const isRowEmpty = (detail: DetailRow): boolean =>
    detail.spd === 0 &&
    detail.std === 0 &&
    (detail.pulsa ?? 0) === 0 &&
    (detail.notes ?? '').trim() === '';

export default function CreateReport() {
    const { auth } = usePage<SharedData>().props;
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
    const currentYear = currentDate.getFullYear();
    const currentMonthNumber = currentDate.getMonth() + 1;
    
    const maxDays = 30;
    const [daysInMonth, setDaysInMonth] = useState(maxDays);
    const [selectedMonth, setSelectedMonth] = useState(currentMonthNumber);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const { data, setData, post, processing, errors } = useForm({
        month_year: currentMonth,
        shift: 3,
        report_date: toLocalDateInput(currentDate),
        details: [] as DetailRow[],
    });

    // Initialize details when month changes
    useEffect(() => {
        const daysInSelectedMonth = new Date(
            selectedYear,
            selectedMonth,
            0,
        ).getDate();
        const days = Math.min(daysInSelectedMonth, maxDays);
        setDaysInMonth(days);

        const firstDayDate = new Date(selectedYear, selectedMonth - 1, 1);
        setData('details', [createDetailRow(firstDayDate)]);
    }, [selectedMonth, selectedYear]);

    // Auto-append an empty row after the last filled one
    useEffect(() => {
        if (data.details.length === 0) return;
        if (data.details.some(isRowEmpty)) return;

        const usedDays = new Set(data.details.map((detail) => detail.day_number));
        let nextDay = 1;
        while (nextDay <= daysInMonth && usedDays.has(nextDay)) {
            nextDay += 1;
        }
        if (nextDay > daysInMonth) return;

        const date = new Date(selectedYear, selectedMonth - 1, nextDay);
        setData('details', [...data.details, createDetailRow(date)]);
    }, [data.details, daysInMonth, selectedMonth, selectedYear]);

    const handleMonthChange = (month: string) => {
        const monthNum = parseInt(month);
        setSelectedMonth(monthNum);
        
        const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                           'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        setData('month_year', `${monthNames[monthNum - 1]} ${selectedYear}`);
    };

    const handleDetailChange = (
        index: number,
        field: keyof DetailRow,
        value: any,
    ) => {
        const newDetails = [...data.details];
        const updatedDetail = {
            ...newDetails[index],
            [field]: value,
        };

        if (field === 'transaction_date' && typeof value === 'string') {
            const date = new Date(`${value}T00:00:00`);
            if (!Number.isNaN(date.getTime())) {
                updatedDetail.day_number = date.getDate();
            }
        }

        newDetails[index] = {
            ...updatedDetail,
        };

        // Auto-calculate APC
        if (field === 'spd' || field === 'std') {
            const spd = field === 'spd' ? parseFloat(value) || 0 : newDetails[index].spd;
            const std = field === 'std' ? parseInt(value) || 0 : newDetails[index].std;
            newDetails[index].apc = std > 0 ? Math.round((spd / std) * 100) / 100 : 0;
        }

        setData('details', newDetails);
    };

    const handleRemoveDay = (index: number) => {
        if (data.details.length <= 1) return;
        const newDetails = data.details.filter((_, rowIndex) => rowIndex !== index);
        setData('details', newDetails);
    };

    const calculateTotals = () => {
        const totals = data.details.reduce((acc, detail) => ({
            spd: acc.spd + (detail.spd || 0),
            std: acc.std + (detail.std || 0),
            pulsa: acc.pulsa + (detail.pulsa || 0),
        }), { spd: 0, std: 0, pulsa: 0 });

        const avgApc = totals.std > 0 ? totals.spd / totals.std : 0;

        return { ...totals, avgApc };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(storeRoute.url());
    };

    const totals = calculateTotals();
    const minDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
    const maxDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
    const storeInfo = auth?.user?.employee?.store;
    const storeCode = storeInfo?.code ?? '-';
    const storeName = storeInfo?.name ?? '-';
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

    const formatShareNumber = (value: number): string => formatNumber(Math.round(value));

    const buildShareText = (): string => {
        const filledDetails = data.details.filter((detail) => !isRowEmpty(detail));
        const header = [
            `*Format laporan shift ${data.shift}*`,
            `*KODE : ${storeCode}*`,
            `*TOKO : ${storeName}*`,
            `*BULAN : ${data.month_year}*`,
            '',
            'No / Tanggal / SPD / STD / APC / PULSA',
        ];

        const rows = filledDetails.length
            ? filledDetails.map((detail, index) => {
                  const pulsaText =
                      detail.pulsa && detail.pulsa > 0
                          ? formatShareNumber(detail.pulsa)
                          : '';
                  const apcValue =
                      detail.std > 0 ? Math.floor(detail.spd / detail.std) : 0;
                  return `${index + 1}. ${detail.day_number}/${formatShareNumber(detail.spd)}/${formatShareNumber(detail.std)}/${formatShareNumber(apcValue)}/${pulsaText}`;
              })
            : ['-'];

        return [...header, ...rows].join('\n');
    };

    const handleCopyFormat = async () => {
        const text = buildShareText();
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                window.prompt('Salin format laporan:', text);
            }
            setCopyState('copied');
            window.setTimeout(() => setCopyState('idle'), 2000);
        } catch (error) {
            setCopyState('error');
        }
    };

    return (
        <AppLayout>
            <Head title="Buat Laporan Baru" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Button variant="outline" asChild className="w-full sm:w-fit">
                        <a href={index.url()}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </a>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Buat Laporan Baru</h1>
                        <p className="text-gray-600 mt-1">
                            Isi data laporan shift bulanan
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Report Header */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Laporan</CardTitle>
                            <CardDescription>
                                Pilih bulan, tahun, dan shift untuk laporan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="month">Bulan</Label>
                                    <Select 
                                        value={selectedMonth.toString()} 
                                        onValueChange={handleMonthChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                                <SelectItem key={month} value={month.toString()}>
                                                    {new Date(2024, month - 1).toLocaleString('id-ID', { month: 'long' })}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="year">Tahun</Label>
                                    <Select 
                                        value={selectedYear.toString()} 
                                        onValueChange={(value) => setSelectedYear(parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((year) => (
                                                <SelectItem key={year} value={year.toString()}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="shift">Shift</Label>
                                    <Select 
                                        value={data.shift.toString()} 
                                        onValueChange={(value) => setData('shift', parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Shift 1</SelectItem>
                                            <SelectItem value="2">Shift 2</SelectItem>
                                            <SelectItem value="3">Shift 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {errors.month_year && (
                                <p className="text-sm text-red-600">{errors.month_year}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Daily Details Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Harian</CardTitle>
                            <CardDescription>
                                Isi data penjualan untuk hari yang diinput (maks {daysInMonth} hari)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b-2">
                                            <th className="p-3 text-left font-semibold">No</th>
                                            <th className="p-3 text-left font-semibold">Tanggal</th>
                                            <th className="p-3 text-right font-semibold">SPD (Rp)</th>
                                            <th className="p-3 text-right font-semibold">STD</th>
                                            <th className="p-3 text-right font-semibold">APC (Rp)</th>
                                            <th className="p-3 text-right font-semibold">Pulsa (Rp)</th>
                                            <th className="p-3 text-center font-semibold">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.details.map((detail, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="p-2 font-medium">{detail.day_number}</td>
                                                <td className="p-2">
                                                    <Input
                                                        type="date"
                                                        value={detail.transaction_date}
                                                        onChange={(e) => handleDetailChange(index, 'transaction_date', e.target.value)}
                                                        className="w-40"
                                                        min={minDate}
                                                        max={maxDate}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        value={detail.spd || ''}
                                                        onChange={(e) => handleDetailChange(index, 'spd', parseFloat(e.target.value) || 0)}
                                                        className="text-right"
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        value={detail.std || ''}
                                                        onChange={(e) => handleDetailChange(index, 'std', parseInt(e.target.value) || 0)}
                                                        className="text-right"
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="p-2 text-right font-semibold text-accent">
                                                    {formatCurrency(detail.apc)}
                                                </td>
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        value={detail.pulsa || ''}
                                                        onChange={(e) => handleDetailChange(index, 'pulsa', parseFloat(e.target.value) || 0)}
                                                        className="text-right"
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </td>
                                                <td className="p-2 text-center">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveDay(index)}
                                                        disabled={data.details.length <= 1}
                                                        aria-label="Hapus hari"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Totals Row */}
                                        <tr className="bg-primary/5 font-bold border-t-2">
                                            <td colSpan={2} className="p-3 text-right">TOTAL:</td>
                                            <td className="p-3 text-right text-primary">
                                                {formatCurrency(totals.spd)}
                                            </td>
                                            <td className="p-3 text-right text-secondary">
                                                {formatNumber(totals.std)}
                                            </td>
                                            <td className="p-3 text-right text-accent">
                                                {formatCurrency(totals.avgApc)}
                                            </td>
                                            <td className="p-3 text-right text-green-600">
                                                {formatCurrency(totals.pulsa)}
                                            </td>
                                            <td />
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden space-y-4">
                                {data.details.map((detail, index) => {
                                    const rowKey = `${detail.day_number}-${index}`;

                                    return (
                                        <div
                                            key={rowKey}
                                            className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-slate-900">
                                                    Hari {detail.day_number}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveDay(index)}
                                                    disabled={data.details.length <= 1}
                                                    aria-label="Hapus hari"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="mt-4 grid gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`date-${rowKey}`}>Tanggal</Label>
                                                    <Input
                                                        id={`date-${rowKey}`}
                                                        type="date"
                                                        value={detail.transaction_date}
                                                        onChange={(e) =>
                                                            handleDetailChange(
                                                                index,
                                                                'transaction_date',
                                                                e.target.value,
                                                            )
                                                        }
                                                        min={minDate}
                                                        max={maxDate}
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`spd-${rowKey}`}>SPD (Rp)</Label>
                                                        <Input
                                                            id={`spd-${rowKey}`}
                                                            type="number"
                                                            value={detail.spd || ''}
                                                            onChange={(e) =>
                                                                handleDetailChange(
                                                                    index,
                                                                    'spd',
                                                                    parseFloat(e.target.value) || 0,
                                                                )
                                                            }
                                                            className="text-right"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`std-${rowKey}`}>STD</Label>
                                                        <Input
                                                            id={`std-${rowKey}`}
                                                            type="number"
                                                            value={detail.std || ''}
                                                            onChange={(e) =>
                                                                handleDetailChange(
                                                                    index,
                                                                    'std',
                                                                    parseInt(e.target.value) || 0,
                                                                )
                                                            }
                                                            className="text-right"
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-2">
                                                        <Label>APC (Rp)</Label>
                                                        <div className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-right text-sm font-semibold text-amber-600 flex items-center justify-end">
                                                            {formatCurrency(detail.apc)}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`pulsa-${rowKey}`}>Pulsa (Rp)</Label>
                                                        <Input
                                                            id={`pulsa-${rowKey}`}
                                                            type="number"
                                                            value={detail.pulsa || ''}
                                                            onChange={(e) =>
                                                                handleDetailChange(
                                                                    index,
                                                                    'pulsa',
                                                                    parseFloat(e.target.value) || 0,
                                                                )
                                                            }
                                                            className="text-right"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                                    <div className="flex items-center justify-between text-slate-700">
                                        <span>Total SPD</span>
                                        <span className="font-semibold text-slate-900">
                                            {formatCurrency(totals.spd)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-slate-700">
                                        <span>Total STD</span>
                                        <span className="font-semibold text-slate-900">
                                            {formatNumber(totals.std)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-slate-700">
                                        <span>APC</span>
                                        <span className="font-semibold text-amber-600">
                                            {formatCurrency(totals.avgApc)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-slate-700">
                                        <span>Total Pulsa</span>
                                        <span className="font-semibold text-emerald-600">
                                            {formatCurrency(totals.pulsa)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <span className="text-xs text-gray-500 sm:text-sm">
                                        {data.details.length} hari diinput
                                    </span>
                                    <Button type="button" variant="outline" onClick={handleCopyFormat} className="w-full sm:w-auto">
                                        {copyState === 'copied' ? 'Format Tersalin' : 'Salin Format'}
                                    </Button>
                                </div>
                            </div>

                            {errors.details && (
                                <p className="text-sm text-red-600 mt-2">{errors.details}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
                        <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                            <a href={index.url()}>
                                Batal
                            </a>
                        </Button>
                        <Button type="submit" disabled={processing} size="lg" className="w-full sm:w-auto">
                            <Save className="w-5 h-5 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Laporan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
