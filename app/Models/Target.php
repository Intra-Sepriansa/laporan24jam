<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Target extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'user_id',
        'month_year',
        'shift',
        'target_spd',
        'target_std',
        'target_apc',
        'target_pulsa',
        'notes',
    ];

    protected $casts = [
        'target_spd' => 'decimal:2',
        'target_std' => 'integer',
        'target_apc' => 'decimal:2',
        'target_pulsa' => 'decimal:2',
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
}
