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
        Schema::create('exist_service_requests', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->bigInteger('service_id');
            $table->string('applicant_type');
            $table->bigInteger('applicant_tlp');
            $table->string('applicant_adresse_email')->nullable();
            $table->dateTime('request_date');
            $table->dateTime('required_by');
            $table->longText('comments')->nullable();
            $table->enum('request', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->string('lab_service_accept_answer')->nullable();
            $table->string('lab_answer_duration')->nullable();
            $table->string('lab_answer_requirements')->nullable();
            $table->longText('lab_comments')->nullable();
            $table->tinyInteger('contact_status')->default('0');
            $table->longText('contact_message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exist_service_requests');
    }
};
