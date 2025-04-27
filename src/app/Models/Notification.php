<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
    protected $table = 'notifications';
    protected $fillable =
        [
            'user_id',
            'lab_id',
            'phd_student_id',
            'service_id',
            'service_request_id',
            'exist_service_request_id',
            'material_reservation_id',
            'type',
            'message',
            'read',
        ];
}
