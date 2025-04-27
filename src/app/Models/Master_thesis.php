<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;


class Master_thesis extends Model
{
    use HasFactory;
    protected $table = 'master_theses';
    protected $fillable =
    [
        'user_id',
        'title',
        'speciality',
        'student',
        'year',
    ];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id','id');
    }
}
