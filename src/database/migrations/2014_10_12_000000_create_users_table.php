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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->tinyInteger('is_super_admin')->default('0');
            $table->tinyInteger('is_admin')->default('0');
            $table->tinyInteger('director')->default('0');
            $table->tinyInteger('is_banned')->default('0');
            $table->string('avatar')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('background_photo')->nullable();
            $table->bigInteger('phone_number')->nullable();
            $table->longText('description')->nullable();
            $table->json('file')->nullable();
            $table->json('links')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */


    public function down(): void
    {
        Schema::dropIfExists('users');
    }

};
