import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, PieChart } from 'lucide-react';

interface Balance {
    balance_date: string;
    opening_balance: number;
    total_income: number;
    total_expense: number;
    closing_balance: number;
    formatted_opening_balance: string;
    formatted_total_income: string;
    formatted_total_expense: string;
    formatted_closing_balance: string;
}

interface CategorySummary {
    category: string;
    total: number;
    count: number;
}

interface Props {
    balances: Balance[];
    incomeByCategory: CategorySummary[];
    expenseByCategory: CategorySummary[];
    filters: {
        month: string;
        year: number;
    };
}

export default function CashReport({ balances, incomeByCategory, expenseByCategory, filters }: Props) {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const currentMonthName = monthNames[parseInt(filters.month) - 1];

    const changeMonth = (direction: 'prev' | 'next') => {
        let newMonth = parseInt(filters.month);
        let newYear = filters.year;

        if (direction === 'prev') {
            newMonth--;
            if (newMonth < 1) {
                newMonth = 12;
                newYear--;
            }
        } else {
            newMonth++;
            if (newMonth > 12) {
                newMonth = 1;
                newYear++;
            }
        }

        router.get('/cash/report', { 
            month: newMonth.toString().padStart(2, '0'), 
            year: newYear 
        }, { preserveState: true });
    };

    const formatCurrency = (amount: number) => {
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
    };

    const totalIncome = incomeByCategory.reduce((sum, item) => sum + item.total, 0);
    const totalExpense = expenseByCategory.reduce((sum, item) => sum + item.total, 0);
    const netFlow = totalIncome - totalExpense;

    return (
        <AppLayout>
            <Head title="Laporan Kas" />

            <div className="space-y-6 animate-in fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/cash">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                Laporan Kas
                            </h1>
                            <p className="text-gray-600 mt-2">Laporan keuangan bulanan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => changeMonth('prev')}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="text-center min-w-[180px]">
                            <p className="text-2xl font-bold text-gray-900">{currentMonthName}</p>
                            <p className="text-sm text-gray-600">{filters.year}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => changeMonth('next')}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-green-500 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Pemasukan</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(totalIncome)}
                                    </p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                                    <TrendingUp className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Pengeluaran</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatCurrency(totalExpense)}
                                    </p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                                    <TrendingDown className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`border-l-4 ${netFlow >= 0 ? 'border-l-blue-500' : 'border-l-orange-500'} shadow-lg`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Arus Kas Bersih</p>
                                    <p className={`text-2xl font-bold ${netFlow >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                        {formatCurrency(netFlow)}
                                    </p>
                                </div>
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${netFlow >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} flex items-center justify-center shadow-lg`}>
                                    <PieChart className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Category Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Income by Category */}
                    <Card className="shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b-2">
                            <CardTitle className="flex items-center gap-2 text-green-700">
                                <TrendingUp className="w-5 h-5" />
                                Pemasukan per Kategori
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {incomeByCategory.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">Belum ada data pemasukan</p>
                            ) : (
                                <div className="space-y-4">
                                    {incomeByCategory.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                            <div>
                                                <p className="font-bold text-gray-900">{item.category}</p>
                                                <p className="text-sm text-gray-600">{item.count} transaksi</p>
                                            </div>
                                            <p className="text-lg font-bold text-green-600">
                                                {formatCurrency(item.total)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Expense by Category */}
                    <Card className="shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b-2">
                            <CardTitle className="flex items-center gap-2 text-red-700">
                                <TrendingDown className="w-5 h-5" />
                                Pengeluaran per Kategori
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {expenseByCategory.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">Belum ada data pengeluaran</p>
                            ) : (
                                <div className="space-y-4">
                                    {expenseByCategory.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                                            <div>
                                                <p className="font-bold text-gray-900">{item.category}</p>
                                                <p className="text-sm text-gray-600">{item.count} transaksi</p>
                                            </div>
                                            <p className="text-lg font-bold text-red-600">
                                                {formatCurrency(item.total)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Daily Balance Table */}
                {balances.length > 0 && (
                    <Card className="shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2">
                            <CardTitle>Saldo Harian</CardTitle>
                            <CardDescription>Rincian saldo kas per hari</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left p-3 font-bold">Tanggal</th>
                                            <th className="text-right p-3 font-bold">Saldo Awal</th>
                                            <th className="text-right p-3 font-bold text-green-600">Pemasukan</th>
                                            <th className="text-right p-3 font-bold text-red-600">Pengeluaran</th>
                                            <th className="text-right p-3 font-bold">Saldo Akhir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {balances.map((balance, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-3">
                                                    {new Date(balance.balance_date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="text-right p-3">{balance.formatted_opening_balance}</td>
                                                <td className="text-right p-3 text-green-600 font-semibold">
                                                    {balance.formatted_total_income}
                                                </td>
                                                <td className="text-right p-3 text-red-600 font-semibold">
                                                    {balance.formatted_total_expense}
                                                </td>
                                                <td className="text-right p-3 font-bold">{balance.formatted_closing_balance}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
