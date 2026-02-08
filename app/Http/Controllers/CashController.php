<?php

namespace App\Http\Controllers;

use App\Models\CashTransaction;
use App\Models\CashCategory;
use App\Models\CashBalance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CashController extends Controller
{
    public function index(Request $request)
    {
        $storeId = auth()->user()->employee->store_id;
        $month = $request->get('month', now()->format('m'));
        $year = $request->get('year', now()->year);

        $transactions = CashTransaction::with(['employee', 'category', 'approver'])
            ->forStore($storeId)
            ->forMonth($year, $month)
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $categories = CashCategory::active()->get();

        // Statistics
        $totalIncome = $transactions->where('type', 'income')->where('status', 'approved')->sum('amount');
        $totalExpense = $transactions->where('type', 'expense')->where('status', 'approved')->sum('amount');
        $pendingCount = $transactions->where('status', 'pending')->count();

        // Current balance
        $latestBalance = CashBalance::where('store_id', $storeId)
            ->orderBy('balance_date', 'desc')
            ->first();

        $currentBalance = $latestBalance ? $latestBalance->closing_balance : 0;

        return Inertia::render('cash/index', [
            'transactions' => $transactions,
            'categories' => $categories,
            'statistics' => [
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'current_balance' => $currentBalance,
                'pending_count' => $pendingCount,
                'net_flow' => $totalIncome - $totalExpense,
            ],
            'filters' => [
                'month' => $month,
                'year' => $year,
            ],
        ]);
    }

    public function create()
    {
        $categories = CashCategory::active()->get();

        return Inertia::render('cash/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cash_category_id' => 'required|exists:cash_categories,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'transaction_date' => 'required|date',
            'description' => 'required|string|max:500',
            'notes' => 'nullable|string',
            'receipt_photo' => 'nullable|image|max:2048',
        ]);

        $storeId = auth()->user()->employee->store_id;
        $employeeId = auth()->user()->employee->id;

        $validated['store_id'] = $storeId;
        $validated['employee_id'] = $employeeId;

        // Auto-approve small amounts, require approval for large amounts
        $validated['status'] = $validated['amount'] > 1000000 ? 'pending' : 'approved';

        if ($request->hasFile('receipt_photo')) {
            $validated['receipt_photo'] = $request->file('receipt_photo')->store('cash-receipts', 'public');
        }

        $transaction = CashTransaction::create($validated);

        // Update balance if approved
        if ($transaction->status === 'approved') {
            CashBalance::calculateBalance($storeId, $transaction->transaction_date);
        }

        return redirect()->route('cash.index')
            ->with('success', 'Transaksi kas berhasil ditambahkan');
    }

    public function edit(CashTransaction $cash)
    {
        $this->authorize('update', $cash);

        $cash->load(['category', 'employee']);
        $categories = CashCategory::active()->get();

        return Inertia::render('cash/edit', [
            'transaction' => $cash,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, CashTransaction $cash)
    {
        $this->authorize('update', $cash);

        $validated = $request->validate([
            'cash_category_id' => 'required|exists:cash_categories,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'transaction_date' => 'required|date',
            'description' => 'required|string|max:500',
            'notes' => 'nullable|string',
            'receipt_photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('receipt_photo')) {
            if ($cash->receipt_photo) {
                Storage::disk('public')->delete($cash->receipt_photo);
            }
            $validated['receipt_photo'] = $request->file('receipt_photo')->store('cash-receipts', 'public');
        }

        $cash->update($validated);

        // Recalculate balance
        if ($cash->status === 'approved') {
            CashBalance::calculateBalance($cash->store_id, $cash->transaction_date);
        }

        return redirect()->route('cash.index')
            ->with('success', 'Transaksi kas berhasil diperbarui');
    }

    public function destroy(CashTransaction $cash)
    {
        $this->authorize('delete', $cash);

        $storeId = $cash->store_id;
        $date = $cash->transaction_date;

        if ($cash->receipt_photo) {
            Storage::disk('public')->delete($cash->receipt_photo);
        }

        $cash->delete();

        // Recalculate balance
        CashBalance::calculateBalance($storeId, $date);

        return redirect()->route('cash.index')
            ->with('success', 'Transaksi kas berhasil dihapus');
    }

    public function approve(Request $request, CashTransaction $cash)
    {
        $validated = $request->validate([
            'approval_notes' => 'nullable|string',
        ]);

        $cash->update([
            'status' => 'approved',
            'approved_by' => auth()->user()->employee->id,
            'approved_at' => now(),
            'approval_notes' => $validated['approval_notes'] ?? null,
        ]);

        // Update balance
        CashBalance::calculateBalance($cash->store_id, $cash->transaction_date);

        return back()->with('success', 'Transaksi berhasil disetujui');
    }

    public function reject(Request $request, CashTransaction $cash)
    {
        $validated = $request->validate([
            'approval_notes' => 'required|string',
        ]);

        $cash->update([
            'status' => 'rejected',
            'approved_by' => auth()->user()->employee->id,
            'approved_at' => now(),
            'approval_notes' => $validated['approval_notes'],
        ]);

        return back()->with('success', 'Transaksi ditolak');
    }

    public function report(Request $request)
    {
        $storeId = auth()->user()->employee->store_id;
        $month = $request->get('month', now()->format('m'));
        $year = $request->get('year', now()->year);

        $balances = CashBalance::where('store_id', $storeId)
            ->whereYear('balance_date', $year)
            ->whereMonth('balance_date', $month)
            ->orderBy('balance_date')
            ->get();

        $transactions = CashTransaction::with(['category', 'employee'])
            ->forStore($storeId)
            ->forMonth($year, $month)
            ->approved()
            ->orderBy('transaction_date')
            ->get();

        // Group by category
        $incomeByCategory = $transactions->where('type', 'income')
            ->groupBy('cash_category_id')
            ->map(fn($items) => [
                'category' => $items->first()->category->name,
                'total' => $items->sum('amount'),
                'count' => $items->count(),
            ]);

        $expenseByCategory = $transactions->where('type', 'expense')
            ->groupBy('cash_category_id')
            ->map(fn($items) => [
                'category' => $items->first()->category->name,
                'total' => $items->sum('amount'),
                'count' => $items->count(),
            ]);

        return Inertia::render('cash/report', [
            'balances' => $balances,
            'transactions' => $transactions,
            'incomeByCategory' => $incomeByCategory->values(),
            'expenseByCategory' => $expenseByCategory->values(),
            'filters' => [
                'month' => $month,
                'year' => $year,
            ],
        ]);
    }
}
