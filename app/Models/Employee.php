<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'nik',
        'name',
        'store_id',
        'position',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }

    /**
     * Generate password format: KODE_TOKO#3_DIGIT_TERAKHIR_NIK
     */
    public function generatePassword(): string
    {
        $last3Digits = substr($this->nik, -3);
        return $this->store->code . '#' . $last3Digits;
    }
}
