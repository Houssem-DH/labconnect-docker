<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Faculty;


class Establishment extends Model
{
    use HasFactory;

    protected $table = 'establishments';
    protected $fillable =
    [
        'type',
        'name',
        'wilaya',

    ];

    public function faculty()
    {
        return $this->hasMany(Faculty::class,'id','establishment_id');
    }

}
