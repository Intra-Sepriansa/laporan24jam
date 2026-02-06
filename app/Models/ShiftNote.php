<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'user_id',
        'shift',
        'note_date',
        'type',
        'title',
        'content',
        'priority',
        'is_resolved',
    ];

    protected $casts = [
        'note_date' => 'date',
        'is_resolved' => 'boolean',
        'shift' => 'integer',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeUnresolved($query)
    {
        return $query->where('is_resolved', false);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
