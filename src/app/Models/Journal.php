<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Scientific_production;


class Journal extends Model
{
    use HasFactory;
    protected $table = 'journals';
    protected $fillable =
    [
        'scientific_production_id',
        'volume',
        'number',
        'Pages',
        'doi',
    ];

    public function scientific_production()
    {
        return $this->belongsTo(Scientific_production::class,'scientific_production_id','id');
    }
}
