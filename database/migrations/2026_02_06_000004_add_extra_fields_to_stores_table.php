<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('address')->nullable()->after('area');
            $table->string('phone')->nullable()->after('address');
            $table->string('photo_path')->nullable()->after('phone');
            $table->text('description')->nullable()->after('photo_path');
        });
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn(['address', 'phone', 'photo_path', 'description']);
        });
    }
};
