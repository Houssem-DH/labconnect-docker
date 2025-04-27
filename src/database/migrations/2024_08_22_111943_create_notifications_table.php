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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable();
            $table->bigInteger('lab_id')->nullable();
            $table->bigInteger('phd_student_id')->nullable();
            $table->bigInteger('service_id')->nullable();
            $table->bigInteger('service_request_id')->nullable();
            $table->bigInteger('exist_service_request_id')->nullable();
            $table->bigInteger('material_reservation_id')->nullable();
            $table->string('type');
            $table->string('message');
            $table->boolean('read')->default(false); // Pour marquer les notifications comme lues/non lues
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
