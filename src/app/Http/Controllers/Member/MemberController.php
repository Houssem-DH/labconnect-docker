<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Lab;
use App\Models\Material;
use App\Models\Project;
use App\Models\Scientific_production;
use App\Models\Team;
use App\Models\team_member;
use App\Models\Domain;
use App\Models\Speciality;
use App\Models\Under_research_theme;
use App\Models\User;
use App\Models\Faculty;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use App\Models\Lab_member;
use App\Models\Teaching;
use App\Models\Master_thesis;
use App\Models\Scientific_event;
use App\Models\Journal;
use App\Models\Phd_thesis;
use App\Models\Proceeding;
use App\Models\Conference;
use App\Models\Chapter;
use App\Models\Book;
use App\Models\Scientific_production_member;
use App\Models\External_member;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;


use Session;



class MemberController extends Controller
{
    public function index()
    {

        if (Auth::check()) {
            $lab_member = Lab_member::where('user_id', Auth::user()->id)->where('member', 1)->first();
            if ($lab_member) {



                return Inertia::render(
                    'MemberSpace/index',
                    [
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),



                    ]

                );

            } else {
                return Redirect::route('home')->with('message', 'You are not a lab member');


            }

        } else {
            return Redirect::route('home');

        }



    }




    public function index2($id)
    {


        if (Auth::check()) {




            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();



            $lab = Lab::where("id", $lab_member->lab_id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
            $external_members = External_member::get();
            $isProductionMember = Scientific_production::where('id', $id)->first();


            if ($isProductionMember) {



                $productionDetails = Scientific_production::where('id', $id)->with('proceeding', 'journal', 'conference', 'chapter', 'book')->first();


                // Decode JSON strings to arrays, with proper null and type checking
                $authors_id = is_string($productionDetails->user_id_author)
                    ? json_decode($productionDetails->user_id_author, true)
                    : $productionDetails->user_id_author;



                // Ensure both variables are arrays
                $authors_id = is_array($authors_id) ? $authors_id : [];


                // Fetch members based on IDs
                $members = User::whereIn('id', $authors_id)

                    ->get();



                Log::info($members);




                return Inertia::render('MemberSpace/ManageProduction', [
                    'lab' => $lab,

                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'lab_members_all' => $lab_members_all,
                    'productionDetails' => $productionDetails,
                    'members' => $members,
                    'external_members' => $external_members,



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

                return Inertia::render('MemberSpace/Home', [
                    'lab' => $lab,
                    'recentLabMembers' => $recentLabMembers,
                    'user' => $user,
                    'faculty' => $faculty,

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
                return Inertia::render('MemberSpace/Members', [
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
                return Inertia::render('MemberSpace/Teams', [
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
                return Inertia::render('MemberSpace/Materials', [
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

    public function scientific_productions()
    {


        if (Auth::check()) {


            $scientificProductions = Scientific_production::whereJsonContains('user_id_author', (string) Auth::user()->id)->get();



            $userRole = Session::get('user_role'); // Get session variable



            return Inertia::render('MemberSpace/ScientificProduction', [
                'scientificProductions' => $scientificProductions,
                'userRole' => $userRole,

                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
            ]);

        } else {
            return Redirect::route('home');
        }



    }



    public function team_view($id)
    {


        if (Auth::check()) {


            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();



            $lab = Lab::where("id", $lab_member->lab_id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if ($lab) {
                $team = Team::where('id', $id)->first();
                $team_members = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();
                $scientificProductions = Scientific_production::whereHas('scientific_production_member', function ($query) use ($team_members) {
                    $query->whereIn('user_id', $team_members->pluck('user_id')->toArray());
                })->get();

                $projects = Project::whereHas('project_member', function ($query) use ($team_members) {
                    $query->whereIn('user_id', $team_members->pluck('user_id')->toArray());
                })->get();




                // Fetch team members for each team


                $userRole = Session::get('user_role'); // Get session variable
                return Inertia::render('MemberSpace/TeamView', [
                    'lab' => $lab,
                    'team' => $team,
                    'userRole' => $userRole,
                    'scientificProductions' => $scientificProductions,
                    'team_members' => $team_members,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'lab_members_all' => $lab_members_all,
                    'projects' => $projects,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);
            } else {
                return Redirect::route('home')->with('message', 'You are not a lab member in this lab');
            }
        } else {
            return Redirect::route('home');
        }








    }


    public function teaching_insert(Request $request, $id)
    {



        if (Auth::check()) {
            $user = User::findOrFail($id);
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {


                // Validate the request data
                $data = $request->validate([
                    'user_id' => ['required', 'integer'],
                    'module' => ['required', 'string', 'max:255'],
                    'domain_id' => ['nullable'],
                    'speciality_id' => ['nullable'],
                    'domain' => ['nullable', 'string'],
                    'speciality' => ['nullable', 'string'],
                    'level' => ['nullable', 'string', 'max:255'],
                    'year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')], // Ensuring the year is within a reasonable range

                ]);


                if ($data['domain'] && $data['speciality']) {
                    $domain = new Domain;
                    $domain->name = $data['domain'];
                    $domain->save();
                    $speciality = new Speciality;
                    $speciality->name = $data['speciality'];
                    $speciality->domain_id = $domain->id;
                    $speciality->save();
                } elseif (!$data['domain'] && $data['speciality']) {
                    $speciality = new Speciality;
                    $speciality->name = $data['speciality'];
                    $speciality->domain_id = $data['domain_id'];
                    $speciality->save();
                    $domain = Domain::where('id', $data['domain_id'])->first();
                } else {
                    $speciality = Speciality::where('id', $data['speciality_id'])->first();
                    $domain = Domain::where('id', $data['domain_id'])->first();
                }

                $teaching = new Teaching;


                $teaching->user_id = $id;
                $teaching->module = $data['module'];
                $teaching->speciality = $speciality->name;
                $teaching->level = $data['level'];
                $teaching->year = $data['year'];
                $teaching->save();
                return Redirect::route('/')->with('message', 'Added Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function teaching_update(Request $request, $id)
    {



        if (Auth::check()) {
            $teaching = Teaching::find($id);
            $user = User::where('id', $teaching->user_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {


                // Validate the request data
                $data = $request->validate([
                    'module' => ['required', 'string', 'max:255'],
                    'domain_id' => ['nullable'],
                    'speciality_id' => ['nullable'],
                    'domain' => ['nullable', 'string'],
                    'speciality' => ['nullable', 'string'],
                    'level' => ['nullable', 'string', 'max:255'],
                    'year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')], // Ensuring the year is within a reasonable range

                ]);

                if ($data['domain'] && $data['speciality']) {
                    $domain = new Domain;
                    $domain->name = $data['domain'];
                    $domain->save();
                    $speciality = new Speciality;
                    $speciality->name = $data['speciality'];
                    $speciality->domain_id = $domain->id;
                    $speciality->save();
                } elseif (!$data['domain'] && $data['speciality']) {
                    $speciality = new Speciality;
                    $speciality->name = $data['speciality'];
                    $speciality->domain_id = $data['domain_id'];
                    $speciality->save();
                    $domain = Domain::where('id', $data['domain_id'])->first();
                } else {
                    $speciality = Speciality::where('id', $data['speciality_id'])->first();
                    $domain = Domain::where('id', $data['domain_id'])->first();
                }

                $teaching->module = $data['module'];
                $teaching->speciality = $speciality->name;
                $teaching->level = $data['level'];
                $teaching->year = $data['year'];
                $teaching->update();
                return Redirect::route('/')->with('message', ' updated Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }



    public function teaching_delete(Request $request, $id)
    {



        if (Auth::check()) {
            $teaching = Teaching::find($id);
            $user = User::where('id', $teaching->user_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {



                $teaching->delete();


                return Redirect::route('/')->with('message', ' deleted Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }



    public function master_thesis_insert(Request $request, $id)
    {



        if (Auth::check()) {
            $user = User::findOrFail($id);
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {


                // Validate the request data
                $data = $request->validate([
                    'user_id' => ['required', 'integer'],
                    'title' => ['required', 'string'],
                    'domain_id' => ['nullable'],
                    'speciality_id' => ['nullable'],
                    'domain' => ['nullable', 'string'],
                    'speciality' => ['nullable', 'string'],
                    'student' => ['nullable', 'string', 'max:255'],
                    'year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')], // Ensuring the year is within a reasonable range

                ]);


                if ($data['domain'] && $data['speciality']) {
                    $domain = new Domain;
                    $domain->name = $data['domain'];
                    $domain->save();
                    $speciality = new Speciality;
                    $speciality->name = $data['speciality'];
                    $speciality->domain_id = $domain->id;
                    $speciality->save();
                } elseif (!$data['domain'] && $data['speciality']) {
                    $speciality = new Speciality;
                    $speciality->name = $data['speciality'];
                    $speciality->domain_id = $data['domain_id'];
                    $speciality->save();
                    $domain = Domain::where('id', $data['domain_id'])->first();
                } else {
                    $speciality = Speciality::where('id', $data['speciality_id'])->first();
                    $domain = Domain::where('id', $data['domain_id'])->first();
                }

                $master_thesis = new Master_thesis;


                $master_thesis->user_id = $id;
                $master_thesis->title = $data['title'];
                $master_thesis->speciality = $speciality->name;
                $master_thesis->student = $data['student'];
                $master_thesis->year = $data['year'];
                $master_thesis->save();
                return Redirect::route('/')->with('message', 'master thesis Added Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }



    public function master_thesis_update(Request $request, $id)
    {



        if (Auth::check()) {
            $master_thesis = Master_thesis::find($id);
            $user = User::where('id', $master_thesis->user_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {


                // Validate the request data
                $data = $request->validate([
                    'title' => ['required', 'string'],
                    'domain_id' => ['nullable'],
                    'speciality_id' => ['nullable'],
                    'domain' => ['nullable', 'string'],
                    'speciality' => ['nullable', 'string'],
                    'student' => ['nullable', 'string', 'max:255'],
                    'year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')], // Ensuring the year is within a reasonable range

                ]);

                if ($data['domain'] && $data['speciality']) {
                    $domain = new Domain;
                    $domain->name = $data['domain'];
                    $domain->save();
                    $speciality = new Speciality;
                    $speciality->name = $data['speciality'];
                    $speciality->domain_id = $domain->id;
                    $speciality->save();
                } elseif (!$data['domain'] && $data['speciality']) {
                    $speciality = new Speciality;
                    $speciality->name = $data['speciality'];
                    $speciality->domain_id = $data['domain_id'];
                    $speciality->save();
                    $domain = Domain::where('id', $data['domain_id'])->first();
                } else {
                    $speciality = Speciality::where('id', $data['speciality_id'])->first();
                    $domain = Domain::where('id', $data['domain_id'])->first();
                }

                $master_thesis->title = $data['title'];
                $master_thesis->speciality = $speciality->name;
                $master_thesis->student = $data['student'];
                $master_thesis->year = $data['year'];
                $master_thesis->update();
                return Redirect::route('/')->with('message', 'master thesis updated Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function master_thesis_delete(Request $request, $id)
    {



        if (Auth::check()) {
            $master_thesis = Master_thesis::find($id);
            $user = User::where('id', $master_thesis->user_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {



                $master_thesis->delete();


                return Redirect::route('/')->with('message', 'master thesis deleted Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function event_insert(Request $request, $id)
    {



        if (Auth::check()) {
            $user = User::findOrFail($id);
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {


                // Validate the request data
                $data = $request->validate([
                    'user_id' => ['required', 'integer'],
                    'title' => ['required', 'string'],
                    'description' => ['required', 'string'],
                ]);


                $scientific_event = new Scientific_event;


                $scientific_event->user_id = $id;
                $scientific_event->title = $data['title'];
                $scientific_event->description = $data['description'];
                $scientific_event->save();
                return Redirect::route('/')->with('message', 'scientific event Added Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }



    public function event_update(Request $request, $id)
    {



        if (Auth::check()) {
            $scientific_event = Scientific_event::find($id);
            $user = User::where('id', $scientific_event->user_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {


                // Validate the request data
                $data = $request->validate([
                    'title' => ['required', 'string'],
                    'description' => ['required', 'string'],
                ]);



                $scientific_event->title = $data['title'];
                $scientific_event->description = $data['description'];
                $scientific_event->update();
                return Redirect::route('/')->with('message', 'scientific event updated Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function event_delete(Request $request, $id)
    {



        if (Auth::check()) {
            $scientific_event = Scientific_event::find($id);
            $user = User::where('id', $scientific_event->user_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {



                $scientific_event->delete();


                return Redirect::route('/')->with('message', 'scientific event deleted Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }



    public function scientific_production_insert(Request $request, $id)
    {

        if (Auth::check()) {

            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();
            Log::info($lab_member);


            if ($lab_member) {


                // Validate the request data
                $data = $request->validate([
                    'type' => ['required', 'string', 'max:255'],
                    'title' => ['required', 'string'],
                    'description' => ['nullable', 'string'],
                    'url' => ['nullable', 'url', 'max:255'], // Assuming 'url' should be a valid URL
                    'file' => ['file', 'nullable'],
                    'year_publication' => ['required', 'date'],

                ]);


                $scientific_production = new Scientific_production;

                if ($request->hasFile('file')) {

                    $file = $request->file('file')->store("scientific production files/{$id}", 'public');
                    $scientific_production->file = $file;
                }

                $scientific_production->user_id_author = json_encode([$id]);

                $scientific_production->type = $data['type'];
                $scientific_production->title = $data['title'];
                $scientific_production->description = $data['description'];
                $scientific_production->url = $data['url'];
                $scientific_production->year_publication = $data['year_publication'];
                $scientific_production->save();


                if ($scientific_production->type == 'Journal') {

                    $data = $request->validate([
                        'volume' => ['nullable', 'numeric'],
                        'number' => ['nullable', 'numeric'], // Assuming 'url' should be a valid URL
                        'pages' => ['nullable', 'string', 'max:255'],
                        'doi' => ['nullable', 'string', 'max:255', Rule::unique('journals')],
                    ]);

                    $journal = new Journal;
                    $journal->scientific_production_id = $scientific_production->id;
                    $journal->volume = $data['volume'];
                    $journal->number = $data['number'];
                    $journal->Pages = $data['pages'];
                    $journal->doi = $data['doi'];
                    $journal->save();



                }
                if ($scientific_production->type == 'Proceeding') {

                    $data = $request->validate([
                        'volume' => ['nullable', 'numeric'],
                        'editors' => ['nullable', 'string', 'max:255'],
                        'publishing_house' => ['nullable', 'string', 'max:255'],
                        'pages' => ['nullable', 'string', 'max:255'],
                        'doi' => ['nullable', 'string', 'max:255', Rule::unique('proceedings')],
                    ]);


                    $proceeding = new Proceeding;
                    $proceeding->scientific_production_id = $scientific_production->id;
                    $proceeding->volume = $data['volume'];
                    $proceeding->editors = $data['editors'];
                    $proceeding->publishing_house = $data['publishing_house'];
                    $proceeding->Pages = $data['pages'];
                    $proceeding->doi = $data['doi'];
                    $proceeding->save();



                }
                if ($scientific_production->type == 'Conference') {

                    $data = $request->validate([
                        'conference_location' => ['nullable', 'string'],
                        'pages' => ['nullable', 'string', 'max:255'],
                        'doi' => ['nullable', 'string', 'max:255', Rule::unique('conferences')],
                    ]);

                    $conference = new Conference;
                    $conference->scientific_production_id = $scientific_production->id;
                    $conference->conference_location = $data['conference_location'];
                    $conference->Pages = $data['pages'];
                    $conference->doi = $data['doi'];
                    $conference->save();




                }
                if ($scientific_production->type == 'Chapter') {

                    $data = $request->validate([
                        'editors' => ['nullable', 'string', 'max:255'],
                        'edition' => ['nullable', 'string', 'max:255'],
                        'publishing_house' => ['nullable', 'string', 'max:255'],
                        'country' => ['nullable', 'string', 'max:255'],
                        'pages' => ['nullable', 'string', 'max:255'],
                        'isbn' => ['nullable', 'string', 'max:255', Rule::unique('chapters')],
                    ]);

                    $chapter = new Chapter;
                    $chapter->scientific_production_id = $scientific_production->id;
                    $chapter->editors = $data['editors'];
                    $chapter->edition = $data['edition'];
                    $chapter->publishing_house = $data['publishing_house'];
                    $chapter->country = $data['country'];
                    $chapter->Pages = $data['pages'];
                    $chapter->isbn = $data['isbn'];
                    $chapter->save();

                }
                if ($scientific_production->type == 'Book') {
                    $data = $request->validate([
                        'edition' => ['nullable', 'string', 'max:255'],
                        'publishing_house' => ['nullable', 'string', 'max:255'],
                        'isbn' => ['nullable', 'string', 'max:255', Rule::unique('books')],
                    ]);

                    $book = new Book;
                    $book->scientific_production_id = $scientific_production->id;
                    $book->edition = $data['edition'];
                    $book->publishing_house = $data['publishing_house'];
                    $book->isbn = $data['isbn'];
                    $book->save();

                }
                if ($scientific_production->type == 'other_type') {

                }







                return Redirect::route('member.space.scientific.productions')->with('message', 'Scientific Production Added Succesfully');





            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }

        } else {
            return Redirect::route('home');
        }

    }




    public function scientific_production_member_insert(Request $request, $id)
    {
        if (Auth::check()) {

            $scientific_production = Scientific_production::find($id);
            $users = User::get();

            // Get the user IDs from the JSON column
            $user_ids = json_decode($scientific_production->user_id_author, true);

            if (in_array(Auth::user()->id, $user_ids)) {
                // Validate the form data
                $data = $request->validate([
                    'user_id' => ['nullable', 'integer'],
                    'first_name' => ['nullable', 'string', 'max:255'],
                    'last_name' => ['nullable', 'string', 'max:255'],
                ]);

                // Handle adding user ID
                if ($data['user_id']) {
                    if (in_array($data['user_id'], $user_ids)) {
                        return Redirect::back()->with('message', 'This user is already a member of this scientific production');
                    }

                    // Add new user ID to the JSON array
                    $existingUserIds = json_decode($scientific_production->user_id_author, true) ?? [];
                    $newUserIds = is_array($data['user_id']) ? $data['user_id'] : [$data['user_id']];
                    $existingUserIds = array_unique(array_merge($existingUserIds, $newUserIds));
                    $scientific_production->user_id_author = json_encode($existingUserIds);
                    $scientific_production->save();

                } else {
                    // Handle adding external authors (first_name and last_name)
                    if (!empty($data['first_name']) && !empty($data['last_name'])) {
                        $fullName = $data['first_name'] . ' ' . $data['last_name'];

                        // Retrieve the existing 'external_authors' JSON data
                        $existingExternalAuthors = json_decode($scientific_production->external_author, true) ?? [];

                        // Check if the author already exists
                        if (in_array($fullName, $existingExternalAuthors)) {
                            return Redirect::back()->with('message', 'This author is already listed in the external authors');
                        }

                        // Add the new author to the array
                        $existingExternalAuthors[] = $fullName;

                        // Encode the updated array back to JSON
                        $scientific_production->external_author = json_encode($existingExternalAuthors);
                        $scientific_production->save();
                    }
                }

                $scientific_production->update();

                return Redirect::route('member.team.scientific.production.manage', ['id' => $id])->with('message', 'Member added successfully');
            } else {
                return Redirect::route('member.team.scientific.production.manage', ['id' => $id])->with('message', 'You are not authorized to modify this scientific production');
            }

        } else {
            return Redirect::route('home');
        }
    }


    public function scientific_production_member_delete($id, $member_id)
    {

        if (Auth::check()) {

            $scientific_production = Scientific_production::find($id);


            $user_ids = json_decode($scientific_production->user_id_author, true);

            if (in_array(Auth::user()->id, $user_ids)) {
                // Vérifier si l'utilisateur à supprimer existe dans la liste des auteurs internes
                if (!in_array($member_id, $user_ids)) {
                    return Redirect::back()->with('message', 'This user is not a member of this scientific production');
                }

                // Supprimer l'ID du membre de la liste des auteurs internes
                $user_ids = array_diff($user_ids, [$member_id]);
                $scientific_production->user_id_author = json_encode(array_values($user_ids));

                // Mettre à jour la production scientifique
                $scientific_production->update();

                return Redirect::route('member.team.scientific.production.manage', ['id' => $id])->with('message', 'Author removed successfully');

            } else {
                return Redirect::route('/')->with('message', 'You are not authorized to modify this scientific production');
            }



        } else {
            return Redirect::route('home');
        }

    }


    public function scientific_production_external_author_delete($id, $external_author)
    {
        if (Auth::check()) {
            // Find the scientific production by ID
            $scientific_production = Scientific_production::find($id);

            // Decode the user_id_author JSON array
            $user_ids = json_decode($scientific_production->user_id_author, true);

            // Check if the authenticated user is allowed to modify the production
            if (in_array(Auth::user()->id, $user_ids)) {
                // Decode the external_author JSON array
                $external_authors = json_decode($scientific_production->external_author, true);

                // Normalize the input external author and authors in the array for comparison
                $normalized_external_author = strtolower(trim($external_author));
                $normalized_authors = array_map('strtolower', array_map('trim', $external_authors));

                Log::info($normalized_external_author);

                // Check if the external author exists in the normalized array
                if (!in_array($normalized_external_author, $normalized_authors)) {
                    return Redirect::back()->with('message', 'This author is not a member of this scientific production');
                }

                // Remove the external author from the list (compare without case sensitivity)
                $external_authors = array_filter($external_authors, function ($author) use ($normalized_external_author) {
                    return strtolower(trim($author)) !== $normalized_external_author;
                });

                // Update the external_author field
                $scientific_production->external_author = json_encode(array_values($external_authors));

                // Save the changes to the scientific production
                $scientific_production->update();

                return Redirect::route('team.leader.team.scientific.production.manage', ['id' => $id])->with('message', 'Author removed successfully');
            } else {
                return Redirect::route('/')->with('message', 'You are not authorized to modify this scientific production');
            }
        } else {
            return Redirect::route('home');
        }
    }




    public function mise_scientific_production(Request $request, $id)
    {


        if (Auth::check()) {
            $scientific_production = Scientific_production::find($id);

            $user_ids = json_decode($scientific_production->user_id_author, true);


            if (in_array((string) Auth::user()->id, $user_ids)) {

                // Validate the request data
                $data = $request->validate([
                    'title' => ['required', 'string'],
                    'description' => ['nullable', 'string'],
                    'url' => ['nullable', 'url', 'max:255'], // Assuming 'url' should be a valid URL

                    'year_publication' => ['required', 'date'],
                ]);

                if ($request->hasFile('file')) {

                    // Get the full path to the avatar file
                    $file = $scientific_production->file;

                    // Check if the file exists in storage before attempting to delete it
                    if ($file) {
                        // Delete the avatar file
                        Storage::disk('public')->delete($file);
                    }


                    // Store the uploaded avatar file in the storage disk

                    $file = $request->file('file')->store("scientific production files/{$id}", 'public');

                    // Update the user's avatar field with the path
                    $scientific_production->file = $file;
                }

                $scientific_production->title = $data['title'];
                $scientific_production->description = $data['description'];
                $scientific_production->url = $data['url'];
                $scientific_production->year_publication = $data['year_publication'];


                if ($scientific_production->type == 'Journal') {
                    $journal = Journal::where('scientific_production_id', $scientific_production->id)->first();

                    $data = $request->validate([
                        'volume' => ['nullable', 'numeric'],
                        'number' => ['nullable', 'numeric'], // Assuming 'url' should be a valid URL
                        'pages' => ['nullable', 'string', 'max:255'],
                        'doi' => ['nullable', 'string', 'max:255', Rule::unique('journals')->ignore($journal->id)],
                    ]);

                    $journal->volume = $data['volume'];
                    $journal->number = $data['number'];
                    $journal->Pages = $data['pages'];
                    $journal->doi = $data['doi'];
                    $journal->update();


                }
                if ($scientific_production->type == 'Proceeding') {
                    $proceeding = Proceeding::where('scientific_production_id', $scientific_production->id)->first();

                    $data = $request->validate([
                        'volume' => ['nullable', 'numeric'],
                        'editors' => ['nullable', 'string', 'max:255'],
                        'publishing_house' => ['nullable', 'string', 'max:255'],
                        'pages' => ['nullable', 'string', 'max:255'],
                        'doi' => ['nullable', 'string', 'max:255', Rule::unique('proceedings')->ignore($proceeding->id)],
                    ]);

                    $proceeding->volume = $data['volume'];
                    $proceeding->editors = $data['editors'];
                    $proceeding->publishing_house = $data['publishing_house'];
                    $proceeding->Pages = $data['pages'];
                    $proceeding->doi = $data['doi'];
                    $proceeding->update();



                }
                if ($scientific_production->type == 'Conference') {
                    $conference = Conference::where('scientific_production_id', $scientific_production->id)->first();

                    $data = $request->validate([
                        'conference_location' => ['nullable', 'string'],
                        'pages' => ['nullable', 'string', 'max:255'],
                        'doi' => ['nullable', 'string', 'max:255', Rule::unique('conferences')->ignore($conference->id)],
                    ]);

                    $conference->conference_location = $data['conference_location'];
                    $conference->Pages = $data['pages'];
                    $conference->doi = $data['doi'];
                    $conference->update();




                }
                if ($scientific_production->type == 'Chapter') {
                    $chapter = Chapter::where('scientific_production_id', $scientific_production->id)->first();

                    $data = $request->validate([
                        'editors' => ['nullable', 'string', 'max:255'],
                        'edition' => ['nullable', 'string', 'max:255'],
                        'publishing_house' => ['nullable', 'string', 'max:255'],
                        'country' => ['nullable', 'string', 'max:255'],
                        'pages' => ['nullable', 'string', 'max:255'],
                        'isbn' => ['nullable', 'string', 'max:255', Rule::unique('chapters')->ignore($chapter->id)],
                    ]);


                    $chapter->editors = $data['editors'];
                    $chapter->edition = $data['edition'];
                    $chapter->publishing_house = $data['publishing_house'];
                    $chapter->country = $data['country'];
                    $chapter->Pages = $data['pages'];
                    $chapter->isbn = $data['isbn'];
                    $chapter->update();

                }
                if ($scientific_production->type == 'Book') {
                    $book = Book::where('scientific_production_id', $scientific_production->id)->first();
                    $data = $request->validate([
                        'edition' => ['nullable', 'string', 'max:255'],
                        'publishing_house' => ['nullable', 'string', 'max:255'],
                        'isbn' => ['nullable', 'string', 'max:255', Rule::unique('books')->ignore($book->id)],
                    ]);


                    $book->edition = $data['edition'];
                    $book->publishing_house = $data['publishing_house'];
                    $book->isbn = $data['isbn'];
                    $book->update();

                }
                if ($scientific_production->type == 'other_type') {

                }

                $scientific_production->update();
                return Redirect::route('member.team.scientific.production.manage', ['id' => $id])->with('message', 'scientific production updated successfully');


            } else {
                return Redirect::route('home')->with('message', 'You are not authorized to modify this scientific production');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function sup_scientific_production($id)
    {
        if (Auth::check()) {
            $scientific_production = Scientific_production::find($id);

            $user_ids = json_decode($scientific_production->user_id_author, true);

            if (in_array((string) Auth::user()->id, $user_ids)) {


                if ($scientific_production->file) {

                    // Get the full path to the avatar file
                    $file = $scientific_production->file;

                    // Check if the file exists in storage before attempting to delete it
                    if ($file) {
                        // Delete the avatar file
                        Storage::disk('public')->delete($file);
                    }
                }


                if ($scientific_production->type == 'Journal') {


                    $journal = Journal::where('scientific_production_id', $scientific_production->id)->first();
                    $journal->delete();


                }
                if ($scientific_production->type == 'Proceeding') {


                    $proceeding = Proceeding::where('scientific_production_id', $scientific_production->id)->first();
                    $proceeding->delete();



                }
                if ($scientific_production->type == 'Conference') {
                    $conference = Conference::where('scientific_production_id', $scientific_production->id)->first();
                    $conference->delete();




                }
                if ($scientific_production->type == 'Chapter') {

                    $chapter = Chapter::where('scientific_production_id', $scientific_production->id)->first();
                    $chapter->delete();

                }
                if ($scientific_production->type == 'Book') {

                    $book = Book::where('scientific_production_id', $scientific_production->id)->first();
                    $book->delete();

                }
                if ($scientific_production->type == 'other_type') {

                }

                $scientific_production->delete();

                return Redirect::route('member.scientific.productions')->with('message', 'scientific production deleted successfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not authorized to modify this scientific production');
            }

        } else {
            return Redirect::route('home');
        }

    }


}
