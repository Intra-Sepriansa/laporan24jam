<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftReportDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'shift_report_id',
        'day_number',
        'transaction_date',
        'spd',
        'std',
        'apc',
        'pulsa',
        'notes',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'spd' => 'decimal:2',
        'apc' => 'decimal:2',
        'pulsa' => 'decimal:2',
    ];

    public function shiftReport(): BelongsTo
    {
        return $this->belongsTo(ShiftReport::class);
    }

    /**
     * Calculate APC automatically from SPD and STD
     */
    public function calculateApc(): float
    {
        if ($this->std > 0) {
            return round($this->spd / $this->std, 2);
        }
        return 0;
    }
}
