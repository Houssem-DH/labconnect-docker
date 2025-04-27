<?php

namespace App\Http\Controllers\AdminF;

use App\Http\Controllers\Controller;
use App\Models\Career;
use App\Models\Download;
use App\Models\Faculty;
use App\Models\Lab;
use App\Models\Lab_member;
use App\Models\Link;
use App\Models\Management;
use App\Models\Professional_Experience;
use App\Models\Project_member;
use App\Models\Scientific_production_member;
use App\Models\Scientific_teaching_activitie;
use App\Models\team_member;
use App\Models\User;
use App\Models\User_Information;
use App\Models\Work;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class DirectorController extends Controller
{
    public function index()
    {
        $faculty = Faculty::with('establishment')->where('user_id', Auth::user()->id)->first();


        if ($faculty) {
            $users = DB::table('users')
                ->join('labs', 'users.id', '=', 'labs.director_id')
                ->where('labs.establishment', $faculty->establishment->name)
                ->where('labs.faculty_institute_id', $faculty->id)
                ->where('users.director', 1)
                ->orderBy('users.created_at', 'desc')
                ->paginate(10);
        } else {
            $users = new LengthAwarePaginator([], 0, 10, 1, ['path' => LengthAwarePaginator::resolveCurrentPath()]);
        }

        $allUsers = User::orderBy('first_name')->orderBy('last_name')->get();



        return Inertia::render(
            'AdminF/Users/index',
            [
                'users' => $users,
                'allUsers' => $allUsers,
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
            ]
        );
    }




}
