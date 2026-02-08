<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $storeId = $user->employee->store_id;

        $query = Attendance::with(['employee', 'store'])
            ->where('store_id', $storeId);

        // Filter by month
        if ($request->has('month')) {
            $month = Carbon::parse($request->month);
            $query->whereYear('attendance_date', $month->year)
                  ->whereMonth('attendance_date', $month->month);
        } else {
            // Default to current month
            $query->whereYear('attendance_date', now()->year)
                  ->whereMonth('attendance_date', now()->month);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search by employee name
        if ($request->has('search')) {
            $query->whereHas('employee', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        $attendances = $query->orderBy('attendance_date', 'desc')
            ->orderBy('clock_in', 'desc')
            ->paginate(15);

        // Statistics for current month
        $currentMonth = $request->month ? Carbon::parse($request->month) : now();
        $stats = [
            'total_present' => Attendance::where('store_id', $storeId)
                ->whereYear('attendance_date', $currentMonth->year)
                ->whereMonth('attendance_date', $currentMonth->month)
                ->where('status', 'present')
                ->count(),
            'total_absent' => Attendance::where('store_id', $storeId)
                ->whereYear('attendance_date', $currentMonth->year)
                ->whereMonth('attendance_date', $currentMonth->month)
                ->where('status', 'absent')
                ->count(),
            'total_late' => Attendance::where('store_id', $storeId)
                ->whereYear('attendance_date', $currentMonth->year)
                ->whereMonth('attendance_date', $currentMonth->month)
                ->where('status', 'late')
                ->count(),
            'total_sick' => Attendance::where('store_id', $storeId)
                ->whereYear('attendance_date', $currentMonth->year)
                ->whereMonth('attendance_date', $currentMonth->month)
                ->where('status', 'sick')
                ->count(),
        ];

        return Inertia::render('attendance/index', [
            'attendances' => $attendances,
            'statistics' => $stats,
            'filters' => $request->only(['month', 'status', 'search']),
            'currentMonth' => $currentMonth->format('F Y'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();
        $employees = $user->employee->store->employees;

        return Inertia::render('attendance/create', [
            'employees' => $employees,
            'store' => $user->employee->store,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'attendance_date' => 'required|date',
            'clock_in' => 'nullable|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i|after:clock_in',
            'shift' => 'required|integer|in:1,2,3',
            'status' => 'required|in:present,absent,late,sick,leave,off',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        $validated['store_id'] = $user->employee->store_id;

        // Auto-detect late status
        if ($validated['status'] === 'present' && $validated['clock_in']) {
            $expectedTime = Carbon::parse('22:00');
            $clockIn = Carbon::parse($validated['clock_in']);
            if ($clockIn->greaterThan($expectedTime->addMinutes(15))) {
                $validated['status'] = 'late';
            }
        }

        Attendance::create($validated);

        return redirect()->route('attendance.index')
            ->with('success', 'Data absensi berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        $attendance->load(['employee', 'store']);

        return Inertia::render('attendance/show', [
            'attendance' => $attendance,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance $attendance)
    {
        $user = auth()->user();
        $employees = $user->employee->store->employees;

        return Inertia::render('attendance/edit', [
            'attendance' => $attendance,
            'employees' => $employees,
            'store' => $user->employee->store,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendance $attendance)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'attendance_date' => 'required|date',
            'clock_in' => 'nullable|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i|after:clock_in',
            'shift' => 'required|integer|in:1,2,3',
            'status' => 'required|in:present,absent,late,sick,leave,off',
            'notes' => 'nullable|string|max:500',
        ]);

        // Auto-detect late status
        if ($validated['status'] === 'present' && $validated['clock_in']) {
            $expectedTime = Carbon::parse('22:00');
            $clockIn = Carbon::parse($validated['clock_in']);
            if ($clockIn->greaterThan($expectedTime->addMinutes(15))) {
                $validated['status'] = 'late';
            }
        }

        $attendance->update($validated);

        return redirect()->route('attendance.index')
            ->with('success', 'Data absensi berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        $attendance->delete();

        return redirect()->route('attendance.index')
            ->with('success', 'Data absensi berhasil dihapus');
    }

    /**
     * Clock in
     */
    public function clockIn(Request $request)
    {
        $user = $request->user();
        $today = now()->format('Y-m-d');

        // Check if already clocked in today
        $existing = Attendance::where('employee_id', $user->employee_id)
            ->where('attendance_date', $today)
            ->first();

        if ($existing) {
            return back()->with('error', 'Anda sudah absen hari ini');
        }

        $clockIn = now()->format('H:i');
        $expectedTime = Carbon::parse('22:00');
        $actualTime = Carbon::parse($clockIn);
        $status = $actualTime->greaterThan($expectedTime->addMinutes(15)) ? 'late' : 'present';

        Attendance::create([
            'employee_id' => $user->employee_id,
            'store_id' => $user->employee->store_id,
            'attendance_date' => $today,
            'clock_in' => $clockIn,
            'shift' => 3,
            'status' => $status,
        ]);

        return back()->with('success', 'Clock in berhasil pada ' . $clockIn);
    }

    /**
     * Clock out
     */
    public function clockOut(Request $request)
    {
        $user = $request->user();
        $today = now()->format('Y-m-d');

        $attendance = Attendance::where('employee_id', $user->employee_id)
            ->where('attendance_date', $today)
            ->first();

        if (!$attendance) {
            return back()->with('error', 'Anda belum clock in hari ini');
        }

        if ($attendance->clock_out) {
            return back()->with('error', 'Anda sudah clock out hari ini');
        }

        $attendance->update([
            'clock_out' => now()->format('H:i'),
        ]);

        return back()->with('success', 'Clock out berhasil pada ' . now()->format('H:i'));
    }
}
