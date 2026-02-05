<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('grid_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->string('layout')->default('2x3');
            $table->timestamps();
            $table->unique('store_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grid_settings');
    }
};
