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
        Schema::create('labs', function (Blueprint $table) {
            $table->id();
            $table->string('establishment')->nullable();
            $table->bigInteger('faculty_institute_id')->nullable();
            $table->string('department')->nullable();
            $table->string('title')->nullable();
            $table->string('acronym_lab_name')->nullable();
            $table->bigInteger('director_id');
            $table->json('domain')->nullable();
            $table->json('speciality')->nullable();
            $table->string('type')->nullable();
            $table->string('name_firstname_director')->nullable();
            $table->biginteger('n_ordered')->nullable();
            $table->date('creation_date')->nullable();
            $table->date('date_appointment')->nullable();
            $table->string('previous_director')->nullable();
            $table->string('e_adresse')->nullable();
            $table->string('website')->nullable();
            $table->bigInteger('tlp')->nullable();
            $table->string('localisation')->nullable();
            $table->string('picture')->nullable();
            $table->longtext('presentation')->nullable();
            $table->longtext('research_objectives')->nullable();
            $table->longtext('Keywords')->nullable();
            $table->json('maps')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('labs');
    }
    
};
