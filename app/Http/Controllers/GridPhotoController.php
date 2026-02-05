<?php

namespace App\Http\Controllers;

use App\Models\GridPhoto;
use App\Models\GridSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GridPhotoController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load('employee.store');

        if (!$user->employee) {
            abort(403, 'Unauthorized');
        }

        $photos = GridPhoto::where('store_id', $user->employee->store_id)
            ->orderBy('position')
            ->orderBy('id')
            ->get()
            ->map(function (GridPhoto $photo) {
                return [
                    'id' => $photo->id,
                    'title' => $photo->title,
                    'code' => $photo->code,
                    'span' => $photo->span,
                    'position' => $photo->position,
                    'image_url' => Storage::url($photo->image_path),
                ];
            });

        $setting = GridSetting::firstOrCreate(
            ['store_id' => $user->employee->store_id],
            ['layout' => '2x3']
        );

        return Inertia::render('grid/index', [
            'photos' => $photos,
            'layout' => $setting->layout,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user()->load('employee.store');

        if (!$user->employee) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:120',
            'code' => 'nullable|string|max:50',
            'span' => 'nullable|integer|min:1|max:2',
            'image' => 'required|image|max:5120',
        ]);

        $storeId = $user->employee->store_id;
        $position = (GridPhoto::where('store_id', $storeId)->max('position') ?? 0) + 1;

        $path = $request->file('image')->store('grid-photos', 'public');

        GridPhoto::create([
            'store_id' => $storeId,
            'user_id' => $user->id,
            'title' => $validated['title'] ?? null,
            'code' => $validated['code'] ?? ($user->employee->store->code ?? null),
            'span' => $validated['span'] ?? 1,
            'position' => $position,
            'image_path' => $path,
        ]);

        return back()->with('success', 'Foto berhasil ditambahkan.');
    }

    public function batch(Request $request)
    {
        $user = $request->user()->load('employee.store');

        if (!$user->employee) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'layout' => 'nullable|in:2x2,2x3,3x3',
            'items' => 'nullable|array',
            'items.*.position' => 'required|integer|min:1|max:12',
            'items.*.title' => 'nullable|string|max:120',
            'items.*.code' => 'nullable|string|max:50',
            'items.*.image' => 'nullable|image|max:5120',
        ]);

        if (!empty($validated['layout'])) {
            GridSetting::updateOrCreate(
                ['store_id' => $user->employee->store_id],
                ['layout' => $validated['layout']]
            );
        }

        $items = $validated['items'] ?? [];
        foreach ($items as $item) {
            $position = $item['position'];

            $photo = GridPhoto::where('store_id', $user->employee->store_id)
                ->where('position', $position)
                ->first();

            $data = [
                'title' => $item['title'] ?? ($photo?->title),
                'code' => $item['code'] ?? ($photo?->code),
                'span' => $photo?->span ?? 1,
            ];

            if (isset($item['image']) && $item['image']) {
                if ($photo && $photo->image_path && Storage::disk('public')->exists($photo->image_path)) {
                    Storage::disk('public')->delete($photo->image_path);
                }
                $data['image_path'] = $item['image']->store('grid-photos', 'public');
            }

            if ($photo) {
                $photo->update($data);
            } else {
                if (!isset($data['image_path'])) {
                    continue;
                }
                GridPhoto::create([
                    'store_id' => $user->employee->store_id,
                    'user_id' => $user->id,
                    'position' => $position,
                    'title' => $data['title'] ?? null,
                    'code' => $data['code'] ?? ($user->employee->store->code ?? null),
                    'span' => 1,
                    'image_path' => $data['image_path'],
                ]);
            }
        }

        return back()->with('success', 'Grid berhasil diperbarui.');
    }

    public function update(Request $request, GridPhoto $grid)
    {
        $user = $request->user()->load('employee.store');

        if (!$user->employee) {
            abort(403, 'Unauthorized');
        }

        if ($grid->store_id !== $user->employee->store_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:120',
            'code' => 'nullable|string|max:50',
            'span' => 'nullable|integer|min:1|max:2',
            'image' => 'nullable|image|max:5120',
        ]);

        $data = [
            'title' => $validated['title'] ?? $grid->title,
            'code' => $validated['code'] ?? $grid->code,
            'span' => $validated['span'] ?? $grid->span,
        ];

        if ($request->hasFile('image')) {
            if ($grid->image_path && Storage::disk('public')->exists($grid->image_path)) {
                Storage::disk('public')->delete($grid->image_path);
            }
            $data['image_path'] = $request->file('image')->store('grid-photos', 'public');
        }

        $grid->update($data);

        return back()->with('success', 'Foto berhasil diperbarui.');
    }

    public function destroy(Request $request, GridPhoto $grid)
    {
        $user = $request->user()->load('employee.store');

        if (!$user->employee) {
            abort(403, 'Unauthorized');
        }

        if ($grid->store_id !== $user->employee->store_id) {
            abort(403, 'Unauthorized');
        }

        if ($grid->image_path && Storage::disk('public')->exists($grid->image_path)) {
            Storage::disk('public')->delete($grid->image_path);
        }

        $grid->delete();

        return back()->with('success', 'Foto berhasil dihapus.');
    }
}
