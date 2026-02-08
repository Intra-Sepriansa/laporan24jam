import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Wallet } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';

interface Category {
    id: number;
    name: string;
    type: string;
    icon: string;
    color: string;
}

interface Props {
    categories: Category[];
}

export default function CashCreate({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        cash_category_id: '',
        type: 'expense',
        amount: '',
        transaction_date: new Date().toISOString().split('T')[0],
        description: '',
        notes: '',
        receipt_photo: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/cash', {
            forceFormData: true,
        });
    };

    const incomeCategories = categories.filter(c => c.type === 'income');
    const expenseCategories = categories.filter(c => c.type === 'expense');
    const currentCategories = data.type === 'income' ? incomeCategories : expenseCategories;

    return (
        <AppLayout>
            <Head title="Tambah Transaksi Kas" />

            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/cash">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            Tambah Transaksi Kas
                        </h1>
                        <p className="text-gray-600 mt-1">Catat pemasukan atau pengeluaran kas</p>
                    </div>
                </div>

                {/* Form */}
                <Card className="shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2">
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="w-5 h-5" />
                            Form Transaksi
                        </CardTitle>
                        <CardDescription>Isi data transaksi dengan lengkap</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Type Selection */}
                            <div className="space-y-2">
                                <Label>Jenis Transaksi</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData('type', 'income');
                                            setData('cash_category_id', '');
                                        }}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            data.type === 'income'
                                                ? 'border-green-500 bg-green-50 shadow-lg'
                                                : 'border-gray-200 hover:border-green-300'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                                <span className="text-2xl">💰</span>
                                            </div>
                                            <p className="font-bold text-gray-900">Pemasukan</p>
                                            <p className="text-xs text-gray-600 mt-1">Uang masuk</p>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData('type', 'expense');
                                            setData('cash_category_id', '');
                                        }}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            data.type === 'expense'
                                                ? 'border-red-500 bg-red-50 shadow-lg'
                                                : 'border-gray-200 hover:border-red-300'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                                <span className="text-2xl">💸</span>
                                            </div>
                                            <p className="font-bold text-gray-900">Pengeluaran</p>
                                            <p className="text-xs text-gray-600 mt-1">Uang keluar</p>
                                        </div>
                                    </button>
                                </div>
                                <InputError message={errors.type} />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="cash_category_id">Kategori</Label>
                                <Select
                                    value={data.cash_category_id}
                                    onValueChange={(value) => setData('cash_category_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currentCategories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.cash_category_id} />
                            </div>

                            {/* Amount */}
                            <div className="space-y-2">
                                <Label htmlFor="amount">Jumlah (Rp)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    step="1000"
                                />
                                <InputError message={errors.amount} />
                            </div>

                            {/* Transaction Date */}
                            <div className="space-y-2">
                                <Label htmlFor="transaction_date">Tanggal Transaksi</Label>
                                <Input
                                    id="transaction_date"
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                />
                                <InputError message={errors.transaction_date} />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Contoh: Pembayaran gaji karyawan bulan Februari"
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Catatan (Opsional)</Label>
                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Catatan tambahan..."
                                />
                                <InputError message={errors.notes} />
                            </div>

                            {/* Receipt Photo */}
                            <div className="space-y-2">
                                <Label htmlFor="receipt_photo">Foto Bukti (Opsional)</Label>
                                <Input
                                    id="receipt_photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('receipt_photo', e.target.files?.[0] || null)}
                                />
                                <p className="text-xs text-gray-500">Format: JPG, PNG. Maksimal 2MB</p>
                                <InputError message={errors.receipt_photo} />
                            </div>

                            {/* Info Box */}
                            <div className="p-4 bg-blue-50 border-l-4 border-l-blue-500 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    <strong>Info:</strong> Transaksi di atas Rp 1.000.000 memerlukan persetujuan sebelum diproses.
                                </p>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                                </Button>
                                <Link href="/cash">
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
