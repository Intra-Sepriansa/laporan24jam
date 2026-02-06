<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('month_year'); // e.g. "FEBRUARY 2026"
            $table->integer('shift')->default(3);
            $table->decimal('target_spd', 15, 2)->default(0);
            $table->integer('target_std')->default(0);
            $table->decimal('target_apc', 15, 2)->default(0);
            $table->decimal('target_pulsa', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['store_id', 'month_year', 'shift']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('targets');
    }
};
