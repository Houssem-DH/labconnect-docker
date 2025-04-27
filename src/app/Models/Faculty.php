<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Establishment;
use App\Models\User;


class Faculty extends Model
{
    use HasFactory;

    protected $table = 'faculties';
    protected $fillable =
    [
        'user_id',
        'establishment_id',
        'name',
    ];

    public function establishment()
    {
        return $this->belongsTo(Establishment::class,'establishment_id','id');
    }

    public function user()
    {
        return $this->belongsTo(User::class,'user_id','id');
    }

    public function lab()
    {
        return $this->hasMany(Lab::class, 'id', 'faculty_institute_id');
    }
}
