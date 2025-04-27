<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class External_member extends Model
{
    use HasFactory;
    protected $table = 'external_members';
    protected $fillable =
    [
        'user_id',
        'project_id',
        'phd_thesis_id',
        'is_project_member',
        'is_supervisor',
        'is_co_supervisor',
    ];



    public function project()
    {
        return $this->belongsTo(Project::class,'project_id','id');
    }

    public function user()
    {
        return $this->belongsTo(User::class,'user_id','id');
    }


}
