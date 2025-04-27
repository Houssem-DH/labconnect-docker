<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    protected $table = 'services';
    protected $fillable =
    [
        'lab_id',
        'title',
        'description ',
        'price',
        'category',
        'Keywords',
        'duration',
        'requirements',
        'availability',
        'picture',
    ];

    public function lab()
    {
        return $this->belongsTo(Lab::class,'lab_id','id');
    }

    public function exist_service_request()
    {
        return $this->hasMany(Exist_service_request::class,'id','service_id');
    }

}
