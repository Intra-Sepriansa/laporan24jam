import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Store,
    MapPin,
    Phone,
    FileText,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Users,
    Calendar,
    Edit,
    Save,
    X,
    Camera,
    BarChart3,
    Award,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Chart3DWrapper, Chart3DTooltipStyle } from '@/components/chart-3d-wrapper';
import { Bar3DShape } from '@/components/bar-3d-shape';
import { FormEvent, useState, useRef } from 'react';

interface StoreData {
    id: number;
    code: string;
    name: string;
    area: string | null;
    address: string | null;
    phone: string | null;
    description: string | null;
    photo_url: string | null;
    is_active: boolean;
}

interface StoreStats {
    total_reports: number;
    total_sales: number;
    total_transactions: number;
    avg_apc: number;
    total_employees: number;
    member_since: string;
}

interface MonthlySales {
    month: string;
    month_short: string;
    sales: number;
}

interface Props {
    store: StoreData;
    stats: StoreStats;
    monthlySales: MonthlySales[];
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function StoreProfile({ store, stats, monthlySales }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        address: store.address || '',
        phone: store.phone || '',
        description: store.description || '',
        photo: null as File | null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.post('/store', {
            method: 'put' as any,
            forceFormData: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <AppLayout>
            <Head title="Profil Toko" />

            <div className="space-y-6">
                {/* Store Header Card */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-red-600 via-red-500 to-blue-600 p-5 shadow-xl sm:p-8">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                {/* Store Photo / Avatar */}
                                <div className="relative group">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center overflow-hidden ring-2 ring-white/30 sm:w-24 sm:h-24">
                                        {store.photo_url ? (
                                            <img src={store.photo_url} alt={store.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Store className="w-10 h-10 text-white sm:w-12 sm:h-12" />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white rounded-full mb-2">
                                        {store.code}
                                    </span>
                                    <h1 className="text-2xl font-black text-white sm:text-4xl">{store.name}</h1>
                                    {store.area && (
                                        <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> Area {store.area}
                                        </p>
                                    )}
                                    {store.address && (
                                        <p className="text-white/60 text-xs mt-1">{store.address}</p>
                                    )}
                                    {store.phone && (
                                        <p className="text-white/60 text-xs mt-1 flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> {store.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-white/20 backdrop-blur text-white hover:bg-white/30 border border-white/30"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profil
                            </Button>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-6">
                            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                                <p className="text-[10px] text-white/60 uppercase tracking-wider">Laporan</p>
                                <p className="text-xl font-black text-white">{stats.total_reports}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                                <p className="text-[10px] text-white/60 uppercase tracking-wider">Karyawan</p>
                                <p className="text-xl font-black text-white">{stats.total_employees}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                                <p className="text-[10px] text-white/60 uppercase tracking-wider">Transaksi</p>
                                <p className="text-xl font-black text-white">{formatNumber(stats.total_transactions)}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center hidden sm:block">
                                <p className="text-[10px] text-white/60 uppercase tracking-wider">Avg APC</p>
                                <p className="text-xl font-black text-white">{formatCurrency(stats.avg_apc)}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center hidden sm:block">
                                <p className="text-[10px] text-white/60 uppercase tracking-wider">Sejak</p>
                                <p className="text-sm font-bold text-white">{stats.member_since}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                {isEditing && (
                    <Card className="border-2 border-red-200 shadow-lg">
                        <CardHeader className="bg-red-50 border-b border-red-100">
                            <CardTitle className="text-lg font-bold text-red-800">Edit Profil Toko</CardTitle>
                            <CardDescription>Perbarui informasi toko Anda</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-600">Alamat</Label>
                                        <Input
                                            value={form.data.address}
                                            onChange={e => form.setData('address', e.target.value)}
                                            className="mt-1"
                                            placeholder="Alamat lengkap toko"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-600">Telepon</Label>
                                        <Input
                                            value={form.data.phone}
                                            onChange={e => form.setData('phone', e.target.value)}
                                            className="mt-1"
                                            placeholder="Nomor telepon"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold text-gray-600">Deskripsi</Label>
                                    <textarea
                                        value={form.data.description}
                                        onChange={e => form.setData('description', e.target.value)}
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-20"
                                        placeholder="Deskripsi singkat tentang toko..."
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold text-gray-600">Foto Toko</Label>
                                    <div className="mt-1 flex items-center gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="gap-2"
                                        >
                                            <Camera className="w-4 h-4" />
                                            Pilih Foto
                                        </Button>
                                        {form.data.photo && (
                                            <span className="text-xs text-gray-500">{form.data.photo.name}</span>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => form.setData('photo', e.target.files?.[0] || null)}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={form.processing} className="bg-red-600 hover:bg-red-700">
                                        <Save className="w-4 h-4 mr-2" />
                                        {form.processing ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                        <X className="w-4 h-4 mr-2" /> Batal
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* All-time Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="border-0 shadow-lg hover:-translate-y-1 transition-all group">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <DollarSign className="w-5 h-5 text-red-600" />
                                </div>
                                <Award className="w-4 h-4 text-gray-300" />
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Penjualan</p>
                            <p className="text-lg font-black text-gray-900 mt-1 sm:text-2xl">{formatCurrency(stats.total_sales)}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Sepanjang waktu</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:-translate-y-1 transition-all group">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Transaksi</p>
                            <p className="text-lg font-black text-gray-900 mt-1 sm:text-2xl">{formatNumber(stats.total_transactions)}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Struk sepanjang waktu</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:-translate-y-1 transition-all group">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rata-rata APC</p>
                            <p className="text-lg font-black text-gray-900 mt-1 sm:text-2xl">{formatCurrency(stats.avg_apc)}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Average Per Customer</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:-translate-y-1 transition-all group">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Karyawan Aktif</p>
                            <p className="text-lg font-black text-gray-900 mt-1 sm:text-2xl">{stats.total_employees}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Orang</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly Sales Chart */}
                <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-red-600" />
                            </div>
                            Penjualan 6 Bulan Terakhir
                        </CardTitle>
                        <CardDescription>Tren penjualan bulanan toko</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-8">
                        {monthlySales.some(m => m.sales > 0) ? (
                            <Chart3DWrapper intensity="medium">
                                <div className="h-62.5 sm:h-75 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                            <XAxis dataKey="month_short" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}M`} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                formatter={(value) => typeof value === 'number' ? formatCurrency(value) : String(value ?? '')}
                                                contentStyle={Chart3DTooltipStyle()}
                                            />
                                            <Bar dataKey="sales">
                                                {monthlySales.map((_, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Chart3DWrapper>
                        ) : (
                            <div className="h-50 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                    <p>Belum ada data penjualan</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Store Description */}
                {store.description && (
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-gray-600" />
                                </div>
                                Tentang Toko
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 leading-relaxed">{store.description}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Store Info */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Informasi Toko</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <Store className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Kode Toko</p>
                                    <p className="font-bold text-gray-900">{store.code}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Area</p>
                                    <p className="font-bold text-gray-900">{store.area || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Telepon</p>
                                    <p className="font-bold text-gray-900">{store.phone || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Bergabung Sejak</p>
                                    <p className="font-bold text-gray-900">{stats.member_since}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
