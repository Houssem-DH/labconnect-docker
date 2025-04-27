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
        Schema::create('project_global_reports', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('project_leader_id');
            $table->bigInteger('project_id');
            $table->longText('advancement_state')->nullable();
            $table->json('scientific_production')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_global_reports');
    }
};
