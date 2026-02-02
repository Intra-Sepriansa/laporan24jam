import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Plus, Trash2, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface DetailRow {
    day_number: number;
    transaction_date: string;
    spd: number;
    std: number;
    apc: number;
    pulsa: number;
    notes: string;
}

export default function CreateReport() {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
    const currentYear = currentDate.getFullYear();
    const currentMonthNumber = currentDate.getMonth() + 1;
    
    const [daysInMonth, setDaysInMonth] = useState(31);
    const [selectedMonth, setSelectedMonth] = useState(currentMonthNumber);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const { data, setData, post, processing, errors } = useForm({
        month_year: currentMonth,
        shift: 3,
        report_date: currentDate.toISOString().split('T')[0],
        details: [] as DetailRow[],
    });

    // Initialize details when month changes
    useEffect(() => {
        const days = new Date(selectedYear, selectedMonth, 0).getDate();
        setDaysInMonth(days);
        
        const newDetails: DetailRow[] = [];
        for (let i = 1; i <= days; i++) {
            const date = new Date(selectedYear, selectedMonth - 1, i);
            newDetails.push({
                day_number: i,
                transaction_date: date.toISOString().split('T')[0],
                spd: 0,
                std: 0,
                apc: 0,
                pulsa: 0,
                notes: '',
            });
        }
        setData('details', newDetails);
    }, [selectedMonth, selectedYear]);

    const handleMonthChange = (month: string) => {
        const monthNum = parseInt(month);
        setSelectedMonth(monthNum);
        
        const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                           'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        setData('month_year', `${monthNames[monthNum - 1]} ${selectedYear}`);
    };

    const handleDetailChange = (index: number, field: keyof DetailRow, value: any) => {
        const newDetails = [...data.details];
        newDetails[index] = {
            ...newDetails[index],
            [field]: value,
        };

        // Auto-calculate APC
        if (field === 'spd' || field === 'std') {
            const spd = field === 'spd' ? parseFloat(value) || 0 : newDetails[index].spd;
            const std = field === 'std' ? parseInt(value) || 0 : newDetails[index].std;
            newDetails[index].apc = std > 0 ? Math.round((spd / std) * 100) / 100 : 0;
        }

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
        post(route('reports.store'));
    };

    const totals = calculateTotals();

    return (
        <AppLayout>
            <Head title="Buat Laporan Baru" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <a href={route('reports.index')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </a>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Buat Laporan Baru</h1>
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
                                Isi data penjualan untuk setiap hari ({daysInMonth} hari)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b-2">
                                            <th className="p-3 text-left font-semibold">No</th>
                                            <th className="p-3 text-left font-semibold">Tanggal</th>
                                            <th className="p-3 text-right font-semibold">SPD (Rp)</th>
                                            <th className="p-3 text-right font-semibold">STD</th>
                                            <th className="p-3 text-right font-semibold">APC (Rp)</th>
                                            <th className="p-3 text-right font-semibold">Pulsa (Rp)</th>
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
                                                        required
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
                                                        required
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        value={detail.std || ''}
                                                        onChange={(e) => handleDetailChange(index, 'std', parseInt(e.target.value) || 0)}
                                                        className="text-right"
                                                        min="0"
                                                        required
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
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {errors.details && (
                                <p className="text-sm text-red-600 mt-2">{errors.details}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <a href={route('reports.index')}>
                                Batal
                            </a>
                        </Button>
                        <Button type="submit" disabled={processing} size="lg">
                            <Save className="w-5 h-5 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Laporan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
