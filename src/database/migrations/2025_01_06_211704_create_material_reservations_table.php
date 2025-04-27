<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('material_reservations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->bigInteger('material_id');
            $table->string('reservation_type');
            $table->string('applicant_type');
            $table->dateTime('reservation_date');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->unsignedInteger('quantity');
            $table->longtext('reason');
            $table->bigInteger('tlp');
            $table->string('adresse_email')->nullable();
            $table->enum('status', [
                'pending_payment',
                'pending_approval',
                'accepted',
                'rejected',
                'payment_failed',
                'canceled'
            ])->default('pending_payment');
            $table->longtext('lab_answer')->nullable();
            $table->longtext('usage_notes')->nullable();
            $table->longtext('rejection_reason')->nullable();
            $table->dateTime('return_date')->nullable();

            $table->unsignedInteger('fine')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_reservations');
    }
};
