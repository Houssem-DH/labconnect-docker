<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Management;
use App\Models\Career;
use App\Models\Professional_experience;
use App\Models\Work;
use App\Models\Faculty;
use App\Models\Scientific_teaching_activitie;
use App\Models\Scientific_production_member;
use App\Models\Project_global_report;
use App\Models\Phd_thesis;
use App\Models\Teaching;
use App\Models\Master_thesis;
use App\Models\Scientific_event;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'is_super_admin',
        'is_admin',
        'director',
        'is_banned',
        'avatar',
        'first_name',
        'last_name',
        'background_photo',
        'phone_number',
        'description',
        'file',
        'links',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];


    public function team_member()
    {
        return $this->hasMany(team_member::class,'id','user_id');
    }



    public function faculty()
    {
        return $this->hasMany(Faculty::class,'id','user_id');
    }

    public function labs()
    {
        return $this->hasMany(Lab::class, 'director_id');
    }


    public function project_global_report()
    {
        return $this->hasMany(Project_global_report::class,'id','project_leader_id');
    }

    public function supervisor()
    {
        return $this->hasMany(Phd_thesis::class,'id','supervisor_id');
    }

    public function co_supervisor()
    {
        return $this->hasMany(Phd_thesis::class,'id','co_supervisor_id');
    }

    public function phd_student()
    {
        return $this->hasMany(Phd_thesis::class,'id','phd_student_id');
    }


    public function teaching()
    {
        return $this->hasMany(Teaching::class,'id','user_id');
    }

    public function master_thesis()
    {
        return $this->hasMany(Master_thesis::class,'id','user_id');
    }

    public function scientific_event()
    {
        return $this->hasMany(Scientific_event::class,'id','user_id');
    }

    public function service_request()
    {
        return $this->hasMany(Service_request::class,'id','user_id');
    }

    public function exist_service_request()
    {
        return $this->hasMany(Exist_service_request::class,'id','user_id');
    }

    public function material_reservation()
    {
        return $this->hasMany(Material_reservation::class,'id','user_id');
    }


}
