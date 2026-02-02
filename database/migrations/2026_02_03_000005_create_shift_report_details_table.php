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
        Schema::create('shift_report_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shift_report_id')->constrained('shift_reports')->onDelete('cascade');
            $table->integer('day_number')->comment('Nomor hari dalam bulan (1-31)');
            $table->date('transaction_date')->comment('Tanggal transaksi');
            $table->decimal('spd', 15, 2)->default(0)->comment('SPD - Sales Per Day');
            $table->integer('std')->default(0)->comment('STD - Struk Transaksi per Day');
            $table->decimal('apc', 15, 2)->default(0)->comment('APC - Average Per Customer');
            $table->decimal('pulsa', 15, 2)->default(0)->comment('Penjualan Pulsa');
            $table->text('notes')->nullable()->comment('Catatan tambahan');
            $table->timestamps();
            
            $table->index(['shift_report_id', 'transaction_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shift_report_details');
    }
};
