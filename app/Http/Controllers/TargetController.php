<?php

namespace App\Http\Controllers;

use App\Models\ShiftReportDetail;
use App\Models\Target;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TargetController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load('employee.store');
        $storeId = $user->employee->store_id;

        $currentMonth = now()->format('F Y');
        $currentMonthUpper = strtoupper($currentMonth);

        // Get current target
        $target = Target::where('store_id', $storeId)
            ->where('month_year', $currentMonthUpper)
            ->first();

        // Get actual performance
        $actuals = ShiftReportDetail::whereHas('shiftReport', function ($q) use ($currentMonthUpper, $storeId) {
            $q->where('month_year', $currentMonthUpper)->where('store_id', $storeId);
        })->get();

        $performance = [
            'actual_spd' => round($actuals->sum('spd'), 2),
            'actual_std' => $actuals->sum('std'),
            'actual_apc' => round($actuals->avg('apc') ?? 0, 2),
            'actual_pulsa' => round($actuals->sum('pulsa'), 2),
            'days_reported' => $actuals->count(),
        ];

        // Calculate progress percentages
        if ($target) {
            $performance['progress_spd'] = $target->target_spd > 0
                ? min(round(($performance['actual_spd'] / $target->target_spd) * 100, 1), 100)
                : 0;
            $performance['progress_std'] = $target->target_std > 0
                ? min(round(($performance['actual_std'] / $target->target_std) * 100, 1), 100)
                : 0;
            $performance['progress_apc'] = $target->target_apc > 0
                ? min(round(($performance['actual_apc'] / $target->target_apc) * 100, 1), 100)
                : 0;
            $performance['progress_pulsa'] = $target->target_pulsa > 0
                ? min(round(($performance['actual_pulsa'] / $target->target_pulsa) * 100, 1), 100)
                : 0;
        }

        // Get all targets history
        $targets = Target::where('store_id', $storeId)
            ->orderBy('created_at', 'desc')
            ->take(12)
            ->get()
            ->map(function ($t) use ($storeId) {
                $actuals = ShiftReportDetail::whereHas('shiftReport', function ($q) use ($t, $storeId) {
                    $q->where('month_year', $t->month_year)->where('store_id', $storeId);
                })->get();

                return [
                    'id' => $t->id,
                    'month_year' => $t->month_year,
                    'shift' => $t->shift,
                    'target_spd' => $t->target_spd,
                    'target_std' => $t->target_std,
                    'target_apc' => $t->target_apc,
                    'target_pulsa' => $t->target_pulsa,
                    'actual_spd' => round($actuals->sum('spd'), 2),
                    'actual_std' => $actuals->sum('std'),
                    'actual_apc' => round($actuals->avg('apc') ?? 0, 2),
                    'actual_pulsa' => round($actuals->sum('pulsa'), 2),
                    'notes' => $t->notes,
                    'created_at' => $t->created_at->format('d M Y'),
                ];
            });

        // Daily progress for current month
        $daysInMonth = now()->daysInMonth;
        $daysPassed = now()->day;
        $projectedSpd = $daysPassed > 0 ? round(($performance['actual_spd'] / $daysPassed) * $daysInMonth, 2) : 0;
        $projectedStd = $daysPassed > 0 ? round(($performance['actual_std'] / $daysPassed) * $daysInMonth) : 0;

        return Inertia::render('targets/index', [
            'currentTarget' => $target ? [
                'id' => $target->id,
                'month_year' => $target->month_year,
                'shift' => $target->shift,
                'target_spd' => $target->target_spd,
                'target_std' => $target->target_std,
                'target_apc' => $target->target_apc,
                'target_pulsa' => $target->target_pulsa,
                'notes' => $target->notes,
            ] : null,
            'performance' => $performance,
            'targets' => $targets,
            'currentMonth' => $currentMonth,
            'daysInMonth' => $daysInMonth,
            'daysPassed' => $daysPassed,
            'projectedSpd' => $projectedSpd,
            'projectedStd' => $projectedStd,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user()->load('employee.store');

        $validated = $request->validate([
            'month_year' => 'required|string',
            'shift' => 'required|integer|between:1,3',
            'target_spd' => 'required|numeric|min:0',
            'target_std' => 'required|integer|min:0',
            'target_apc' => 'required|numeric|min:0',
            'target_pulsa' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:500',
        ]);

        Target::updateOrCreate(
            [
                'store_id' => $user->employee->store_id,
                'month_year' => strtoupper($validated['month_year']),
                'shift' => $validated['shift'],
            ],
            [
                'user_id' => $user->id,
                'target_spd' => $validated['target_spd'],
                'target_std' => $validated['target_std'],
                'target_apc' => $validated['target_apc'],
                'target_pulsa' => $validated['target_pulsa'],
                'notes' => $validated['notes'] ?? null,
            ]
        );

        return back()->with('success', 'Target berhasil disimpan!');
    }

    public function destroy(Request $request, Target $target)
    {
        if ($target->store_id !== $request->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }

        $target->delete();

        return back()->with('success', 'Target berhasil dihapus!');
    }
}
