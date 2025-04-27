<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Scientific_production;


class Chapter extends Model
{
    use HasFactory;
    protected $table = 'chapters';
    protected $fillable =
    [
        'scientific_production_id',
        'editors',
        'edition',
        'publishing_house',
        'country',
        'Pages',
        'isbn',
    ];

    public function scientific_production()
    {
        return $this->belongsTo(Scientific_production::class,'scientific_production_id','id');
    }
}
