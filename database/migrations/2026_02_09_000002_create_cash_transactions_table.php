<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('cash_category_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['income', 'expense']);
            $table->decimal('amount', 15, 2);
            $table->date('transaction_date');
            $table->string('reference_number')->unique();
            $table->text('description');
            $table->text('notes')->nullable();
            $table->string('receipt_photo')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved');
            $table->foreignId('approved_by')->nullable()->constrained('employees');
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_notes')->nullable();
            $table->timestamps();
            
            $table->index(['store_id', 'transaction_date']);
            $table->index(['type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_transactions');
    }
};
