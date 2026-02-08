import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar, 
    Plus, 
    Search, 
    Filter,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Users
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Attendance {
    id: number;
    employee: {
        id: number;
        name: string;
        nik: string;
    };
    attendance_date: string;
    clock_in: string | null;
    clock_out: string | null;
    shift: number;
    status: string;
    status_label: string;
    status_color: string;
    working_hours: number;
    notes: string | null;
}

interface Statistics {
    total_present: number;
    total_absent: number;
    total_late: number;
    total_sick: number;
}

interface Props {
    attendances: {
        data: Attendance[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    statistics: Statistics;
    filters: {
        month?: string;
        status?: string;
        search?: string;
    };
    currentMonth: string;
}

export default function AttendanceIndex({ attendances, statistics, filters, currentMonth }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/attendance', { ...filters, search }, { preserveState: true });
    };

    const getStatusBadgeVariant = (color: string) => {
        switch (color) {
            case 'green': return 'default';
            case 'red': return 'destructive';
            case 'yellow': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <AppLayout>
            <Head title="Jadwal Absen" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Jadwal Absen</h1>
                        <p className="text-gray-600 mt-1">
                            Kelola absensi karyawan shift 3 - {currentMonth}
                        </p>
                    </div>
                    <Button asChild>
                        <a href="/attendance/create">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Absen
                        </a>
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Hadir
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-600">
                                {statistics.total_present}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <XCircle className="w-4 h-4 text-red-500" />
                                Tidak Hadir
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-red-600">
                                {statistics.total_absent}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                Terlambat
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-yellow-600">
                                {statistics.total_late}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <Users className="w-4 h-4 text-orange-500" />
                                Sakit
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-orange-600">
                                {statistics.total_sick}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filter & Pencarian
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Cari nama karyawan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <Button type="submit">
                                <Search className="w-4 h-4 mr-2" />
                                Cari
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Attendance List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Absensi</CardTitle>
                        <CardDescription>
                            Total {attendances.total} data absensi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b-2">
                                        <th className="p-3 text-left font-semibold">Tanggal</th>
                                        <th className="p-3 text-left font-semibold">Karyawan</th>
                                        <th className="p-3 text-left font-semibold">Clock In</th>
                                        <th className="p-3 text-left font-semibold">Clock Out</th>
                                        <th className="p-3 text-left font-semibold">Jam Kerja</th>
                                        <th className="p-3 text-left font-semibold">Status</th>
                                        <th className="p-3 text-left font-semibold">Shift</th>
                                        <th className="p-3 text-right font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances.data.length > 0 ? (
                                        attendances.data.map((attendance) => (
                                            <tr key={attendance.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        {new Date(attendance.attendance_date).toLocaleDateString('id-ID', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div>
                                                        <p className="font-medium">{attendance.employee.name}</p>
                                                        <p className="text-xs text-gray-500">{attendance.employee.nik}</p>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    {attendance.clock_in ? (
                                                        <div className="flex items-center gap-1 text-green-600">
                                                            <Clock className="w-3 h-3" />
                                                            {attendance.clock_in}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    {attendance.clock_out ? (
                                                        <div className="flex items-center gap-1 text-red-600">
                                                            <Clock className="w-3 h-3" />
                                                            {attendance.clock_out}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    {attendance.working_hours > 0 ? (
                                                        <span className="font-medium">
                                                            {attendance.working_hours.toFixed(1)} jam
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <Badge variant={getStatusBadgeVariant(attendance.status_color)}>
                                                        {attendance.status_label}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    <Badge variant="outline">Shift {attendance.shift}</Badge>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <a href={`/attendance/${attendance.id}/edit`}>
                                                                Edit
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="p-8 text-center text-gray-500">
                                                Belum ada data absensi
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {attendances.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Menampilkan {attendances.data.length} dari {attendances.total} data
                                </p>
                                <div className="flex gap-2">
                                    {Array.from({ length: attendances.last_page }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={page === attendances.current_page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => router.get(`/attendance?page=${page}`, filters, { preserveState: true })}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
