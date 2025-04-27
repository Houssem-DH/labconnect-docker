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
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->json('labs_id')->nullable();
            $table->string('applicant_type');
            $table->string('title');
            $table->longtext('description');
            $table->bigInteger('applicant_tlp');
            $table->string('applicant_adresse_email')->nullable();
            $table->dateTime('request_date');
            $table->dateTime('required_by');
            $table->longText('comments')->nullable();
            $table->json('request');
            $table->json('lab_answer_title')->nullable();
            $table->json('lab_service_accept_answer')->nullable();
            $table->json('lab_answer_price')->nullable();
            $table->json('lab_answer_duration')->nullable();
            $table->json('lab_answer_requirements')->nullable();
            $table->json('lab_comments')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};
