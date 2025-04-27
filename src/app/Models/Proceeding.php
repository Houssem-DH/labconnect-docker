<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Scientific_production;


class Proceeding extends Model
{
    use HasFactory;
    protected $table = 'proceedings';
    protected $fillable =
    [
        'scientific_production_id',
        'volume',
        'editors',
        'publishing_house',
        'Pages',
        'doi',
    ];
    
    public function scientific_production()
    {
        return $this->belongsTo(Scientific_production::class,'scientific_production_id','id');
    }
}
