<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shift_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('report_date')->comment('Tanggal laporan');
            $table->integer('shift')->default(3)->comment('Shift (1, 2, atau 3)');
            $table->string('month_year', 20)->comment('Bulan dan tahun laporan (contoh: FEBRUARY 2026)');
            $table->timestamps();
            
            $table->index(['store_id', 'report_date', 'shift']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shift_reports');
    }
};
