<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $table = 'chats';
    protected $fillable = ['user_one_id', 'user_two_id', "users_id", "project_id", "phd_thesis_id"];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function userOne()
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function phdThesis()
    {
        return $this->belongsTo(Phd_thesis::class, 'phd_thesis_id');
    }

    public function userTwo()
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'chats', 'id', 'id') // Personnalisez les colonnes si nécessaire
            ->withPivot('users_id'); // Si vous avez des données supplémentaires à inclure
    }
}
