<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Under_research_theme;
use App\Models\Team_member;
use App\Models\Lab;
use App\Models\Phd_thesis;


class Team extends Model
{
    use HasFactory;
    protected $table = 'teams';
    protected $fillable =
    [
        'title',
        'lab_id',
        'team_leader_id',
        'acronym_team_name',
        'Keywords',
        'theme_description',
        'sub_research_area',
    ];

    public function lab()
    {
        return $this->belongsTo(Lab::class,'lab_id','id');
    }

    public function team_member()
    {
        return $this->hasMany(Team_member::class,'id','team_id');
    }


    public function phd_thesis()
    {
        return $this->hasMany(Phd_thesis::class,'id','team_id');
    }


}
