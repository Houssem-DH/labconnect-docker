<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Project;
use App\Models\Project_personal_report;

class Project_member extends Model
{
    use HasFactory;
    protected $table = 'project_members';
    protected $fillable =
    [
        'user_id',
        'project_id',
    ];



    public function user()
    {
        return $this->belongsTo(User::class,'user_id','id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class,'project_id','id');
    }

    public function project_personal_report()
    {
        return $this->hasMany(Project_personal_report::class,'id','project_member_id');
    }
}
