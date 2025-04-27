<?php

namespace App\Http\Controllers\Phd_student;

use App\Http\Controllers\Controller;
use App\Models\Lab;
use App\Models\Material;
use App\Models\Project;
use App\Models\Scientific_production;
use App\Models\Team;
use App\Models\team_member;
use App\Models\Under_research_theme;
use App\Models\User;
use App\Models\Faculty;

use App\Models\Phd_thesis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use App\Models\Lab_member;
use Carbon\Carbon;
use App\Models\Notification;
use App\Models\Establishment;
use App\Models\Project_member;
use App\Models\Domain;
use App\Models\External_member;
use Illuminate\Support\Facades\Log;
use Session;



class Phd_studentController extends Controller
{


    
    public function home()
    {


        if (Auth::check()) {


            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();



            $lab = Lab::where("id", $lab_member->lab_id)->first();

            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if ($lab) {


                $number_teams = Team::where('lab_id', $lab->id)->count();
                $number_lab_members = Lab_member::where('lab_id', $lab->id)->count();
                $number_researchers = Lab_member::where('lab_id', $lab->id)->where('researcher', 1)->count();
                $researchers_establishment = Lab_member::where('lab_id', $lab->id)->where('researcher_establishment', 1)->count();
                $researchers_out_establishment = Lab_member::where('lab_id', $lab->id)->where('researcher_out_establishment', 1)->count();
                $associated_researchers = Lab_member::where('lab_id', $lab->id)->where('associated_researcher', 1)->count();
                $number_support_stuff = Lab_member::where('lab_id', $lab->id)->where('support_stuff', 1)->count();
                $user = User::where("id", $lab->director_id)->first();


                $teams = Team::where('id', $lab->id)->get();
                $recentLabMembers = Lab_member::where('lab_id', $lab->id)
                    ->latest() // Orders by the 'created_at' column in descending order
                    ->take(3)  // Limits the results to the last 4 members
                    ->with('user')
                    ->get();




                $faculty = Faculty::with('establishment')->where('id', $lab->faculty_institute_id)->first();

                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('PhdStudentSpace/Home', [
                    'lab' => $lab,
                    'recentLabMembers' => $recentLabMembers,
                    'user' => $user,

                    'userRole' => $userRole,
                    'number_teams' => $number_teams,
                    'number_lab_members' => $number_lab_members,
                    'number_researchers' => $number_researchers,
                    'researchers_establishment' => $researchers_establishment,
                    'researchers_out_establishment' => $researchers_out_establishment,
                    'associated_researchers' => $associated_researchers,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'lab_members_all' => $lab_members_all,

                    'teams' => $teams,
                    'faculty' => $faculty,



                    'number_support_stuff' => $number_support_stuff,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }



    }


    public function members()
    {



        if (Auth::check()) {

            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();



            $lab = Lab::where("id", $lab_member->lab_id)->first();

            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if ($lab) {

                $userRole = Session::get('user_role'); // Get session variable
                return Inertia::render('PhdStudentSpace/Members', [
                    'lab' => $lab,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'userRole' => $userRole,
                    'lab_members_all' => $lab_members_all,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);
            } else {
                return Redirect::route('home')->with('message', 'access denied');
            }
        } else {
            return Redirect::route('home');
        }



    }


    public function teams()
    {


        if (Auth::check()) {


            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();



            $lab = Lab::where("id", $lab_member->lab_id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if ($lab) {
                $teams = Team::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();





                // Fetch team members for each team
                foreach ($teams as $team) {
                    $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();



                }
                $userRole = Session::get('user_role'); // Get session variable
                return Inertia::render('PhdStudentSpace/Teams', [
                    'lab' => $lab,
                    'teams' => $teams,
                    'userRole' => $userRole,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'lab_members_all' => $lab_members_all,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);
            } else {
                return Redirect::route('home')->with('message', 'access denied');
            }
        } else {
            return Redirect::route('home');
        }



    }


    public function materials()
    {


        if (Auth::check()) {


            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();



            $lab = Lab::where("id", $lab_member->lab_id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if ($lab) {
                $teams = Team::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $materials = Material::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();





                // Fetch team members for each team
                foreach ($teams as $team) {
                    $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();



                }
                $userRole = Session::get('user_role'); // Get session variable
                return Inertia::render('PhdStudentSpace/Materials', [
                    'lab' => $lab,
                    'teams' => $teams,
                    'materials' => $materials,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'userRole' => $userRole,
                    'lab_members_all' => $lab_members_all,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);
            } else {
                return Redirect::route('home')->with('message', 'access denied');
            }
        } else {
            return Redirect::route('home');
        }



    }


    public function phd_thesis()
    {


        if (Auth::check()) {


            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();



            $lab = Lab::where("id", $lab_member->lab_id)->first();

            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if ($lab) {


                $number_teams = Team::where('lab_id', $lab->id)->count();
                $number_lab_members = Lab_member::where('lab_id', $lab->id)->count();
                $number_researchers = Lab_member::where('lab_id', $lab->id)->where('researcher', 1)->count();
                $researchers_establishment = Lab_member::where('lab_id', $lab->id)->where('researcher_establishment', 1)->count();
                $researchers_out_establishment = Lab_member::where('lab_id', $lab->id)->where('researcher_out_establishment', 1)->count();
                $associated_researchers = Lab_member::where('lab_id', $lab->id)->where('associated_researcher', 1)->count();
                $number_support_stuff = Lab_member::where('lab_id', $lab->id)->where('support_stuff', 1)->count();
                $user = User::where("id", $lab->director_id)->first();
                $phd_thesis = Phd_thesis::where('phd_student_id', Auth::user()->id)->with('team', 'supervisor', 'student', 'co_supervisor')->get();


                $teams = Team::where('id', $lab->id)->get();
                $recentLabMembers = Lab_member::where('lab_id', $lab->id)
                    ->latest() // Orders by the 'created_at' column in descending order
                    ->take(3)  // Limits the results to the last 4 members
                    ->with('user')
                    ->get();






                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('PhdStudentSpace/PhdThesis', [
                    'lab' => $lab,
                    'recentLabMembers' => $recentLabMembers,
                    'user' => $user,
                    'phd_thesis' => $phd_thesis,

                    'userRole' => $userRole,
                    'number_teams' => $number_teams,
                    'number_lab_members' => $number_lab_members,
                    'number_researchers' => $number_researchers,
                    'researchers_establishment' => $researchers_establishment,
                    'researchers_out_establishment' => $researchers_out_establishment,
                    'associated_researchers' => $associated_researchers,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'lab_members_all' => $lab_members_all,

                    'teams' => $teams,



                    'number_support_stuff' => $number_support_stuff,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }



    }





    public function phd_thesis_update(Request $request, $id)
    {

        if (Auth::check()) {
            $phd_thesis = Phd_thesis::where('id', $id)->first();

            $team = Team::where('id', $phd_thesis->team_id)->first();
            $user = User::where('id', $phd_thesis->phd_student_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if (Auth::user()->id == $user->id && $labm->phd_student == 1) {


                // Validate the request data
                $data = $request->validate([
                    'thesis_title' => ['required', 'string'],
                    'keywords' => ['nullable', 'string', 'max:255'],
                    'references' => ['nullable', 'string'],
                    'abstract' => ['nullable', 'string'],
                ]);



                $phd_thesis->thesis_title = $data['thesis_title'];
                $phd_thesis->keywords = $data['keywords'];
                $phd_thesis->references = $data['references'];
                $phd_thesis->abstract = $data['abstract'];
                $phd_thesis->update();

                return Redirect::route('phd.student.space.phd.thesis')->with('message', 'thesis updated Succesfully');


            } else {
                return Redirect::route('home')->with('message', 'you are not the phd student of this thesis ');
            }

        } else {
            return Redirect::route('home');
        }

    }

}
