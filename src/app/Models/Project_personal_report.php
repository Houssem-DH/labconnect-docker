<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Project_member;
use App\Models\Project;


class Project_personal_report extends Model
{
    use HasFactory;
    protected $table = 'project_personal_reports';
    protected $fillable =
    [
        'project_member_id',
        'project_id',
        'advancement_state',
        'scientific_production',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class,'project_id','id');
    }

    public function user()
    {
        return $this->belongsTo(User::class,'project_member_id','id');
    }


   

    
}
