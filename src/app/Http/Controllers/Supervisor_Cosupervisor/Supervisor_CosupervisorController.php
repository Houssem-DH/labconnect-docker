<?php

namespace App\Http\Controllers\Supervisor_Cosupervisor;

use App\Http\Controllers\Controller;
use App\Models\External_member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Phd_thesis;
use App\Models\Team;
use App\Models\Lab_member;
use App\Models\Lab;

use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Session;






class Supervisor_CosupervisorController extends Controller
{

    public function phd_thesis()
{
    if (!Auth::check()) {
        return Redirect::route('home');
    }

    $user = Auth::user();

    // Check if the user is an external supervisor or co-supervisor
    $external_member = External_member::where("user_id", $user->id)
        ->where(function ($query) {
            $query->where('is_supervisor', 1)
                ->orWhere('is_co_supervisor', 1);
        })
        ->first();

    if ($external_member) {
        // If external member, fetch supervised PhD theses
        $phd_thesis = Phd_thesis::where('supervisor_id', $user->id)
            ->with('team', 'supervisor', 'student', 'co_supervisor')
            ->get();

        return Inertia::render('SupervisorSpace/Home', [
            'phd_thesis' => $phd_thesis,
        ]);
    }

    // Check if the user is a lab member
    $lab_member = Lab_member::where('user_id', $user->id)->first();
    if (!$lab_member) {
        return Redirect::route('home')->with('message', 'You are not part of any lab.');
    }

    // Fetch lab and related details
    $lab = Lab::find($lab_member->lab_id);
    if (!$lab) {
        return Redirect::route('home')->with('message', 'Lab not found.');
    }

    $number_teams = Team::where('lab_id', $lab->id)->count();
    $number_lab_members = Lab_member::where('lab_id', $lab->id)->count();
    $number_researchers = Lab_member::where('lab_id', $lab->id)->where('researcher', 1)->count();
    $researchers_establishment = Lab_member::where('lab_id', $lab->id)->where('researcher_establishment', 1)->count();
    $researchers_out_establishment = Lab_member::where('lab_id', $lab->id)->where('researcher_out_establishment', 1)->count();
    $associated_researchers = Lab_member::where('lab_id', $lab->id)->where('associated_researcher', 1)->count();
    $number_support_stuff = Lab_member::where('lab_id', $lab->id)->where('support_stuff', 1)->count();

    $phd_thesis = Phd_thesis::where('supervisor_id', $user->id)
        ->with('team', 'supervisor', 'student', 'co_supervisor')
        ->get();

    $recentLabMembers = Lab_member::where('lab_id', $lab->id)
        ->latest()
        ->take(3)
        ->with('user')
        ->get();

    $labs = Lab::all();
    $lab_members = Lab_member::where('lab_id', $lab->id)
        ->with('user')
        ->orderBy('created_at', 'desc')
        ->get();
    $lab_members_all = Lab_member::with('user', 'lab')->get();

    $userRole = Session::get('user_role'); // Get session variable

    return Inertia::render('SupervisorSpace/Home', [
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
        'number_support_stuff' => $number_support_stuff,
    ]);
}


public function co_phd_thesis()
{
    if (!Auth::check()) {
        return Redirect::route('home');
    }

    $user = Auth::user();

    // Check if the user is an external member and a co-supervisor
    $external_member = External_member::where('user_id', $user->id)
        ->where(function ($query) {
            $query->where('is_supervisor', 1)
                ->orWhere('is_co_supervisor', 1);
        })
        ->first();

    if ($external_member) {
        // Fetch PhD theses for external co-supervisor
        $phd_thesis = Phd_thesis::where('co_supervisor_id', $user->id)
            ->with('team', 'supervisor', 'student', 'co_supervisor')
            ->get();

        return Inertia::render('CoSupervisorSpace/Home', [
            'phd_thesis' => $phd_thesis,
            'isExternal' => true, // Pass a flag to distinguish between lab and external members
        ]);
    }

    // Check if the user is a lab member
    $lab_member = Lab_member::where('user_id', $user->id)->first();
    if (!$lab_member) {
        return Redirect::route('home')->with('message', 'You are not part of any lab.');
    }

    // Fetch lab and related details
    $lab = Lab::find($lab_member->lab_id);
    if (!$lab) {
        return Redirect::route('home')->with('message', 'Lab not found.');
    }

    // Fetch PhD theses where the user is a co-supervisor
    $phd_thesis = Phd_thesis::where('co_supervisor_id', $user->id)
        ->with('team', 'supervisor', 'student', 'co_supervisor')
        ->get();

    // Collect lab stats
    $number_teams = Team::where('lab_id', $lab->id)->count();
    $number_lab_members = Lab_member::where('lab_id', $lab->id)->count();
    $number_researchers = Lab_member::where('lab_id', $lab->id)->where('researcher', 1)->count();
    $researchers_establishment = Lab_member::where('lab_id', $lab->id)->where('researcher_establishment', 1)->count();
    $researchers_out_establishment = Lab_member::where('lab_id', $lab->id)->where('researcher_out_establishment', 1)->count();
    $associated_researchers = Lab_member::where('lab_id', $lab->id)->where('associated_researcher', 1)->count();
    $number_support_stuff = Lab_member::where('lab_id', $lab->id)->where('support_stuff', 1)->count();

    // Fetch other lab data
    $recentLabMembers = Lab_member::where('lab_id', $lab->id)
        ->latest()
        ->take(3)
        ->with('user')
        ->get();

    $labs = Lab::all();
    $lab_members = Lab_member::where('lab_id', $lab->id)
        ->with('user')
        ->orderBy('created_at', 'desc')
        ->get();
    $lab_members_all = Lab_member::with('user', 'lab')->get();

    $userRole = Session::get('user_role'); // Get session variable
    $lab_director = User::find($lab->director_id); // Fetch lab director details

    return Inertia::render('CoSupervisorSpace/Home', [
        'lab' => $lab,
        'recentLabMembers' => $recentLabMembers,
        'user' => $lab_director,
        'phd_thesis' => $phd_thesis,
        'isExternal' => false, // Distinguish between lab and external members
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
        'number_support_stuff' => $number_support_stuff,
    ]);
}



