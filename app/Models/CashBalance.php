<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CashBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'balance_date',
        'opening_balance',
        'total_income',
        'total_expense',
        'closing_balance',
        'notes',
    ];

    protected $casts = [
        'balance_date' => 'date',
        'opening_balance' => 'decimal:2',
        'total_income' => 'decimal:2',
        'total_expense' => 'decimal:2',
        'closing_balance' => 'decimal:2',
    ];

    protected $appends = [
        'formatted_opening_balance',
        'formatted_total_income',
        'formatted_total_expense',
        'formatted_closing_balance',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function getFormattedOpeningBalanceAttribute(): string
    {
        return 'Rp ' . number_format($this->opening_balance, 0, ',', '.');
    }

    public function getFormattedTotalIncomeAttribute(): string
    {
        return 'Rp ' . number_format($this->total_income, 0, ',', '.');
    }

    public function getFormattedTotalExpenseAttribute(): string
    {
        return 'Rp ' . number_format($this->total_expense, 0, ',', '.');
    }

    public function getFormattedClosingBalanceAttribute(): string
    {
        return 'Rp ' . number_format($this->closing_balance, 0, ',', '.');
    }

    public static function calculateBalance($storeId, $date)
    {
        $previousBalance = static::where('store_id', $storeId)
            ->where('balance_date', '<', $date)
            ->orderBy('balance_date', 'desc')
            ->first();

        $openingBalance = $previousBalance ? $previousBalance->closing_balance : 0;

        $transactions = CashTransaction::forStore($storeId)
            ->forDate($date)
            ->approved()
            ->get();

        $totalIncome = $transactions->where('type', 'income')->sum('amount');
        $totalExpense = $transactions->where('type', 'expense')->sum('amount');
        $closingBalance = $openingBalance + $totalIncome - $totalExpense;

        return static::updateOrCreate(
            [
                'store_id' => $storeId,
                'balance_date' => $date,
            ],
            [
                'opening_balance' => $openingBalance,
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'closing_balance' => $closingBalance,
            ]
        );
    }
}
