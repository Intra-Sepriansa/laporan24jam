import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import { useState } from 'react';

interface Employee {
    id: number;
    nik: string;
    name: string;
}

interface ScheduleData {
    [employeeId: number]: {
        [day: number]: number | null;
    };
}

interface TodayScheduleItem {
    employee: Employee;
    shift: number;
    clock_in: string | null;
    clock_out: string | null;
    status: string;
}

interface Props {
    employees: Employee[];
    scheduleData: ScheduleData;
    month: string;
    year: number;
    daysInMonth: number;
    currentDate: string;
    todaySchedule: TodayScheduleItem[];
}

export default function AttendanceSchedule({ 
    employees, 
    scheduleData, 
    month, 
    year, 
    daysInMonth,
    currentDate,
    todaySchedule 
}: Props) {
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);
    const [selectedShift, setSelectedShift] = useState<number | null>(null);

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const currentMonthName = monthNames[parseInt(month) - 1];

    const getShiftBadge = (shift: number | null, isHovered: boolean = false) => {
        if (shift === null) {
            return (
                <div className={`w-10 h-10 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white font-bold rounded-lg shadow-md transition-all ${isHovered ? 'scale-110 shadow-lg' : ''}`}>
                    <span className="text-xs">OFF</span>
                </div>
            );
        }

        const shiftStyles = {
            1: 'from-blue-500 to-blue-600',
            2: 'from-yellow-500 to-yellow-600',
            3: 'from-green-500 to-green-600',
        };

        return (
            <div className={`w-10 h-10 flex items-center justify-center bg-gradient-to-br ${shiftStyles[shift as keyof typeof shiftStyles] || 'from-gray-500 to-gray-600'} text-white font-bold rounded-lg shadow-md transition-all ${isHovered ? 'scale-110 shadow-lg ring-2 ring-white' : ''}`}>
                {shift}
            </div>
        );
    };

    const getShiftLabel = (shift: number | null) => {
        if (shift === null) return 'OFF';
        if (shift === 1) return 'Pagi (06:00-14:00)';
        if (shift === 2) return 'Siang (14:00-22:00)';
        if (shift === 3) return 'Malam (22:00-06:00)';
        return 'Unknown';
    };

    const getDayName = (day: number) => {
        const date = new Date(year, parseInt(month) - 1, day);
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        return days[date.getDay()];
    };

    const isToday = (day: number) => {
        const today = new Date(currentDate);
        return today.getDate() === day && 
               today.getMonth() === parseInt(month) - 1 && 
               today.getFullYear() === year;
    };

    const isWeekend = (day: number) => {
        const date = new Date(year, parseInt(month) - 1, day);
        return date.getDay() === 0 || date.getDay() === 6;
    };

    const changeMonth = (direction: 'prev' | 'next') => {
        let newMonth = parseInt(month);
        let newYear = year;

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

        router.get('/attendance-schedule', { 
            month: newMonth.toString().padStart(2, '0'), 
            year: newYear 
        }, { preserveState: true });
    };

    const filterByShift = (shift: number | null) => {
        setSelectedShift(selectedShift === shift ? null : shift);
    };

    const getShiftCount = (shift: number | null) => {
        let count = 0;
        Object.values(scheduleData).forEach(employeeSchedule => {
            Object.values(employeeSchedule).forEach(s => {
                if (s === shift) count++;
            });
        });
        return count;
    };

    return (
        <AppLayout>
            <Head title="Jadwal Shift" />

            <div className="space-y-6 animate-in fade-in">
                {/* Header with Month Navigation */}
                <div className="flex items-center justify-between">
                    <div className="animate-in slide-in-from-left">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                            Jadwal Shift
                        </h1>
                        <p className="text-gray-600 mt-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Jadwal shift karyawan toko
                        </p>
                    </div>
                    <div className="flex items-center gap-3 animate-in slide-in-from-right">
                        <Button variant="outline" size="sm" onClick={() => changeMonth('prev')}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="text-center min-w-[180px]">
                            <p className="text-2xl font-bold text-gray-900">{currentMonthName}</p>
                            <p className="text-sm text-gray-600">{year}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => changeMonth('next')}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { shift: 1, label: 'Shift Pagi', color: 'from-blue-500 to-blue-600', icon: '🌅' },
                        { shift: 2, label: 'Shift Siang', color: 'from-yellow-500 to-yellow-600', icon: '☀️' },
                        { shift: 3, label: 'Shift Malam', color: 'from-green-500 to-green-600', icon: '🌙' },
                        { shift: null, label: 'Hari Libur', color: 'from-red-500 to-red-600', icon: '🏖️' },
                    ].map((item, idx) => (
                        <Card 
                            key={idx}
                            className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl animate-in slide-in-from-bottom ${
                                selectedShift === item.shift ? 'ring-2 ring-primary shadow-xl' : ''
                            }`}
                            onClick={() => filterByShift(item.shift)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                                        <p className="text-3xl font-bold">{getShiftCount(item.shift)}</p>
                                    </div>
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl shadow-lg`}>
                                        {item.icon}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Today's Schedule */}
                {todaySchedule.length > 0 && (
                    <Card className="border-l-4 border-l-primary shadow-lg animate-in slide-in-from-bottom">
                        <CardHeader className="bg-gradient-to-r from-red-50 to-blue-50">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <UserCheck className="w-6 h-6 text-primary" />
                                Jadwal Hari Ini
                            </CardTitle>
                            <CardDescription className="text-base">
                                {new Date(currentDate).toLocaleDateString('id-ID', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {todaySchedule.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-primary transition-all hover:shadow-lg animate-in zoom-in"
                                    >
                                        {getShiftBadge(item.shift)}
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900">{item.employee.name}</p>
                                            <p className="text-sm text-gray-600">
                                                Shift {item.shift} - {getShiftLabel(item.shift).split(' ')[0]}
                                            </p>
                                            {item.clock_in && (
                                                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    Masuk: {item.clock_in}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Monthly Schedule Table */}
                <Card className="shadow-xl animate-in slide-in-from-bottom">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Users className="w-6 h-6 text-primary" />
                            Jadwal Bulanan
                        </CardTitle>
                        <CardDescription className="text-base">
                            Tabel jadwal shift untuk bulan {currentMonthName} {year}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                {/* Header - Dates */}
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-gradient-to-r from-cyan-400 to-cyan-500">
                                        <th className="border-2 border-white p-3 sticky left-0 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold shadow-lg z-20">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                NIK
                                            </div>
                                        </th>
                                        <th className="border-2 border-white p-3 sticky left-[100px] bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold min-w-[150px] shadow-lg z-20">
                                            NAMA
                                        </th>
                                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                                            <th 
                                                key={day} 
                                                className={`border-2 border-white p-2 font-bold transition-all duration-300 ${
                                                    isToday(day) 
                                                        ? 'bg-gradient-to-br from-yellow-300 to-yellow-400 text-black shadow-lg scale-105' 
                                                        : isWeekend(day)
                                                        ? 'bg-gradient-to-br from-red-100 to-red-200'
                                                        : 'bg-gradient-to-br from-cyan-400 to-cyan-500'
                                                }`}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <span className="text-lg">{day}</span>
                                                    <span className="text-xs opacity-75">{getDayName(day)}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee, empIdx) => {
                                        const rowColor = empIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                                        
                                        // Filter by selected shift
                                        if (selectedShift !== null) {
                                            const hasSelectedShift = Object.values(scheduleData[employee.id] || {}).some(s => s === selectedShift);
                                            if (!hasSelectedShift) return null;
                                        }
                                        
                                        return (
                                            <tr 
                                                key={employee.id} 
                                                className={`${rowColor} hover:bg-blue-50 transition-colors animate-in fade-in`}
                                            >
                                                <td className="border border-gray-300 p-3 font-mono text-xs sticky left-0 bg-white shadow-md z-10">
                                                    <div className="font-semibold text-gray-700">{employee.nik}</div>
                                                </td>
                                                <td className="border border-gray-300 p-3 font-bold sticky left-[100px] bg-white shadow-md z-10">
                                                    <div className="text-gray-900">{employee.name}</div>
                                                </td>
                                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                                    const shift = scheduleData[employee.id]?.[day];
                                                    const cellKey = `${employee.id}-${day}`;
                                                    const isHovered = hoveredCell === cellKey;
                                                    
                                                    return (
                                                        <td 
                                                            key={day} 
                                                            className={`border border-gray-300 p-2 text-center transition-all duration-200 ${
                                                                isToday(day) ? 'bg-yellow-50' : ''
                                                            } ${isHovered ? 'bg-blue-100' : ''}`}
                                                            onMouseEnter={() => setHoveredCell(cellKey)}
                                                            onMouseLeave={() => setHoveredCell(null)}
                                                        >
                                                            <div className="flex items-center justify-center">
                                                                {getShiftBadge(shift, isHovered)}
                                                            </div>
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
                        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t-2">
                            <div className="flex flex-wrap gap-6 justify-center">
                                {[
                                    { shift: 1, label: 'Shift 1 - Pagi (06:00-14:00)', color: 'from-blue-500 to-blue-600' },
                                    { shift: 2, label: 'Shift 2 - Siang (14:00-22:00)', color: 'from-yellow-500 to-yellow-600' },
                                    { shift: 3, label: 'Shift 3 - Malam (22:00-06:00)', color: 'from-green-500 to-green-600' },
                                    { shift: null, label: 'OFF - Hari Libur', color: 'from-red-500 to-red-600' },
                                ].map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex items-center gap-3 animate-in zoom-in"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className={`w-10 h-10 bg-gradient-to-br ${item.color} text-white font-bold rounded-lg flex items-center justify-center shadow-md`}>
                                            {item.shift || <span className="text-xs">OFF</span>}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
