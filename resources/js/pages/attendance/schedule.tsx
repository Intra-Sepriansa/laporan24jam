import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users } from 'lucide-react';
import { useState } from 'react';

interface Employee {
    id: number;
    nik: string;
    name: string;
}

interface ScheduleData {
    [employeeId: number]: {
        [date: string]: number | null; // shift number or null for off
    };
}

interface Props {
    employees: Employee[];
    scheduleData: ScheduleData;
    month: string;
    year: number;
    daysInMonth: number;
    currentDate: string;
}

export default function AttendanceSchedule({ 
    employees, 
    scheduleData, 
    month, 
    year, 
    daysInMonth,
    currentDate 
}: Props) {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    const getShiftBadge = (shift: number | null) => {
        if (shift === null) {
            return (
                <div className="w-10 h-10 flex items-center justify-center bg-red-500 text-white font-bold rounded">
                    R
                </div>
            );
        }

        const colors = {
            1: 'bg-blue-500',
            2: 'bg-yellow-500',
            3: 'bg-green-600',
        };

        return (
            <div className={`w-10 h-10 flex items-center justify-center ${colors[shift as keyof typeof colors] || 'bg-gray-500'} text-white font-bold rounded`}>
                {shift}
            </div>
        );
    };

    const getShiftLabel = (shift: number | null) => {
        if (shift === null) return 'OFF';
        if (shift === 1) return 'Pagi';
        if (shift === 2) return 'Siang';
        if (shift === 3) return 'Malam';
        return 'Unknown';
    };

    const getDayName = (day: number) => {
        const date = new Date(year, parseInt(month) - 1, day);
        const days = ['M', 'S', 'SS', 'R', 'K', 'J', 'S'];
        return days[date.getDay()];
    };

    const isToday = (day: number) => {
        const today = new Date(currentDate);
        return today.getDate() === day && 
               today.getMonth() === parseInt(month) - 1 && 
               today.getFullYear() === year;
    };

    // Get today's schedule
    const todaySchedule = employees.map(emp => {
        const today = new Date(currentDate).getDate();
        const dateKey = `${year}-${month.padStart(2, '0')}-${today.toString().padStart(2, '0')}`;
        const shift = scheduleData[emp.id]?.[dateKey] || null;
        return { ...emp, shift };
    }).filter(emp => emp.shift !== null);

    return (
        <AppLayout>
            <Head title="Jadwal Shift" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Jadwal Shift</h1>
                        <p className="text-gray-600 mt-1">
                            Jadwal shift karyawan - {month}/{year}
                        </p>
                    </div>
                </div>

                {/* Today's Schedule */}
                <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Jadwal Hari Ini
                        </CardTitle>
                        <CardDescription>
                            {new Date(currentDate).toLocaleDateString('id-ID', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {todaySchedule.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {todaySchedule.map((emp) => (
                                    <div key={emp.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
                                        {getShiftBadge(emp.shift)}
                                        <div>
                                            <p className="font-bold text-gray-900">{emp.name}</p>
                                            <p className="text-sm text-gray-600">
                                                Shift {emp.shift} - {getShiftLabel(emp.shift)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                Tidak ada karyawan yang bekerja hari ini
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Schedule Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Jadwal Bulanan
                        </CardTitle>
                        <CardDescription>
                            Tabel jadwal shift untuk bulan {month}/{year}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-xs">
                                {/* Header - Dates */}
                                <thead>
                                    <tr className="bg-cyan-400">
                                        <th className="border border-gray-300 p-2 sticky left-0 bg-green-600 text-white font-bold">
                                            NIK
                                        </th>
                                        <th className="border border-gray-300 p-2 sticky left-[80px] bg-cyan-400 text-black font-bold min-w-[120px]">
                                            NAMA
                                        </th>
                                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                                            <th 
                                                key={day} 
                                                className={`border border-gray-300 p-2 font-bold ${
                                                    isToday(day) ? 'bg-yellow-300' : ''
                                                }`}
                                            >
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                    {/* Header - Day Names */}
                                    <tr className="bg-cyan-400">
                                        <th className="border border-gray-300 p-2 sticky left-0 bg-green-600"></th>
                                        <th className="border border-gray-300 p-2 sticky left-[80px] bg-cyan-400 text-black font-bold">
                                            HARI
                                        </th>
                                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                                            <th 
                                                key={day} 
                                                className={`border border-gray-300 p-1 text-xs ${
                                                    isToday(day) ? 'bg-yellow-300' : ''
                                                }`}
                                            >
                                                {getDayName(day)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee, idx) => {
                                        const rowColor = idx % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                                        return (
                                            <tr key={employee.id} className={rowColor}>
                                                <td className="border border-gray-300 p-2 font-mono text-xs sticky left-0 bg-white">
                                                    {employee.nik}
                                                </td>
                                                <td className="border border-gray-300 p-2 font-bold sticky left-[80px] bg-white">
                                                    {employee.name}
                                                </td>
                                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                                    const dateKey = `${year}-${month.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                                    const shift = scheduleData[employee.id]?.[dateKey];
                                                    
                                                    return (
                                                        <td 
                                                            key={day} 
                                                            className={`border border-gray-300 p-1 text-center ${
                                                                isToday(day) ? 'bg-yellow-100' : ''
                                                            }`}
                                                        >
                                                            {shift === null ? (
                                                                <span className="inline-block w-8 h-8 bg-red-500 text-white font-bold rounded flex items-center justify-center text-xs">
                                                                    R
                                                                </span>
                                                            ) : shift === 1 ? (
                                                                <span className="inline-block w-8 h-8 bg-blue-500 text-white font-bold rounded flex items-center justify-center">
                                                                    1
                                                                </span>
                                                            ) : shift === 2 ? (
                                                                <span className="inline-block w-8 h-8 bg-yellow-500 text-white font-bold rounded flex items-center justify-center">
                                                                    2
                                                                </span>
                                                            ) : shift === 3 ? (
                                                                <span className="inline-block w-8 h-8 bg-green-600 text-white font-bold rounded flex items-center justify-center">
                                                                    3
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Legend */}
                        <div className="mt-6 flex flex-wrap gap-4 justify-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-500 text-white font-bold rounded flex items-center justify-center">1</div>
                                <span className="text-sm">Shift 1 (Pagi)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-yellow-500 text-white font-bold rounded flex items-center justify-center">2</div>
                                <span className="text-sm">Shift 2 (Siang)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-600 text-white font-bold rounded flex items-center justify-center">3</div>
                                <span className="text-sm">Shift 3 (Malam)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-red-500 text-white font-bold rounded flex items-center justify-center text-xs">R</div>
                                <span className="text-sm">OFF (Libur)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
