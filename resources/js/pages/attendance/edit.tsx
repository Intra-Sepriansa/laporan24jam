import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Employee {
    id: number;
    name: string;
    nik: string;
}

interface Store {
    id: number;
    code: string;
    name: string;
}

interface Attendance {
    id: number;
    employee_id: number;
    attendance_date: string;
    clock_in: string | null;
    clock_out: string | null;
    shift: number;
    status: string;
    notes: string | null;
}

interface Props {
    attendance: Attendance;
    employees: Employee[];
    store: Store;
}

export default function AttendanceEdit({ attendance, employees, store }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        employee_id: attendance.employee_id.toString(),
        attendance_date: attendance.attendance_date,
        clock_in: attendance.clock_in || '',
        clock_out: attendance.clock_out || '',
        shift: attendance.shift.toString(),
        status: attendance.status,
        notes: attendance.notes || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/attendance/${attendance.id}`);
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus data absensi ini?')) {
            useForm().delete(`/attendance/${attendance.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Edit Absen" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" asChild>
                            <a href="/attendance">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </a>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Data Absen</h1>
                            <p className="text-gray-600 mt-1">
                                Edit data absensi karyawan shift 3
                            </p>
                        </div>
                    </div>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Absensi</CardTitle>
                        <CardDescription>
                            Edit form di bawah untuk mengubah data absensi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Employee */}
                            <div className="space-y-2">
                                <Label htmlFor="employee_id">Karyawan *</Label>
                                <select
                                    id="employee_id"
                                    value={data.employee_id}
                                    onChange={(e) => setData('employee_id', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                    required
                                >
                                    <option value="">Pilih Karyawan</option>
                                    {employees.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.name} - {employee.nik}
                                        </option>
                                    ))}
                                </select>
                                {errors.employee_id && (
                                    <p className="text-sm text-red-600">{errors.employee_id}</p>
                                )}
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <Label htmlFor="attendance_date">Tanggal *</Label>
                                <Input
                                    id="attendance_date"
                                    type="date"
                                    value={data.attendance_date}
                                    onChange={(e) => setData('attendance_date', e.target.value)}
                                    required
                                />
                                {errors.attendance_date && (
                                    <p className="text-sm text-red-600">{errors.attendance_date}</p>
                                )}
                            </div>

                            {/* Clock In & Clock Out */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="clock_in">Clock In</Label>
                                    <Input
                                        id="clock_in"
                                        type="time"
                                        value={data.clock_in}
                                        onChange={(e) => setData('clock_in', e.target.value)}
                                    />
                                    {errors.clock_in && (
                                        <p className="text-sm text-red-600">{errors.clock_in}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clock_out">Clock Out</Label>
                                    <Input
                                        id="clock_out"
                                        type="time"
                                        value={data.clock_out}
                                        onChange={(e) => setData('clock_out', e.target.value)}
                                    />
                                    {errors.clock_out && (
                                        <p className="text-sm text-red-600">{errors.clock_out}</p>
                                    )}
                                </div>
                            </div>

                            {/* Shift & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="shift">Shift *</Label>
                                    <select
                                        id="shift"
                                        value={data.shift}
                                        onChange={(e) => setData('shift', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        required
                                    >
                                        <option value="1">Shift 1 (Pagi)</option>
                                        <option value="2">Shift 2 (Siang)</option>
                                        <option value="3">Shift 3 (Malam)</option>
                                    </select>
                                    {errors.shift && (
                                        <p className="text-sm text-red-600">{errors.shift}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        required
                                    >
                                        <option value="present">Hadir</option>
                                        <option value="absent">Tidak Hadir</option>
                                        <option value="late">Terlambat</option>
                                        <option value="sick">Sakit</option>
                                        <option value="leave">Cuti</option>
                                        <option value="off">Libur</option>
                                    </select>
                                    {errors.status && (
                                        <p className="text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Catatan</Label>
                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[100px]"
                                    placeholder="Catatan tambahan (opsional)"
                                />
                                {errors.notes && (
                                    <p className="text-sm text-red-600">{errors.notes}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Update Absen'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <a href="/attendance">Batal</a>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
