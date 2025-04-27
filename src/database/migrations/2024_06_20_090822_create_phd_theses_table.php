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
        Schema::create('phd_theses', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('team_id');
            $table->bigInteger('phd_student_id')->nullable();
            $table->bigInteger('supervisor_id');
            $table->bigInteger('co_supervisor_id')->nullable();
            $table->json('phd_students_id')->nullable();
            $table->json('invitations')->nullable(); // Colonne pour stocker les invitations
            $table->longText('invitations_abstract')->nullable();
            $table->string('thesis_title');
            $table->string('keywords')->nullable();
            $table->longText('references')->nullable();
            $table->longText('abstract')->nullable();
            $table->integer('advancement_state_percentage')->nullable();
            $table->longText('advancement_state_description')->nullable();
            $table->json('supervisor_remarks')->nullable();
            $table->json('co_supervisor_remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phd_theses');
    }
};
