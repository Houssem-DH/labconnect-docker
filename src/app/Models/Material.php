<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Lab;


class Material extends Model
{
    use HasFactory;
    protected $table = 'materials';
    protected $fillable =
    [
        'lab_id',
        'name',
        'use_case',
        'reference',
        'description',
        'picture',
        'availability',
        'reservation_price',
        'reservation_type',

    ];

    public function lab()
    {
        return $this->belongsTo(Lab::class,'lab_id','id');
    }

    public function material_reservation()
    {
        return $this->hasMany(Material_reservation::class,'id','material_id');
    }
   

}
