<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;use App\Models\Material;
use App\Models\Proceeding;
use App\Models\Journal;
use App\Models\Conference;
use App\Models\Chapter;
use App\Models\Book;
use App\Models\No_member_scientific_production;
use App\Models\Scientific_production_member;

class Scientific_production extends Model
{
    use HasFactory;
    protected $table = 'scientific_productions';
    protected $fillable =
    [
        'user_id_author',
        'external_author',
        'type',
        'title',
        'description',
        'url',
        'file',
        'year_publication',
    ];


    public function proceeding()
    {
        return $this->hasMany(Proceeding::class, 'scientific_production_id', 'id');
    }
    
    public function journal()
    {
        return $this->hasMany(Journal::class, 'scientific_production_id', 'id');
    }
    
    public function conference()
    {
        return $this->hasMany(Conference::class, 'scientific_production_id', 'id');
    }
    
    public function chapter()
    {
        return $this->hasMany(Chapter::class, 'scientific_production_id', 'id');
    }
    

    public function book()
{
    return $this->hasMany(Book::class, 'scientific_production_id', 'id');
}




}
