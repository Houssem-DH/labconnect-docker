<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Scientific_production;


class Book extends Model
{
    use HasFactory;
    protected $table = 'books';
    protected $fillable =
    [
        'scientific_production_id',
        'edition',
        'publishing_house',
        'isbn',
    ];

    public function scientific_production()
    {
        return $this->belongsTo(Scientific_production::class,'scientific_production_id','id');
    }
}
