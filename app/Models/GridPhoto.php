<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GridPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'user_id',
        'code',
        'title',
        'image_path',
        'span',
        'position',
    ];

    protected $casts = [
        'span' => 'integer',
        'position' => 'integer',
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
