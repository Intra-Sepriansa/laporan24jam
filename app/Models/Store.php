<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'area',
        'address',
        'phone',
        'photo_path',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    public function shiftReports(): HasMany
    {
        return $this->hasMany(ShiftReport::class);
    }

    public function targets(): HasMany
    {
        return $this->hasMany(Target::class);
    }

    public function shiftNotes(): HasMany
    {
        return $this->hasMany(ShiftNote::class);
    }

    public function shiftChecklists(): HasMany
    {
        return $this->hasMany(ShiftChecklist::class);
    }
}
