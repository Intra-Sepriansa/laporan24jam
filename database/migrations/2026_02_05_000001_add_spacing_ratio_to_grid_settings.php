<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('grid_settings', function (Blueprint $table) {
            $table->integer('spacing')->default(4)->after('layout');
            $table->string('ratio')->default('1:1')->after('spacing');
        });
    }

    public function down(): void
    {
        Schema::table('grid_settings', function (Blueprint $table) {
            $table->dropColumn(['spacing', 'ratio']);
        });
    }
};
