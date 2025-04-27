<?php

namespace App\Http\Controllers\Admin\Lab;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\Lab_member;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Lab_ask;
use App\Models\Lab;
use App\Models\Team;
use App\Models\Project;
use App\Models\Material;
use App\Models\Scientific_activity;
use App\Models\Team_member;
use App\Models\Phd_thesis;
use App\Models\Scientific_production;
use App\Models\Project_member;
use App\Models\Scientific_event;
use App\Models\Master_thesis;
use App\Models\Teaching;
use App\Models\External_member;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;



class LabsController extends Controller
{
    public function lab_insert(Request $request)
    {

        if (Auth::check()) {
            if (Auth::user()->is_admin == 1 ) {

                $request->validate([
                    'first_name' => 'required|string|max:255',
                    'last_name' => 'required|string|max:255',
                    'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                    'password' => ['required', 'confirmed', Rules\Password::defaults()],
                    'lab_type' => 'required|string',
                ]);


                $user = User::create([

                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'director' => 1,
                ]);


                $faculty = Faculty::with('establishment')->with('user')->where('user_id', Auth::user()->id)->first();


                Log::info($faculty);

                $lab = new Lab;

                $lab->director_id = $user->id;
                $lab->establishment = $faculty->establishment->name;
                $lab->faculty_institute_id = $faculty->id;

                $lab->type = $request->lab_type;

                $lab->save();


                $lab_member = new Lab_member;
                $lab_member->lab_id = $lab->id;
                $lab_member->user_id = $user->id;
                $lab_member->project_leader = '1';
                $lab_member->team_leader = '1';
                $lab_member->member = '1';
                $lab_member->phd_student = '1';
                $lab_member->is_project_member = '1';
                $lab_member->is_supervisor = '1';
                $lab_member->is_co_supervisor = '1';
                $lab_member->member_rank = 'Prof.'; // Save member rank to the database
                $lab_member->save();








                return Redirect::route('admin.dashboard.directors');
            } else {

                return Redirect::route('admin.dashboard.directors');
            }
        } else {

            return Redirect::route('home');
        }

    }


    public function mise_lab_director(request $request, $id)
    {

        if (Auth::check()) {
            $lab = Lab::find($id);
            $faculty_lab = $lab->faculty_institute;
            $faculty = Faculty::where('user_id', Auth::user()->id)->first();
            $lab_member = Lab_member::with('user')->where('lab_id', $lab->id)->get();
            
            


            if (Auth::user()->is_admin == 1  && $faculty_lab==$faculty->name ) {



                // Validate the request data
                $data = $request->validate([
                    'director_id' => ['required', 'numeric'],
                ]);



                $lab->director_id = $data['director_id'];
                $lab->update();



                return Redirect::route('/')->with('message', 'director Updated Succesfully');
            } else {
                return Redirect::route('/')->with('message', 'You can not update the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function sup_lab($id)
    {


        if (Auth::check()) {

            $lab = Lab::find($id);
            $faculty = Faculty::where('id', $lab->faculty_institute_id)->first();
            $team = Team::where('lab_id', $lab->id)->get();
            $project = Project::where('lab_id', $lab->id)->get();
            $lab_member = Lab_member::where('lab_id', $lab->id)->get();
            $material = Material::where('lab_id', $lab->id)->get();
            $scientific_activity = Scientific_activity::where('lab_id', $lab->id)->get();


            if ((Auth::user()->is_super_admin == 1 )|| ( Auth::user()->is_admin == 1 && $faculty->user_id == Auth::user()->id)) {


                foreach ($material as $item) {
                    $item->delete();
                }

                foreach ($team as $item) {


                    $team_membeer = Team_member::where('team_id', $item->id)->get();
                    $phd_thesis = Phd_thesis::where('team_id', $item->id)->get();

                    foreach ($team_membeer as $item) {
                        $item->delete();
                    }


                    foreach ($phd_thesis as $item) {
                        $item->delete();
                    }


                    $item->delete();
                }

                foreach ($project as $item) {


                    $project_membeer = Project_member::where('project_id', $item->id)->get();

                    foreach ($project_membeer as $item) {
                        $item->delete();
                    }
                    $item->delete();
                }




                foreach ($scientific_activity as $item) {
                    $item->delete();
                }

                foreach ($lab_member as $item) {

                    $user = User::where('id', $item->user_id)->first();

                    //hna kayn hwayj nzidohom apres 

                    $project_member = Project_member::where('user_id', $user->id)->get();
                    $team_member = Team_member::where('user_id', $user->id)->first();
                    $scientific_event = Scientific_event::where('user_id', $user->id)->get();
                    $master_thesis = Master_thesis::where('user_id', $user->id)->get();
                    $teaching = Teaching::where('user_id', $user->id)->get();



                    $lb_id = $item->lab_id;
                    $lb = Lab::where('id', $item->lab_id)->first();

                    $external_member = External_member::where('user_id', $user->id)->first();



                    $teaam = Team::where('team_leader_id', $user->id)->where('lab_id', $lb->id)->first();
                    $prooject = Project::where('project_leader_id', $user->id)->where('lab_id', $lb->id)->first();

                    if (!$teaam && !$prooject) {

                        if ($team_member) {
                            $team_member->delete();
                        }




                        foreach ($project_member as $item) {
                            $item->delete();
                        }

                        foreach ($scientific_event as $item) {
                            $item->delete();
                        }

                        foreach ($master_thesis as $item) {
                            $item->delete();
                        }

                        foreach ($teaching as $item) {
                            $item->delete();
                        }



                        $scientific_productions = Scientific_production::whereJsonContains('user_id_author', $user->id)->get();
                        foreach ($scientific_productions as $production) {
                            $user_ids = json_decode($production->user_id_author, true);
                            $user_ids = array_diff($user_ids, [$user->id]); // Supprimer l'ID de l'utilisateur
                            $production->user_id_author = json_encode(array_values($user_ids)); // Réencoder en JSON
                            $production->save();
                        }


                        $item->delete();

                        if (!$external_member) {

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

                        }
                    }

                    $item->delete();
                }



                if ($lab->picture) {

                    // Get the full path to the avatar file
                    $picture = $lab->picture;

                    //   Check if the file exists in storage before attempting to delete it
                    if ($picture) {
                        // Delete the avatar file
                        Storage::disk('public')->delete($picture);
                    }
                }
                $lab->delete();
                return Redirect::route('home')->with('message', 'Lab deleted Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'You can not delete this lab');
            }
        } else {
            return Redirect::route('home');
        }

    }

}
