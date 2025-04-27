<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Scientific_production;


class Conference extends Model
{
    use HasFactory;
    protected $table = 'conferences';
    protected $fillable =
    [
        'scientific_production_id',
        'conference_location',
        'Pages',
        'doi',
    ];

    public function scientific_production()
    {
        return $this->belongsTo(Scientific_production::class,'scientific_production_id','id');
    }
}
