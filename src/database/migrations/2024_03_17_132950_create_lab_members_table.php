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
        Schema::create('lab_members', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->bigInteger('lab_id');
            $table->string('research_domain')->nullable();
            $table->string('research_specialty')->nullable();
            $table->string('member_type')->nullable();
            $table->tinyInteger('project_leader')->default('0');
            $table->tinyInteger('team_leader')->default('0');
            $table->tinyInteger('member')->default('0');
            $table->tinyInteger('phd_student')->default('0');
            $table->string('member_rank')->nullable();;
            $table->tinyInteger('support_stuff')->default('0');
            $table->tinyInteger('researcher')->default('0');
            $table->tinyInteger('researcher_establishment')->default('0');
            $table->tinyInteger('researcher_out_establishment')->default('0');
            $table->tinyInteger('associated_researcher')->default('0');
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
        Schema::dropIfExists('lab_members');
    }
};
