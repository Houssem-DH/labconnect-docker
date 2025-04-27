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
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('lab_id');
            $table->string('name');
            $table->longText('use_case')->nullable();
            $table->string('reference')->nullable();
            $table->longText('description')->nullable();
            $table->string('picture')->nullable();
            $table->tinyInteger('availability')->default('1');
            $table->bigInteger('reservation_price')->nullable();
            $table->string('reservation_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }

    
};