    public function phd_thesis_index($id)
    {


        if (Auth::check()) {


            $phd_thesis = Phd_thesis::where('id', $id)->first();
            $supervisor = User::where('id', $phd_thesis->supervisor_id)->first();
            $cosupervisor = User::where('id', $phd_thesis->co_supervisor_id)->first();



            if (Auth::user()->id == $supervisor->id || Auth::user()->id == $cosupervisor->id) {



                return Inertia::render('SupervisorSpace/Home', [
                    'phd_thesis' => $phd_thesis,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);
            } else {
                return Redirect::route('/')->with('message', 'you are not a supervisor / cosupervisor of this phd thesis');
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
            $supervisor = User::where('id', $phd_thesis->supervisor_id)->first();
            $cosupervisor = User::where('id', $phd_thesis->co_supervisor_id)->first();


            if (Auth::user()->id == $supervisor->id || Auth::user()->id == $cosupervisor->id) {


                // Validate the request data
                $data = $request->validate([
                    'thesis_title' => ['required', 'string'],
                    'keywords' => ['nullable', 'string', 'max:255'],
                    'references' => ['nullable', 'string'],
                    'abstract' => ['nullable', 'string'],
                    'advancement_state_percentage' => ['nullable', 'integer'],
                    'advancement_state_description' => ['nullable', 'string'],
                ]);



                $phd_thesis->thesis_title = $data['thesis_title'];
                $phd_thesis->keywords = $data['keywords'];
                $phd_thesis->references = $data['references'];
                $phd_thesis->abstract = $data['abstract'];
                $phd_thesis->advancement_state_percentage = $data['advancement_state_percentage'];
                $phd_thesis->advancement_state_description = $data['advancement_state_description'];
                $phd_thesis->update();

                return Redirect::route('supervisor.space.home')->with('message', 'thesis updated Succesfully');


            } else {
                return Redirect::route('home')->with('message', 'you are not the supervisor/cosupervisor of this thesis ');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function co_phd_thesis_update(Request $request, $id)
    {

        if (Auth::check()) {
            $phd_thesis = Phd_thesis::where('id', $id)->first();

            $team = Team::where('id', $phd_thesis->team_id)->first();
            $supervisor = User::where('id', $phd_thesis->supervisor_id)->first();
            $cosupervisor = User::where('id', $phd_thesis->co_supervisor_id)->first();


            if (Auth::user()->id == $supervisor->id || Auth::user()->id == $cosupervisor->id) {


                // Validate the request data
                $data = $request->validate([
                    'thesis_title' => ['required', 'string'],
                    'keywords' => ['nullable', 'string', 'max:255'],
                    'references' => ['nullable', 'string'],
                    'abstract' => ['nullable', 'string'],
                    'advancement_state_percentage' => ['nullable', 'integer'],
                    'advancement_state_description' => ['nullable', 'string'],
                ]);



                $phd_thesis->thesis_title = $data['thesis_title'];
                $phd_thesis->keywords = $data['keywords'];
                $phd_thesis->references = $data['references'];
                $phd_thesis->abstract = $data['abstract'];
                $phd_thesis->advancement_state_percentage = $data['advancement_state_percentage'];
                $phd_thesis->advancement_state_description = $data['advancement_state_description'];
                $phd_thesis->update();

                return Redirect::route('co.supervisor.space.home')->with('message', 'thesis updated Succesfully');


            } else {
                return Redirect::route('home')->with('message', 'you are not the supervisor/cosupervisor of this thesis ');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function phd_thesis_remarks_update(Request $request, $id)
    {

        if (Auth::check()) {
            $phd_thesis = Phd_thesis::where('id', $id)->first();

            $team = Team::where('id', $phd_thesis->team_id)->first();
            $supervisor = User::where('id', $phd_thesis->supervisor_id)->first();
            $cosupervisor = User::where('id', $phd_thesis->co_supervisor_id)->first();


            if (Auth::user()->id == $supervisor->id || Auth::user()->id == $cosupervisor->id) {


                if (Auth::user()->id == $supervisor->id) {
                    // Validate the request data
                    $data = $request->validate([
                        'supervisor_remarks' => ['nullable', 'array'], // Attend un tableau
                        'supervisor_remarks.*' => ['string'], // Chaque élément du tableau doit être une chaîne
                    ]);


                    $phd_thesis->supervisor_remarks = json_encode($data['supervisor_remarks']);


                    $phd_thesis->update();
                    return Redirect::route('supervisor.space.home')->with('message', 'remarks updated Succesfully');
                }

                if (Auth::user()->id == $cosupervisor->id) {
                    // Validate the request data
                    $data = $request->validate([
                        'co_supervisor_remarks' => ['nullable', 'array'], // Attend un tableau
                        'co_supervisor_remarks.*' => ['string'], // Chaque élément du tableau doit être une chaîne
                    ]);


                    $phd_thesis->co_supervisor_remarks = json_encode($data['co_supervisor_remarks']);

                    $phd_thesis->update();
                    return Redirect::route('co.supervisor.space.home')->with('message', 'remarks updated Succesfully');
                }





            } else {
                return Redirect::route('home')->with('message', 'you are not the supervisor/cosupervisor of this thesis ');
            }

        } else {
            return Redirect::route('home');
        }

    }

}
