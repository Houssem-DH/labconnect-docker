<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exist_service_request extends Model
{
    use HasFactory;
    protected $table = 'exist_service_requests';
    protected $fillable =
        [
            'user_id',
            'service_id',
            'applicant_type ',
            'applicant_tlp',
            'applicant_adresse_email',
            'request_date',
            'required_by',
            'comments',
            'request',
            'lab_service_accept_answer',
            'lab_answer_duration',
            'lab_answer_requirements',
            'lab_comments',
            'contact_status',
            'contact_message',
        ];

        public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id', 'id');
    }


}
