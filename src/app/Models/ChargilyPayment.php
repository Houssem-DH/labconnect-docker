<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChargilyPayment extends Model
{
    use HasFactory;
    protected $fillable = ["user_id", "status", "currency", "amount", "material_reservation_id"];

    public function materialReservation()
    {
        return $this->belongsTo(Material_reservation::class, 'material_reservation_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
