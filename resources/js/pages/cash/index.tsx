import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Wallet, 
    TrendingUp, 
    TrendingDown, 
    Plus, 
    ChevronLeft, 
    ChevronRight,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    Download
} from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    type: string;
    icon: string;
    color: string;
}

interface Transaction {
    id: number;
    reference_number: string;
    type: string;
    type_label: string;
    amount: number;
    formatted_amount: string;
    transaction_date: string;
    description: string;
    status: string;
    status_label: string;
    category: Category;
    employee: {
        name: string;
        nik: string;
    };
}

interface Statistics {
    total_income: number;
    total_expense: number;
    current_balance: number;
    pending_count: number;
    net_flow: number;
}

interface Props {
    transactions: Transaction[];
    categories: Category[];
    statistics: Statistics;
    filters: {
        month: string;
        year: number;
    };
}

export default function CashIndex({ transactions, categories, statistics, filters }: Props) {
    const [selectedType, setSelectedType] = useState<string | null>(null);

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

        router.get('/cash', { 
            month: newMonth.toString().padStart(2, '0'), 
            year: newYear 
        }, { preserveState: true });
    };

    const formatCurrency = (amount: number) => {
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            approved: 'default',
            pending: 'secondary',
            rejected: 'destructive',
        };
        return variants[status as keyof typeof variants] || 'default';
    };

    const filteredTransactions = selectedType 
        ? transactions.filter(t => t.type === selectedType)
        : transactions;

    return (
        <AppLayout>
            <Head title="Uang Kas" />

            <div className="space-y-6 animate-in fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="animate-in slide-in-from-left">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            Uang Kas
                        </h1>
                        <p className="text-gray-600 mt-2 flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            Manajemen kas toko
                        </p>
                    </div>
                    <div className="flex items-center gap-3 animate-in slide-in-from-right">
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

                {/* Action Buttons */}
                <div className="flex gap-3 animate-in slide-in-from-top">
                    <Link href="/cash/create">
                        <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Transaksi
                        </Button>
                    </Link>
                    <Link href="/cash/report">
                        <Button variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Laporan
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all animate-in slide-in-from-bottom">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Saldo Kas</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(statistics.current_balance)}
                                    </p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                                    <Wallet className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className={`border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-all cursor-pointer animate-in slide-in-from-bottom ${
                            selectedType === 'income' ? 'ring-2 ring-green-500' : ''
                        }`}
                        onClick={() => setSelectedType(selectedType === 'income' ? null : 'income')}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Pemasukan</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(statistics.total_income)}
                                    </p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                                    <TrendingUp className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className={`border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-all cursor-pointer animate-in slide-in-from-bottom ${
                            selectedType === 'expense' ? 'ring-2 ring-red-500' : ''
                        }`}
                        onClick={() => setSelectedType(selectedType === 'expense' ? null : 'expense')}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Pengeluaran</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatCurrency(statistics.total_expense)}
                                    </p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                                    <TrendingDown className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-yellow-500 shadow-lg hover:shadow-xl transition-all animate-in slide-in-from-bottom">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Menunggu Approval</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {statistics.pending_count}
                                    </p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                                    <Clock className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Transactions List */}
                <Card className="shadow-xl animate-in slide-in-from-bottom">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Daftar Transaksi
                        </CardTitle>
                        <CardDescription>
                            {selectedType ? `Menampilkan transaksi ${selectedType === 'income' ? 'pemasukan' : 'pengeluaran'}` : 'Semua transaksi bulan ini'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {filteredTransactions.length === 0 ? (
                            <div className="text-center py-12">
                                <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Belum ada transaksi</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredTransactions.map((transaction, idx) => (
                                    <div 
                                        key={transaction.id}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-primary transition-all hover:shadow-md animate-in slide-in-from-right"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div 
                                                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                                                    transaction.type === 'income' 
                                                        ? 'bg-gradient-to-br from-green-500 to-green-600' 
                                                        : 'bg-gradient-to-br from-red-500 to-red-600'
                                                }`}
                                            >
                                                {transaction.type === 'income' ? (
                                                    <TrendingUp className="w-6 h-6 text-white" />
                                                ) : (
                                                    <TrendingDown className="w-6 h-6 text-white" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-bold text-gray-900">{transaction.description}</p>
                                                    <Badge variant={getStatusBadge(transaction.status)}>
                                                        {transaction.status_label}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {transaction.category.name} • {transaction.reference_number}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(transaction.transaction_date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })} • {transaction.employee.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xl font-bold ${
                                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {transaction.type === 'income' ? '+' : '-'} {transaction.formatted_amount}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
