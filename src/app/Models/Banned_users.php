<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;


class Banned_users extends Model
{
    use HasFactory;
    protected $table = 'banned_users';
    protected $fillable =
        [
            'user_id',
            'reason',

        ];


        public function user()
    {
        return $this->belongsTo(User::class,'user_id','id');
    }
}
