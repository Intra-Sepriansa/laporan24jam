<?php

namespace App\Http\Controllers;

use App\Models\ShiftChecklist;
use App\Models\ShiftNote;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShiftNoteController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load('employee.store');
        $storeId = $user->employee->store_id;

        // Notes
        $query = ShiftNote::with('user')
            ->where('store_id', $storeId);

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('is_resolved')) {
            $query->where('is_resolved', $request->boolean('is_resolved'));
        }

        $notes = $query->orderBy('created_at', 'desc')
            ->take(50)
            ->get()
            ->map(function ($note) {
                return [
                    'id' => $note->id,
                    'shift' => $note->shift,
                    'note_date' => $note->note_date->format('d M Y'),
                    'type' => $note->type,
                    'title' => $note->title,
                    'content' => $note->content,
                    'priority' => $note->priority,
                    'is_resolved' => $note->is_resolved,
                    'created_by' => $note->user->name,
                    'created_at' => $note->created_at->diffForHumans(),
                ];
            });

        // Checklists
        $checklists = ShiftChecklist::with('user')
            ->where('store_id', $storeId)
            ->where('is_template', false)
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get()
            ->map(function ($cl) {
                return [
                    'id' => $cl->id,
                    'shift' => $cl->shift,
                    'checklist_date' => $cl->checklist_date->format('d M Y'),
                    'title' => $cl->title,
                    'items' => $cl->items,
                    'completed_count' => $cl->completed_count,
                    'total_count' => $cl->total_count,
                    'completion_percentage' => $cl->completion_percentage,
                    'created_by' => $cl->user->name,
                    'created_at' => $cl->created_at->diffForHumans(),
                ];
            });

        // Templates
        $templates = ShiftChecklist::where('store_id', $storeId)
            ->where('is_template', true)
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'title' => $t->title,
                    'items' => $t->items,
                    'total_count' => $t->total_count,
                ];
            });

        // Stats
        $stats = [
            'total_notes' => ShiftNote::where('store_id', $storeId)->count(),
            'unresolved' => ShiftNote::where('store_id', $storeId)->where('is_resolved', false)->count(),
            'urgent' => ShiftNote::where('store_id', $storeId)->where('priority', 'urgent')->where('is_resolved', false)->count(),
            'today_checklists' => ShiftChecklist::where('store_id', $storeId)
                ->where('checklist_date', now()->toDateString())
                ->where('is_template', false)
                ->count(),
        ];

        return Inertia::render('notes/index', [
            'notes' => $notes,
            'checklists' => $checklists,
            'templates' => $templates,
            'stats' => $stats,
            'filters' => $request->only(['type', 'priority', 'is_resolved']),
        ]);
    }

    public function storeNote(Request $request)
    {
        $user = $request->user()->load('employee.store');

        $validated = $request->validate([
            'shift' => 'required|integer|between:1,3',
            'note_date' => 'required|date',
            'type' => 'required|in:general,handover,incident,reminder',
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:2000',
            'priority' => 'required|in:low,normal,high,urgent',
        ]);

        ShiftNote::create([
            'store_id' => $user->employee->store_id,
            'user_id' => $user->id,
            ...$validated,
        ]);

        return back()->with('success', 'Catatan berhasil ditambahkan!');
    }

    public function toggleResolved(Request $request, ShiftNote $shiftNote)
    {
        if ($shiftNote->store_id !== $request->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }

        $shiftNote->update(['is_resolved' => !$shiftNote->is_resolved]);

        return back()->with('success', 'Status catatan diperbarui!');
    }

    public function destroyNote(Request $request, ShiftNote $shiftNote)
    {
        if ($shiftNote->store_id !== $request->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }

        $shiftNote->delete();

        return back()->with('success', 'Catatan berhasil dihapus!');
    }

    public function storeChecklist(Request $request)
    {
        $user = $request->user()->load('employee.store');

        $validated = $request->validate([
            'shift' => 'required|integer|between:1,3',
            'checklist_date' => 'required|date',
            'title' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.name' => 'required|string|max:255',
            'items.*.checked' => 'required|boolean',
            'is_template' => 'nullable|boolean',
        ]);

        $items = $validated['items'];
        $completedCount = collect($items)->where('checked', true)->count();

        ShiftChecklist::create([
            'store_id' => $user->employee->store_id,
            'user_id' => $user->id,
            'shift' => $validated['shift'],
            'checklist_date' => $validated['checklist_date'],
            'title' => $validated['title'],
            'items' => $items,
            'is_template' => $validated['is_template'] ?? false,
            'completed_count' => $completedCount,
            'total_count' => count($items),
        ]);

        return back()->with('success', 'Checklist berhasil dibuat!');
    }

    public function updateChecklist(Request $request, ShiftChecklist $shiftChecklist)
    {
        if ($shiftChecklist->store_id !== $request->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.name' => 'required|string|max:255',
            'items.*.checked' => 'required|boolean',
        ]);

        $items = $validated['items'];
        $completedCount = collect($items)->where('checked', true)->count();

        $shiftChecklist->update([
            'items' => $items,
            'completed_count' => $completedCount,
            'total_count' => count($items),
        ]);

        return back()->with('success', 'Checklist berhasil diperbarui!');
    }

    public function destroyChecklist(Request $request, ShiftChecklist $shiftChecklist)
    {
        if ($shiftChecklist->store_id !== $request->user()->employee->store_id) {
            abort(403, 'Unauthorized');
        }

        $shiftChecklist->delete();

        return back()->with('success', 'Checklist berhasil dihapus!');
    }
}
