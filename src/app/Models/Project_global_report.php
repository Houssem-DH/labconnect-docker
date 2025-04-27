<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Project;


class Project_global_report extends Model
{
    use HasFactory;
    protected $table = 'project_global_reports';
    protected $fillable =
    [
        'project_leader_id',
        'project_id',
        'advancement_state',
        'scientific_production',
    ];

    public function user()
    {
        return $this->belongsTo(User::class,'project_leader_id','id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class,'project_id','id');
    }
}
