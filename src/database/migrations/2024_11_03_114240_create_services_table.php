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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('lab_id');
            $table->string('title');
            $table->longtext('description');
            $table->bigInteger('price')->nullable();
            $table->string('category')->nullable();
            $table->string('Keywords')->nullable();
            $table->bigInteger('duration')->nullable();
            $table->longText('requirements')->nullable();
            $table->tinyInteger('availability')->default('0');
            $table->string('picture')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
