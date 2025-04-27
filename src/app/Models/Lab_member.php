<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Lab;


class Lab_member extends Model
{
    use HasFactory;
    protected $table = 'lab_members';
    protected $fillable =
    [
        'user_id',
        'lab_id',
        'research_domain',
        'research_specialty',
        'member_type',
        'project_leader',
        'team_leader',
        'member',
        'phd_student',
        'member_rank',
        'support_stuff',
        'researcher',
        'researcher_establishment',
        'researcher_out_establishment',
        'associated_researcher',
        'is_project_member',
        'is_supervisor',
        'is_co_supervisor',

    ];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id','id');
    }

    public function team_member()
    {
        return $this->belongsTo(team_member::class,'user_id','user_id');
    }

    public function lab()
    {
        return $this->belongsTo(Lab::class,'lab_id','id');
    }

}
