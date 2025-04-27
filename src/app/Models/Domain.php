<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Speciality;


class Domain extends Model
{
    use HasFactory;

    protected $table = 'domains';
    protected $fillable =
    [
        'name',
    ];

    public function speciality()
    {
        return $this->hasMany(Speciality::class,'id','domain_id');
    }


}
