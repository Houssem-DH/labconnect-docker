<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Team;


class Phd_thesis extends Model
{
    use HasFactory;
    protected $table = 'phd_theses';
    protected $fillable =
    [
        'team_id',
        'phd_student_id',
        'supervisor_id',
        'co_supervisor_id',
        'phd_students_id',
        'invitations', // Ajout pour le stockage des invitations
        'invitations_abstract',
        'thesis_title',
        'keywords',
        'references',
        'abstract',
        'advancement_state_percentage',
        'advancement_state_description',
        'supervisor_remarks',
        'co_supervisor_remarks',

    ];

    public function supervisor()
    {
        return $this->belongsTo(User::class,'supervisor_id','id');
    }

    public function student()
    {
        return $this->belongsTo(User::class,'phd_student_id','id');
    }

    public function co_supervisor()
    {
        return $this->belongsTo(User::class,'co_supervisor_id','id');
    }

    

    public function team()
    {
        return $this->belongsTo(Team::class,'team_id','id');
    }

    protected $casts = [
        'phd_students_id' => 'array',
        'invitations' => 'array', // Cast JSON to array
    ];

    public function invitePhd_thesis($phd_st_Id)
    {
        $invitations = $this->invitations ?? [];
        $invitations[$phd_st_Id] = 'pending';
        $this->invitations = $invitations;
        $this->save();
    }

    public function respondToPhdthesisInvitation($phd_st_Id, $status)
    {
        $invitations = $this->invitations ?? [];
        if (isset($invitations[$phd_st_Id])) {
            $invitations[$phd_st_Id] = $status;
            $this->invitations = $invitations;

            if ($status === 'accepted') {
                $labsIdArray = $this->phd_students_id ?? [];
                $labsIdArray[] = "$phd_st_Id";
                $this->phd_students_id = $labsIdArray;
            }

            $this->save();
        }
    }
}
