<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShiftReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'user_id',
        'report_date',
        'shift',
        'month_year',
    ];

    protected $casts = [
        'report_date' => 'date',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(ShiftReportDetail::class);
    }

    /**
     * Get total SPD for this report
     */
    public function getTotalSpdAttribute(): float
    {
        return $this->details()->sum('spd');
    }

    /**
     * Get total STD for this report
     */
    public function getTotalStdAttribute(): int
    {
        return $this->details()->sum('std');
    }

    /**
     * Get total Pulsa for this report
     */
    public function getTotalPulsaAttribute(): float
    {
        return $this->details()->sum('pulsa');
    }
}
