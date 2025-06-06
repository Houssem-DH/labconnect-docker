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
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->bigInteger('lab_id');
            $table->bigInteger('team_leader_id')->nullable();
            $table->string('acronym_team_name')->nullable();
            $table->string('Keywords')->nullable();
            $table->longText('theme_description')->nullable();
            $table->json('sub_research_area')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }

    
};
