<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Material;
use App\Models\Team;
use App\Models\Lab_member;
use App\Models\Project;
use App\Models\Project_collab_request;
use App\Models\Scientific_activity;




class Lab extends Model
{
    use HasFactory;
    protected $table = 'labs';
    protected $fillable =
        [
            'establishment',
            'faculty_institute_id',
            'department',
            'title',
            'acronym_lab_name',
            'director_id',
            'domain',
            'speciality',
            'type',
            'name_firstname_director',
            'n_ordered',
            'creation_date',
            'date_appointment',
            'previous_director',
            'e_adresse',
            'website',
            'tlp',
            'localisation',
            'picture',
            'presentation',
            'research_objectives',
            'Keywords',
            'maps',
        ];


    public function material()
    {
        return $this->hasMany(Material::class, 'id', 'lab_id');
    }
    public function lab_members()
    {
        return $this->hasMany(Lab_member::class, 'id', 'lab_id');
    }

    public function team()
    {
        return $this->hasMany(Team::class, 'id', 'lab_id');
    }


    public function project()
    {
        return $this->hasMany(Project::class, 'id', 'lab_id');
    }


    public function scientific_avtivity()
    {
        return $this->hasMany(Scientific_activity::class, 'id', 'lab_id');
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class,'faculty_institute_id','id');
    }

    public function director()
    {
        return $this->belongsTo(User::class,'director_id','id');
    }

    public function service()
    {
        return $this->hasMany(Service::class, 'id', 'lab_id');
    }




}
