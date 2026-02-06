import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Users,
    UserPlus,
    Search,
    Shield,
    UserCheck,
    UserX,
    FileText,
    Trash2,
    Edit,
    X,
    Check,
    Clock,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { FormEvent, useState } from 'react';

interface Employee {
    id: number;
    nik: string;
    name: string;
    position: string;
    is_active: boolean;
    has_account: boolean;
    total_reports: number;
    last_report: string | null;
    created_at: string;
}

interface Stats {
    total: number;
    active: number;
    inactive: number;
    with_account: number;
}

interface Props {
    employees: Employee[];
    stats: Stats;
    filters: {
        search?: string;
        position?: string;
        is_active?: string;
    };
}

export default function Employees({ employees, stats, filters }: Props) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const addForm = useForm({
        nik: '',
        name: '',
        position: 'Crew',
    });

    const editForm = useForm({
        name: '',
        position: '',
        is_active: true,
    });

    const handleAdd = (e: FormEvent) => {
        e.preventDefault();
        addForm.post('/employees', {
            onSuccess: () => {
                setShowAddForm(false);
                addForm.reset();
            },
        });
    };

    const startEdit = (emp: Employee) => {
        setEditingId(emp.id);
        editForm.setData({
            name: emp.name,
            position: emp.position,
            is_active: emp.is_active,
        });
    };

    const handleEdit = (e: FormEvent, id: number) => {
        e.preventDefault();
        editForm.put(`/employees/${id}`, {
            onSuccess: () => setEditingId(null),
        });
    };

    const handleSearch = () => {
        router.get('/employees', { search: searchQuery }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Manajemen Karyawan" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-2xl p-5 shadow-xl sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center sm:w-16 sm:h-16">
                                <Users className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white sm:text-4xl">Karyawan</h1>
                                <p className="text-white/80 text-sm sm:text-lg">Kelola data karyawan toko</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-white text-teal-600 hover:bg-gray-100 font-bold shadow-lg"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Tambah Karyawan
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-teal-600" />
                            <span className="text-xs font-semibold text-gray-500">Total</span>
                        </div>
                        <p className="text-2xl font-black text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <UserCheck className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-semibold text-gray-500">Aktif</span>
                        </div>
                        <p className="text-2xl font-black text-green-600">{stats.active}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <UserX className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-semibold text-gray-500">Nonaktif</span>
                        </div>
                        <p className="text-2xl font-black text-red-600">{stats.inactive}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-semibold text-gray-500">Punya Akun</span>
                        </div>
                        <p className="text-2xl font-black text-blue-600">{stats.with_account}</p>
                    </div>
                </div>

                {/* Add Form */}
                {showAddForm && (
                    <Card className="border-2 border-teal-200 shadow-lg">
                        <CardHeader className="bg-teal-50 border-b border-teal-100">
                            <CardTitle className="text-lg font-bold text-teal-800">Tambah Karyawan Baru</CardTitle>
                            <CardDescription>Akun login akan otomatis dibuat</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-600">NIK</Label>
                                        <Input
                                            value={addForm.data.nik}
                                            onChange={e => addForm.setData('nik', e.target.value)}
                                            className="mt-1"
                                            placeholder="Masukkan NIK"
                                            required
                                        />
                                        {addForm.errors.nik && <p className="text-xs text-red-500 mt-1">{addForm.errors.nik}</p>}
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-600">Nama</Label>
                                        <Input
                                            value={addForm.data.name}
                                            onChange={e => addForm.setData('name', e.target.value)}
                                            className="mt-1"
                                            placeholder="Nama lengkap"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-gray-600">Posisi</Label>
                                        <select
                                            value={addForm.data.position}
                                            onChange={e => addForm.setData('position', e.target.value)}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                        >
                                            <option value="Crew">Crew</option>
                                            <option value="Kasir">Kasir</option>
                                            <option value="Pramuniaga">Pramuniaga</option>
                                            <option value="Kepala Toko">Kepala Toko</option>
                                            <option value="Asisten Kepala Toko">Asisten Kepala Toko</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={addForm.processing} className="bg-teal-600 hover:bg-teal-700">
                                        {addForm.processing ? 'Menyimpan...' : 'Tambah Karyawan'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Batal</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Search */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            placeholder="Cari nama, NIK, atau posisi..."
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={handleSearch} variant="outline">
                        <Search className="w-4 h-4" />
                    </Button>
                </div>

                {/* Employee List */}
                <div className="space-y-3">
                    {employees.length > 0 ? (
                        employees.map((emp) => (
                            <Card key={emp.id} className={`border-0 shadow-md hover:shadow-lg transition-all ${!emp.is_active ? 'opacity-60' : ''}`}>
                                <CardContent className="p-4 sm:p-5">
                                    {editingId === emp.id ? (
                                        <form onSubmit={(e) => handleEdit(e, emp.id)} className="space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <Input
                                                    value={editForm.data.name}
                                                    onChange={e => editForm.setData('name', e.target.value)}
                                                    placeholder="Nama"
                                                />
                                                <select
                                                    value={editForm.data.position}
                                                    onChange={e => editForm.setData('position', e.target.value)}
                                                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                >
                                                    <option value="Crew">Crew</option>
                                                    <option value="Kasir">Kasir</option>
                                                    <option value="Pramuniaga">Pramuniaga</option>
                                                    <option value="Kepala Toko">Kepala Toko</option>
                                                    <option value="Asisten Kepala Toko">Asisten Kepala Toko</option>
                                                </select>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.data.is_active}
                                                        onChange={e => editForm.setData('is_active', e.target.checked)}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm">Aktif</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button type="submit" size="sm" className="bg-teal-600 hover:bg-teal-700">
                                                    <Check className="w-3 h-3 mr-1" /> Simpan
                                                </Button>
                                                <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                                    <X className="w-3 h-3 mr-1" /> Batal
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${emp.is_active ? 'bg-linear-to-br from-teal-500 to-cyan-500' : 'bg-gray-400'}`}>
                                                    {emp.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-gray-900">{emp.name}</h3>
                                                        {emp.is_active ? (
                                                            <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-full">Aktif</span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">Nonaktif</span>
                                                        )}
                                                        {emp.has_account && (
                                                            <Shield className="w-3 h-3 text-blue-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">NIK: {emp.nik} • {emp.position}</p>
                                                    <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <FileText className="w-3 h-3" />
                                                            {emp.total_reports} laporan
                                                        </span>
                                                        {emp.last_report && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {emp.last_report}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => startEdit(emp)} className="text-teal-600 border-teal-200 hover:bg-teal-50">
                                                    <Edit className="w-3 h-3 mr-1" /> Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                                    onClick={() => {
                                                        if (confirm('Yakin ingin menghapus karyawan ini?')) {
                                                            router.delete(`/employees/${emp.id}`);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="border-2 border-dashed border-gray-300">
                            <CardContent className="p-8 text-center">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Karyawan</h3>
                                <p className="text-gray-500">Tambahkan karyawan pertama untuk toko ini</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
