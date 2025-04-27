<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Team;
use App\Models\User;

class team_member extends Model
{
    use HasFactory;
    protected $table = 'team_members';
    protected $fillable =
    [
        'user_id',
        'team_id',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class,'team_id','id');
    }
    

    public function user()
    {
        return $this->belongsTo(User::class,'user_id','id');
    }
}
