<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Domain;


class Speciality extends Model
{
    use HasFactory;
    protected $table = 'specialities';
    protected $fillable =
    [
        'domain_id',
        'name',
    ];

    public function domain()
    {
        return $this->belongsTo(Domain::class,'domain_id','id');
    }
}
