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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('project_leader_id');
            $table->bigInteger('lab_id')->nullable();
            $table->json('labs_id')->nullable();
            $table->json('invitations')->nullable(); // Colonne pour stocker les invitations
            $table->longText('invitations_abstract')->nullable();
            $table->string('type')->nullable();
            $table->string('code')->nullable();
            $table->string('title');
            $table->longText('problematic')->nullable();
            $table->longText('reference')->nullable();
            $table->longText('objective')->nullable();
            $table->json('expected_results')->nullable();
            $table->string('keywords')->nullable();
            $table->longText('methodology')->nullable();
            $table->json('material')->nullable();
            $table->tinyInteger('project_display')->default('0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
