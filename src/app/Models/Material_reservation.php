<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material_reservation extends Model
{
    use HasFactory;
    protected $table = 'material_reservations';
    protected $fillable =
        [
            'user_id',
            'material_id',
            'chargily_payment_id',
            'reservation_type',
            'applicant_type',
            'reservation_date',
            'start_date',
            'end_date',
            'quantity',
            'reason',
            'tlp',
            'adresse_email',
            'status',
            'lab_answer',
            'lab_answer_price',
            'usage_notes ',
            'rejection_reason',
            'return_date',
            'fine ',
        ];

    public function material()
    {
        return $this->belongsTo(Material::class, 'material_id', 'id');
    }
    
}
