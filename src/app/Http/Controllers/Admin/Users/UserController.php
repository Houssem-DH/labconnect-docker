<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\Banned_users;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
use App\Models\Career;
use App\Models\Download;
use App\Models\Lab_member;
use App\Models\Link;
use App\Models\Management;
use App\Models\Professional_Experience;
use App\Models\Project_member;
use App\Models\Scientific_production_member;
use App\Models\Scientific_teaching_activitie;
use App\Models\Team_member;
use App\Models\User_information;
use App\Models\Work;
use App\Models\Lab;
use App\Models\Faculty;
use App\Models\Team;
use App\Models\Project;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;




class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->paginate(50); // Paginate with 10 users per page
        $admins = User::where('is_admin', 1)->get();
        $faculties = Faculty::get();


        return Inertia::render(
            'Admin/Users/index',
            [
                'users' => $users,
                'admins' => $admins,
                'faculties' => $faculties,
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),

            ]

        );
    }



    public function role(Request $request, $id)
    {



        // Validate the request data
        $data = $request->validate([

            'isLabDirector' => ['sometimes', 'boolean'], // Validate if present, should be boolean (true/false)
            'isAdmin' => ['sometimes', 'boolean'], // Validate if present, should be boolean (true/false)
        ]);




        $user = User::find($id);







        if ($user) {
            if (Auth::user()->is_super_admin == 1) {
                $user->director = $data['isLabDirector'] == TRUE ? '1' : '0';
                $user->is_admin = $data['isAdmin'] == TRUE ? '1' : '0';

            }




            $user->update();
            return Redirect::route('dashboard.users');
        } else {
            return Redirect::route('dashboard.users');
        }
    }










    public function delete_user(Request $request, $id)
    {
        $user = user::find($id);


        $career = Career::where('user_id', $id)->get();
        $download = Download::where('user_id', $id)->get();
        $lab_member = Lab_member::where('user_id', $id)->get();
        $link = Link::where('user_id', $id)->get();
        $management = Management::where('user_id', $id)->get();
        $professional_experience = Professional_Experience::where('user_id', $id)->get();
        $project_member = Project_member::where('user_id', $id)->get();
        $scientific_production_member = Scientific_production_member::where('user_id', $id)->get();
        $scientific_teaching_activitie = Scientific_teaching_activitie::where('user_id', $id)->get();
        $team_member = Team_member::where('user_id', $id)->get();
        $work = Work::where('user_id', $id)->get();


        if ($user) {
            if (Auth::user()->is_super_admin == 1 && $user->is_admin == 1) {

                $faculty = Faculty::where('user_id', $id)->first();

                //admin exist

                $request->validate([
                    'user_id' => ['nullable', 'numeric'],

                ]);

                if ($request->user_id) {

                    $faculty->user_id = $request->user_id;
                    $faculty->update();

                } else {


                    $request->validate([

                        'username' => 'required|string|max: 255',
                        'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                        'password' => ['required', 'confirmed', Rules\Password::defaults()],
                    ]);
                    $user_admin = User::create([
                        'username' => $request->username,
                        'email' => $request->email,
                        'password' => Hash::make($request->password),
                        'is_admin' => 1,
                    ]);

                    $faculty->user_id = $user_admin->id;
                    $faculty->update();

                }

                //no admin







                foreach ($career as $item) {
                    $item->delete();
                }

                foreach ($download as $item) {
                    if ($item->file) {

                        // Get the full path to the avatar file
                        $file = $item->file;

                        // Check if the file exists in storage before attempting to delete it
                        if ($file) {
                            // Delete the avatar file
                            Storage::disk('public')->delete($file);
                        }
                    }
                    $item->delete();
                }

                foreach ($lab_member as $item) {
                    $item->delete();
                }

                foreach ($link as $item) {
                    $item->delete();
                }

                foreach ($management as $item) {
                    $item->delete();
                }

                foreach ($professional_experience as $item) {
                    $item->delete();
                }

                foreach ($project_member as $item) {
                    $item->delete();
                }

                foreach ($scientific_production_member as $item) {
                    $item->delete();
                }

                foreach ($scientific_teaching_activitie as $item) {
                    $item->delete();
                }

                foreach ($team_member as $item) {
                    $item->delete();
                }


                foreach ($work as $item) {
                    if ($item->picture) {

                        // Get the full path to the avatar file
                        $picture = $item->picture;

                        // Check if the file exists in storage before attempting to delete it
                        if ($picture) {
                            // Delete the avatar file
                            Storage::disk('public')->delete($picture);
                        }
                    }
                    $item->delete();
                }

                if ($user->picture) {

                    // Get the full path to the avatar file
                    $picture = $user->picture;

                    // Check if the file exists in storage before attempting to delete it
                    if ($picture) {
                        // Delete the avatar file
                        Storage::disk('public')->delete($picture);
                    }
                }

                $user->delete();


                return Redirect::route('dashboard.users');
            } else {
                if ((Auth::user()->is_admin == 1) && ($user->is_admin == 0)) {
                    $lab_member = Lab_member::where('user_id', $id)->where('team_leader', 1)->get();
                    $team = Team::where('team_leader_id', $id)->first();
                    $project = Project::where('project_leader_id', $id)->first();

                    if (!$team && !$project) {


                        if ($user->director == 1) {

                            $lab = Lab::where('director_id', $user->id)->first();

                            $request->validate([
                                'user_id' => ['nullable', 'numeric'],

                            ]);

                            if ($request->user_id) {


                                $lab->director_id = $request->user_id;
                                $lab->update();

                            } else {


                                $request->validate([

                                    'username' => 'required|string|max: 255',
                                    'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                                    'password' => ['required', 'confirmed', Rules\Password::defaults()],
                                ]);

                                $user_director = User::create([
                                    'username' => $request->username,
                                    'email' => $request->email,
                                    'password' => Hash::make($request->password),
                                    'director' => 1,
                                ]);

                                $lab->director_id = $user_director->id;
                                $lab->update();


                            }











                        }


                        foreach ($career as $item) {
                            $item->delete();
                        }

                        foreach ($download as $item) {
                            if ($item->file) {

                                // Get the full path to the avatar file
                                $file = $item->file;

                                // Check if the file exists in storage before attempting to delete it
                                if ($file) {
                                    // Delete the avatar file
                                    Storage::disk('public')->delete($file);
                                }
                            }
                            $item->delete();
                        }

                        foreach ($lab_member as $item) {
                            $item->delete();
                        }

                        foreach ($link as $item) {
                            $item->delete();
                        }

                        foreach ($management as $item) {
                            $item->delete();
                        }

                        foreach ($professional_experience as $item) {
                            $item->delete();
                        }

                        foreach ($project_member as $item) {
                            $item->delete();
                        }

                        foreach ($scientific_production_member as $item) {
                            $item->delete();
                        }

                        foreach ($scientific_teaching_activitie as $item) {
                            $item->delete();
                        }

                        foreach ($team_member as $item) {
                            $item->delete();
                        }

                        foreach ($work as $item) {
                            if ($item->picture) {

                                // Get the full path to the avatar file
                                $picture = $item->picture;

                                // Check if the file exists in storage before attempting to delete it
                                if ($picture) {
                                    // Delete the avatar file
                                    Storage::disk('public')->delete($picture);
                                }
                            }
                            $item->delete();
                        }

                        if ($user->picture) {

                            // Get the full path to the avatar file
                            $picture = $user->picture;

                            // Check if the file exists in storage before attempting to delete it
                            if ($picture) {
                                // Delete the avatar file
                                Storage::disk('public')->delete($picture);
                            }
                        }

                        $user->delete();


                    } else {
                        return Redirect::route('admin.dashboard.directors')->with('message', 'this user is a team/project leader , director of labs should replace it before deleting');
                    }
                    return Redirect::route('admin.dashboard.directors');
                } else {
                    return Redirect::route('home');
                }
            }
        } else {
            return Redirect::route('home');
        }
    }

    public function ban_user(Request $request, $id)
    {

        // Validate the request data
        $data = $request->validate([
            'reason' => ['required'],



        ]);
        $user = User::find($id);

        if ($user) {
            if (Auth::user()->is_super_admin == 1 && ($user->is_admin == 1 || $user->is_admin == 0)) {

                $user->is_banned = 1;
                $user->update();

                $banned_users = Banned_users::create([
                    'user_id' => $id,
                    'reason' => $data['reason'],

                ]);
                $banned_users->save();

                return Redirect::route('dashboard.users');
            } else {
                if (Auth::user()->is_admin == 1 && ($user->is_admin == 0)) {
                    $user->is_banned = 1;
                    $user->update();
                    $banned_users = Banned_users::create([
                        'user_id' => $id,
                        'reason' => $data['reason'],

                    ]);
                    return Redirect::route('dashboard.users');
                } else {
                    return Redirect::route('dashboard.users');
                }
            }
        } else {
            return Redirect::route('dashboard.users');
        }
    }





}
