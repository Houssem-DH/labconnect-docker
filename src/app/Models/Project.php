<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Lab;
use App\Models\Project_member;
use App\Models\User;
use App\Models\External_member;
use App\Models\Project_personal_report;



class Project extends Model
{
    use HasFactory;
    protected $table = 'projects';
    protected $fillable =
        [
            'project_leader_id',
            'lab_id',
            'labs_id',
            'invitations', // Ajout pour le stockage des invitations
            'invitations_abstract',
            'type',
            'code',
            'title',
            'problematic',
            'reference',
            'objective',
            'expected_results',
            'keywords',
            'methodology',
            'material',
            'project_display',
        ];


    public function user()
    {
        return $this->belongsTo(User::class, 'project_leader_id', 'id');
    }
    public function lab()
    {
        return $this->belongsTo(Lab::class, 'lab_id', 'id');
    }



    public function project_member()
    {
        return $this->hasMany(Project_member::class, 'project_id', 'id');
    }

    public function external_member()
    {
        return $this->hasMany(External_member::class, 'id', 'project_id');
    }

    public function project_personal_report()
    {
        return $this->hasMany(Project_personal_report::class, 'id', 'project_id');
    }


    protected $casts = [
        'labs_id' => 'array',
        'invitations' => 'array', // Cast JSON to array
    ];

    public function inviteLab($labId)
    {
        $invitations = $this->invitations ?? [];
        $invitations[$labId] = 'pending';
        $this->invitations = $invitations;
        $this->save();
    }

    public function respondToInvitation($labId, $status)
    {
        $invitations = $this->invitations ?? [];
        if (isset($invitations[$labId])) {
            $invitations[$labId] = $status;
            $this->invitations = $invitations;

            if ($status === 'accepted') {
                $labsIdArray = $this->labs_id ?? [];
                $labsIdArray[] = "$labId";
                $this->labs_id = $labsIdArray;
            }

            $this->save();
        }
    }

}
