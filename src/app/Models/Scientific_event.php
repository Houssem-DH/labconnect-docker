<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;


class Scientific_event extends Model
{
    use HasFactory;
    protected $table = 'scientific_events';
    protected $fillable =
    [
        'user_id',
        'title',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id','id');
    }
}
