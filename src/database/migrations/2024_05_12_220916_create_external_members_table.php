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
        Schema::create('external_members', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->json('project_id')->nullable();
            $table->json('phd_thesis_id')->nullable();
            $table->tinyInteger('is_project_member')->default('0');
            $table->tinyInteger('is_supervisor')->default('0');
            $table->tinyInteger('is_co_supervisor')->default('0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('external_members');
    }
};
