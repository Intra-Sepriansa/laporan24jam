<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'store_id',
        'attendance_date',
        'clock_in',
        'clock_out',
        'shift',
        'status',
        'notes',
    ];

    protected $casts = [
        'attendance_date' => 'date',
        'clock_in' => 'datetime:H:i',
        'clock_out' => 'datetime:H:i',
    ];

    /**
     * Get the employee that owns the attendance.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the store that owns the attendance.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get working hours in decimal format
     */
    public function getWorkingHoursAttribute(): float
    {
        if (!$this->clock_in || !$this->clock_out) {
            return 0;
        }

        $clockIn = \Carbon\Carbon::parse($this->clock_in);
        $clockOut = \Carbon\Carbon::parse($this->clock_out);

        return $clockIn->diffInHours($clockOut, true);
    }

    /**
     * Check if employee is late
     */
    public function getIsLateAttribute(): bool
    {
        if (!$this->clock_in) {
            return false;
        }

        // Shift 3 (malam) starts at 22:00
        $expectedTime = \Carbon\Carbon::parse('22:00');
        $clockIn = \Carbon\Carbon::parse($this->clock_in);

        return $clockIn->greaterThan($expectedTime->addMinutes(15)); // 15 minutes tolerance
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'present' => 'green',
            'absent' => 'red',
            'late' => 'yellow',
            'sick' => 'orange',
            'leave' => 'blue',
            'off' => 'gray',
            default => 'gray',
        };
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'present' => 'Hadir',
            'absent' => 'Tidak Hadir',
            'late' => 'Terlambat',
            'sick' => 'Sakit',
            'leave' => 'Cuti',
            'off' => 'Libur',
            default => 'Unknown',
        };
    }
}
