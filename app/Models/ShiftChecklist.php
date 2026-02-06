<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftChecklist extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'user_id',
        'shift',
        'checklist_date',
        'title',
        'items',
        'is_template',
        'completed_count',
        'total_count',
    ];

    protected $casts = [
        'checklist_date' => 'date',
        'items' => 'array',
        'is_template' => 'boolean',
        'shift' => 'integer',
        'completed_count' => 'integer',
        'total_count' => 'integer',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getCompletionPercentageAttribute(): int
    {
        if ($this->total_count === 0) {
            return 0;
        }
        return (int) round(($this->completed_count / $this->total_count) * 100);
    }
}
