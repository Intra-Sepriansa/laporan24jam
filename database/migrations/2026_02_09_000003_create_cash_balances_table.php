<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->date('balance_date');
            $table->decimal('opening_balance', 15, 2)->default(0);
            $table->decimal('total_income', 15, 2)->default(0);
            $table->decimal('total_expense', 15, 2)->default(0);
            $table->decimal('closing_balance', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->unique(['store_id', 'balance_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_balances');
    }
};
