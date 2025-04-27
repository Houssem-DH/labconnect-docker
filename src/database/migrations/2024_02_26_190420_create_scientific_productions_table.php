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
        Schema::create('scientific_productions', function (Blueprint $table) {
            $table->id();
            $table->json('user_id_author');
            $table->json('external_author')->nullable();
            $table->string('type');
            $table->string('title');
            $table->longText('description')->nullable();
            $table->string('url')->nullable();
            $table->string('file')->nullable();
            $table->date('year_publication');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scientific_productions');
    }

    
};
