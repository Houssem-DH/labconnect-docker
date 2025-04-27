<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;


class Teaching extends Model
{
    use HasFactory;
    protected $table = 'teachings';
    protected $fillable =
    [
        'user_id',
        'module',
        'speciality',
        'level',
        'year',
    ];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id','id');
    }
}
