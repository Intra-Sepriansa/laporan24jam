<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shift_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('shift')->default(3);
            $table->date('checklist_date');
            $table->string('title')->default('Checklist Shift');
            $table->json('items'); // [{name: string, checked: boolean}]
            $table->boolean('is_template')->default(false);
            $table->integer('completed_count')->default(0);
            $table->integer('total_count')->default(0);
            $table->timestamps();

            $table->index(['store_id', 'checklist_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shift_checklists');
    }
};
