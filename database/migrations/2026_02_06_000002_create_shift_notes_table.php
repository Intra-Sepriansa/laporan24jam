<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shift_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('shift')->default(3);
            $table->date('note_date');
            $table->string('type')->default('general'); // general, handover, incident, reminder
            $table->string('title');
            $table->text('content');
            $table->string('priority')->default('normal'); // low, normal, high, urgent
            $table->boolean('is_resolved')->default(false);
            $table->timestamps();

            $table->index(['store_id', 'note_date']);
            $table->index(['store_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shift_notes');
    }
};
