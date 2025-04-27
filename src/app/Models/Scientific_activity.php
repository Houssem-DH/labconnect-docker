<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Lab;


class Scientific_activity extends Model
{
    use HasFactory;
    protected $table = 'scientific_activities';
    protected $fillable =
    [
        'lab_id',
        'title',
        'description',
    ];

    public function lab()
    {
        return $this->belongsTo(Lab::class,'lab_id','id');
    }

}
