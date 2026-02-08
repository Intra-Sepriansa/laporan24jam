<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CashTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'employee_id',
        'cash_category_id',
        'type',
        'amount',
        'transaction_date',
        'reference_number',
        'description',
        'notes',
        'receipt_photo',
        'status',
        'approved_by',
        'approved_at',
        'approval_notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'transaction_date' => 'date',
        'approved_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_amount',
        'status_label',
        'type_label',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(CashCategory::class, 'cash_category_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'approved_by');
    }

    public function getFormattedAmountAttribute(): string
    {
        return 'Rp ' . number_format($this->amount, 0, ',', '.');
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'Menunggu Persetujuan',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            default => $this->status,
        };
    }

    public function getTypeLabelAttribute(): string
    {
        return match($this->type) {
            'income' => 'Pemasukan',
            'expense' => 'Pengeluaran',
            default => $this->type,
        };
    }

    public function scopeIncome($query)
    {
        return $query->where('type', 'income');
    }

    public function scopeExpense($query)
    {
        return $query->where('type', 'expense');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeForStore($query, $storeId)
    {
        return $query->where('store_id', $storeId);
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('transaction_date', $date);
    }

    public function scopeForMonth($query, $year, $month)
    {
        return $query->whereYear('transaction_date', $year)
                     ->whereMonth('transaction_date', $month);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            if (!$transaction->reference_number) {
                $transaction->reference_number = static::generateReferenceNumber();
            }
        });
    }

    public static function generateReferenceNumber(): string
    {
        $prefix = 'KAS';
        $date = now()->format('Ymd');
        $random = strtoupper(substr(md5(uniqid()), 0, 6));
        
        return "{$prefix}-{$date}-{$random}";
    }
}
