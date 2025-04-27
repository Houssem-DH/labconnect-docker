<?php

namespace App\Http\Controllers\Team_leader;

use App\Http\Controllers\Controller;
use App\Models\Lab;
use App\Models\Team;
use App\Models\Project;
use App\Models\team_member;
use App\Models\Project_member;
use Illuminate\Http\Request;
use App\Models\Project_global_report;
use App\Models\Project_personal_report;
use App\Models\Material;
use App\Models\Scientific_production;


use App\Models\Domain;
use App\Models\Speciality;
use App\Models\Under_research_theme;
use App\Models\User;

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


use App\Models\Faculty;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;



class Team_leaderController extends Controller
{
    public function index()
    {

        if (Auth::check()) {
            $lab_member = Lab_member::where('user_id', Auth::user()->id)->where('team_leader', 1)->first();
            if ($lab_member) {



                return Inertia::render(
                    'Team_leaderSpace/index',
                    [
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),



                    ]

                );

            } else {
                return Redirect::route('home');


            }

        } else {
            return Redirect::route('home');

        }



    }


    public function space_index()
    {


        if (Auth::check()) {



            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();




            $lab = Lab::where("id", $lab_member->lab_id)->first();


            $teams = Team::where('team_leader_id', Auth::user()->id)->get();


            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
            // Fetch team members for each team
            foreach ($teams as $team) {
                $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();



            }



            if ($lab) {






                // Fetch team members for each team

                $userRole = Session::get('user_role'); // Get session variable
                return Inertia::render('TeamLeaderSpace/Home', [
                    'lab' => $lab,
                    'teams' => $teams,
                    'userRole' => $userRole,
                    'labs' => $labs,
                    'lab_members_all' => $lab_members_all,
                    'lab_members' => $lab_members,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);
            } else {
                return Redirect::route('home');
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
            $faculty = Faculty::with('establishment')->where('id', $lab->faculty_institute_id)->first();
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






                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('TeamLeaderSpace/Home', [
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
            $lab_members = Lab_member::with('user', 'team_member.team')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if ($lab) {

                $userRole = Session::get('user_role'); // Get session variable
                return Inertia::render('TeamLeaderSpace/Members', [
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
            $isTeamLeader = Team::where('team_leader_id', Auth::user()->id)->first();



            $lab = Lab::where("id", $lab_member->lab_id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if ($lab) {
                $teams = Team::where('lab_id', $lab->id)
                    ->orderByRaw('team_leader_id = ? DESC, created_at DESC', [Auth::user()->id])
                    ->get();






                // Fetch team members for each team
                foreach ($teams as $team) {
                    $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();



                }
                $userRole = Session::get('user_role'); // Get session variable
                return Inertia::render('TeamLeaderSpace/Teams', [
                    'lab' => $lab,
                    'teams' => $teams,
                    'userRole' => $userRole,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'isTeamLeader' => $isTeamLeader,

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


    public function projects()
    {


        if (Auth::check()) {

            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();
            $lab = Lab::where("id", $lab_member->lab_id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if ($lab) {
                $teams = Team::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $project_member = Project_member::where('user_id', Auth::user()->id)->first();
                $projects = Project::where('lab_id', $lab->id)
                    ->where(function ($query) use ($project_member) {
                        // Check if $project_member is not null before applying the condition
                        if ($project_member && $project_member->project) {
                            $query->where('project_display', 1)
                                ->orWhere('id', $project_member->project_id);
                        } else {
                            // If no project member, only get projects with 'project_display' set to 1
                            $query->where('project_display', 1);
                        }
                    })
                    ->with('user')
                    ->orderBy('created_at', 'desc')
                    ->get();







                // Fetch team members for each team
                foreach ($teams as $team) {
                    $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();



                }

                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('TeamLeaderSpace/Projects', [
                    'lab' => $lab,
                    'teams' => $teams,
                    'projects' => $projects,
                    'userRole' => $userRole,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'lab_members_all' => $lab_members_all,
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
                return Inertia::render('TeamLeaderSpace/Materials', [
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



            return Inertia::render('TeamLeaderSpace/ScientificProduction', [
                'scientificProductions' => $scientificProductions,
                'userRole' => $userRole,

                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
            ]);

        } else {
            return Redirect::route('home');
        }



    }


    public function thesis_index()
    {
        if (Auth::check()) {


            $team = Team::where('team_leader_id', Auth::user()->id)->first();
            $lab = Lab::where('director_id', Auth::user()->id)->first();


            if ($team || $lab) {


                if ($team) {
                    $phd_thesis = Phd_thesis::where('team_id', $team->id)->with('team', 'supervisor', 'student', 'co_supervisor')->get();
                    $labMembers = Lab_member::with('user')->where('lab_id', $team->lab_id)->where('is_supervisor', 1)->orderBy('created_at', 'desc')->get();
                    $labMembersC = Lab_member::with('user')->where('lab_id', $team->lab_id)->where('is_co_supervisor', 1)->orderBy('created_at', 'desc')->get();
                }

                $phdStudents = Lab_member::where('phd_student', 1)->with('user')->get();



                $userRole = Session::get('user_role'); // Get session variable
                return Inertia::render(
                    'TeamLeaderSpace/PhdThesis',
                    [
                        'phd_thesis' => $phd_thesis ?? [],  // Use null coalescing operator
                        'phdStudents' => $phdStudents,
                        'labMembers' => $labMembers ?? [],
                        'labMembersC' => $labMembersC ?? [],
                        'team' => $team ?? [],
                        'userRole' => $userRole,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]
                );



            } else {
                return Redirect::route('home')->with('message', 'access denied');
            }
        } else {
            return Redirect::route('home');
        }
    }




    public function sup_team_member($id)
    {

        if (Auth::check()) {
            $team_member = Team_Member::find($id);
            $team = Team::where('id', $team_member->team_id)->first();
            if ($team->team_leader_id == Auth::user()->id) {

                $team_member->delete();
                return Redirect::route('team.leader.space.teams')->with('message', 'member deleted successfully');


            } else {
                return Redirect::route('home')->with('message', 'you are not the leader of this team');
            }



        } else {
            return Redirect::route('home');
        }

    }


    public function mise_team(Request $request, $id)
    {



        if (Auth::check()) {
            $team = Team::where('id', $id)->first();
            $lab = Lab::where('id', $team->lab_id)->first();
            if ($team->team_leader_id == Auth::user()->id) {



                // Validate the request data
                $data = $request->validate([
                    'title' => ['required', 'string'],
                    'acronym_team_name' => ['nullable', 'string'],
                    'Keywords' => ['nullable', 'string'],
                    'theme_description' => ['nullable', 'string'],
                    'sub_research_area' => ['nullable', 'array'], // Attend un tableau
                    'sub_research_area.*' => ['string'], // Chaque élément du tableau doit être une chaîne
                ]);


                $team->title = $data['title'];
                $team->acronym_team_name = $data['acronym_team_name'];
                $team->Keywords = $data['Keywords'];
                $team->theme_description = $data['theme_description'];
                $team->sub_research_area = json_encode($data['sub_research_area']);
                $team->update();
                return Redirect::route('team.leader.space.teams')->with('message', 'team updated successfully');

            } else {
                return Redirect::route('home')->with('message', 'you are not the leader of this team');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function phd_thesis_insert(Request $request, $id)
    {

        if (Auth::check()) {
            $team = Team::where('id', $id)->first();
            if ($team->team_leader_id == Auth::user()->id) {


                $data = $request->validate([
                    'thesis_title' => ['required', 'string'],
                    'phd_student_id' => ['required', 'numeric'],
                    'supervisor_id' => ['nullable', 'numeric'],
                    'co_supervisor_id' => ['nullable', 'numeric'],
                    'email' => 'nullable|string|lowercase|email|max:255|unique:users,email',
                    'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
                    'first_name' => ['nullable', 'string', 'max:255'],
                    'last_name' => ['nullable', 'string', 'max:255'],
                    'phone_number' => ['nullable', 'string', 'regex:/^0[0-9]{9}$/'],
                    'emailc' => 'nullable|string|lowercase|email|max:255|unique:users,email',
                    'passwordc' => ['nullable', 'confirmed', Rules\Password::defaults()],
                    'first_namec' => ['nullable', 'string', 'max:255'],
                    'last_namec' => ['nullable', 'string', 'max:255'],
                    'phone_numberc' => ['nullable', 'string', 'regex:/^0[0-9]{9}$/'],
                ]);


                $existing_phd_thesis = Phd_thesis::where('phd_student_id', $data['phd_student_id'])->first();

                if (!$existing_phd_thesis) {


                    $phd_thesis = new Phd_thesis;

                    $phd_thesis->team_id = $id;
                    $phd_thesis->phd_student_id = $data['phd_student_id'];

                    //external member hedi t3yf
                    $lab_m = Lab_member::where('user_id', $data['supervisor_id'])->first();
                    $external_member = External_member::where('user_id', $data['supervisor_id'])->first();


                    if ($data['supervisor_id'] && $lab_m) {
                        $phd_thesis->supervisor_id = $data['supervisor_id'];

                        $lab_m->is_supervisor = 1;
                        $lab_m->update();


                    } elseif ($data['supervisor_id'] && !$lab_m && $external_member) {
                        $phd_thesis->supervisor_id = $data['supervisor_id'];
                        $external_member->is_supervisor = 1;
                        $external_member->update();


                    } elseif ($data['first_name'] && $data['last_name'] && $data['email'] && $data['password']) {

                        // Retrieve all users from the database
                        $existingUsers = User::all();

                        // Check for similar names
                        foreach ($existingUsers as $existingUser) {

                            $firstNameSimilarity = 0;
                            $lastNameSimilarity = 0;

                            similar_text($data['first_name'], $existingUser->first_name, $firstNameSimilarity);
                            similar_text($data['last_name'], $existingUser->last_name, $lastNameSimilarity);

                            // Check if similarity is greater than 75%
                            if ($firstNameSimilarity > 75 && $lastNameSimilarity > 75) {

                                return back()->withErrors(['message' => 'A user with a similar name already exists.']);

                            }
                        }

                        $user = User::create([
                            'first_name' => $request->first_name,
                            'last_name' => $request->last_name,
                            'email' => $request->email,
                            'phone_number' => $request->phone_number,
                            'password' => Hash::make($request->password),
                        ]);


                        $Externalsupervisor = new External_member;

                        $Externalsupervisor->phd_thesis_id = json_encode([$phd_thesis->id]);
                        $Externalsupervisor->is_supervisor = 1;
                        $Externalsupervisor->user_id = $user->id;
                        $Externalsupervisor->save();


                        $phd_thesis->supervisor_id = $user->id;


                    } elseif ($data['first_namec'] && $data['last_namec'] && $data['emailc'] && $data['passwordc']) {

                        // Retrieve all users from the database
                        $existingUsers = User::all();

                        // Check for similar names
                        foreach ($existingUsers as $existingUser) {

                            $firstNameSimilarity = 0;
                            $lastNameSimilarity = 0;

                            similar_text($data['first_namec'], $existingUser->first_name, $firstNameSimilarity);
                            similar_text($data['last_namec'], $existingUser->last_name, $lastNameSimilarity);

                            // Check if similarity is greater than 75%
                            if ($firstNameSimilarity > 75 && $lastNameSimilarity > 75) {

                                return back()->withErrors(['message' => 'A user with a similar name already exists.']);

                            }
                        }

                        $userc = User::create([
                            'first_name' => $request->first_namec,
                            'last_name' => $request->last_namec,
                            'email' => $request->emailc,
                            'phone_number' => $request->phone_numberc,
                            'password' => Hash::make($request->passwordc),
                        ]);


                        $Externalsupervisor = new External_member;

                        $Externalsupervisor->phd_thesis_id = json_encode([$phd_thesis->id]);
                        $Externalsupervisor->is_supervisor = 1;
                        $Externalsupervisor->user_id = $userc->id;
                        $Externalsupervisor->save();


                        $phd_thesis->supervisor_id = $userc->id;


                    } else {
                        return back()->withErrors(['message' => 'you should choose or create a supervisor ']);
                    }

                    $lab_m_co = Lab_member::where('user_id', $data['co_supervisor_id'])->first();
                    $external_member_co = External_member::where('user_id', $data['co_supervisor_id'])->first();


                    if ($data['co_supervisor_id'] && $lab_m_co) {
                        $phd_thesis->co_supervisor_id = $data['co_supervisor_id'];

                        $lab_m_co->is_co_supervisor = 1;
                        $lab_m_co->update();

                    } elseif ($data['co_supervisor_id'] && !$lab_m_co && $external_member_co) {
                        $phd_thesis->co_supervisor_id = $data['co_supervisor_id'];
                        $external_member_co->is_co_supervisor = 1;
                        $external_member_co->update();




                    }   /** elseif ($data['first_name'] && $data['last_name'] && $data['email'] && $data['password']) {

        // Retrieve all users from the database
        $existingUsers = User::all();

        // Check for similar names
        foreach ($existingUsers as $existingUser) {

            $firstNameSimilarity = 0;
            $lastNameSimilarity = 0;

            similar_text($data['first_name'], $existingUser->first_name, $firstNameSimilarity);
            similar_text($data['last_name'], $existingUser->last_name, $lastNameSimilarity);

            // Check if similarity is greater than 75%
            if ($firstNameSimilarity > 75 && $lastNameSimilarity > 75) {

                return back()->withErrors(['error' => 'A user with a similar name already exists.']);

            }
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
        ]);


        $Externalcosupervisor = new External_member;

        $Externalcosupervisor->phd_thesis_id = json_encode([$phd_thesis->id]);
        $Externalcosupervisor->is_co_supervisor = 1;
        $Externalcosupervisor->user_id = $user->id;
        $Externalcosupervisor->save();


        $phd_thesis->co_supervisor_id = $user->id;


    }

    elseif ($data['first_namec'] && $data['last_namec'] && $data['emailc'] && $data['passwordc']) {

        // Retrieve all users from the database
        $existingUsers = User::all();

        // Check for similar names
        foreach ($existingUsers as $existingUser) {

            $firstNameSimilarity = 0;
            $lastNameSimilarity = 0;

            similar_text($data['first_namec'], $existingUser->first_name, $firstNameSimilarity);
            similar_text($data['last_namec'], $existingUser->last_name, $lastNameSimilarity);

            // Check if similarity is greater than 75%
            if ($firstNameSimilarity > 75 && $lastNameSimilarity > 75) {

                return back()->withErrors(['error' => 'A user with a similar name already exists.']);

            }
        }

        $userc = User::create([
            'first_name' => $request->first_namec,
            'last_name' => $request->last_namec,
            'email' => $request->emailc,
            'phone_number' => $request->phone_numberc,
            'password' => Hash::make($request->passwordc),
        ]);


        $Externalcosupervisor = new External_member;

        $Externalcosupervisor->phd_thesis_id = json_encode([$phd_thesis->id]);
        $Externalcosupervisor->is_co_supervisor = 1;
        $Externalcosupervisor->user_id = $userc->id;
        $Externalcosupervisor->save();


        $phd_thesis->co_supervisor_id = $userc->id;


    } **/


                    $phd_thesis->thesis_title = $data['thesis_title'];
                    $phd_thesis->save();

                    return Redirect::route('team.leader.space.phd.thesis')->with('message', 'thesis Added Succesfully');
                } else {
                    return Redirect::route('team.leader.space.phd.thesis')->with('message', 'this student has already a phd thesis');
                }

            } else {
                return Redirect::route('home')->with('message', 'you are not the leader of this team');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function sup_phd_thesis($id)
    {
        if (Auth::check()) {

            $phd_thesis = Phd_thesis::find($id);
            $team = Team::where('id', $phd_thesis->team_id)->first();

            if ($team->team_leader_id == Auth::user()->id) {

                $phd_thesis->delete();
                return Redirect::route('team.leader.space.home')->with('message', 'thesis deleted Succesfully');

            } else {
                return Redirect::route('home')->with('message', 'you are not the leader of this team');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function project_index($id)
    {


        if (Auth::check()) {



            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();



            $lab = Lab::where("id", $lab_member->lab_id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();




            if ($lab) {


                $user = User::where("id", $lab->director_id)->first();
                $projectDetails = Project::where('id', $id)->first();
                $projectMembers = Project_member::where('project_id', $projectDetails->id)->with('user')->get();
                $isProjectMember = Project_member::where('user_id', Auth::user()->id)->where('project_id', $id)->with('user')->get();

                $personalReports = Project_personal_report::where('project_id', $projectDetails->id)->with('user')->get();
                $personalReport = Project_personal_report::where('project_member_id', Auth::user()->id)->where('project_id', $projectDetails->id)->with('user')->first();

                $globalReport = Project_global_report::where('project_id', $projectDetails->id)->where('project_leader_id', $projectDetails->project_leader_id)->with('user')->first();

                // Get all external members
                $externalMembers = External_member::with('user')->get();

                // Extract the numeric ID from the project ID you're searching for
                $projectId = $projectDetails->id;

                // Filter external members where project_id contains the numeric project ID
                $noProjectMembers = $externalMembers->filter(function ($member) use ($projectId) {
                    $projectIds = json_decode($member->project_id, true);

                    // Ensure $projectIds is an array
                    $projectIds = is_array($projectIds) ? $projectIds : [];

                    // Check if the numeric project ID exists in the decoded project IDs
                    return in_array($projectId, $projectIds);
                });

                $isProjectLeader = Project::where('id', $projectId)->where('project_leader_id', Auth::user()->id)->first();


                return Inertia::render('TeamLeaderSpace/ManageProject', [
                    'lab' => $lab,
                    'user' => $user,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'personalReport' => $personalReport,
                    'personalReports' => $personalReports,
                    'globalReport' => $globalReport,
                    'externalMembers' => $externalMembers,
                    'isProjectMember' => $isProjectMember,
                    'isProjectLeader' => $isProjectLeader,

                    'lab_members_all' => $lab_members_all,
                    'projectDetails' => $projectDetails,
                    'projectMembers' => $projectMembers,
                    'noProjectMembers' => $noProjectMembers,
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



    public function project_global_report_insert(Request $request, $id)
    {



        if (Auth::check()) {

            $project = Project::find($id);
            $lab = Lab::where('id', $project->lab_id)->first();
            $exist_project_global_report = Project_global_report::where('project_id', $project->id)->first();


            if (Auth::user()->director === 1 && Auth::user()->id === $lab->director_id) {


                if (!$exist_project_global_report) {
                    // Validate the request data
                    $data = $request->validate([
                        'advancement_state' => ['nullable', 'string'],
                        'scientific_production' => ['nullable', 'string'], // Attend un tableau


                    ]);


                    $project_global_report = new Project_global_report;


                    $project_global_report->project_id = $id;
                    $project_global_report->project_leader_id = Auth::user()->id;
                    $project_global_report->advancement_state = $data['advancement_state'];
                    $project_global_report->scientific_production = json_encode($data['scientific_production']);
                    $project_global_report->save();
                    return Redirect::route('team.leader.project.manage', ['id' => $id])->with('message', 'report Added Succesfully');
                } else {
                    return Redirect::route('team.leader.project.manage', ['id' => $id])->with('message', 'a report is already added to this project');
                }

            } else {
                return Redirect::route('home')->with('message', 'you are not the leader of this project');
            }
        } else {
            return Redirect::route('home');
        }

    }

    public function project_personal_report_insert(Request $request, $id)
    {



        if (Auth::check()) {

            $project = Project::find($id);
            $isMember = Project_member::where('project_id', $project->id)
                ->where('user_id', Auth::user()->id)
                ->exists();
            $exist_project_personal_report = Project_personal_report::where('project_id', $project->id)->where('project_member_id', Auth::user()->id)->first();


            if ($isMember) {


                if (!$exist_project_personal_report) {
                    // Validate the request data
                    $data = $request->validate([
                        'advancement_state' => ['nullable', 'string'],
                        'scientific_production' => ['nullable', 'string'], // Attend un tableau


                    ]);


                    $project_personal_report = new Project_personal_report;


                    $project_personal_report->project_id = $id;
                    $project_personal_report->project_member_id = Auth::user()->id;
                    $project_personal_report->advancement_state = $data['advancement_state'];
                    $project_personal_report->scientific_production = json_encode($data['scientific_production']);
                    $project_personal_report->save();
                    return Redirect::route('team.leader.project.manage', ['id' => $id])->with('message', 'report Added Succesfully');
                } else {
                    return Redirect::route('team.leader.project.manage', ['id' => $id])->with('message', 'a report is already added to this project');
                }

            } else {
                return Redirect::route('home')->with('message', 'you are not a member of this project');
            }
        } else {
            return Redirect::route('home');
        }

    }



    public function mise_project_personal_report(Request $request, $id)
    {



        if (Auth::check()) {

            $project_personal_report = Project_personal_report::find($id);
            $project = Project::where('id', $project_personal_report->project_id)->first();

            $isMember = Project_member::where('project_id', $project->id)
                ->where('user_id', Auth::user()->id)
                ->exists();



            if ($isMember && $project_personal_report->project_member_id == Auth::user()->id) {



                // Validate the request data
                $data = $request->validate([

                    'advancement_state' => ['nullable', 'string'],
                    'scientific_production' => ['nullable', 'string'], // Attend un tableau


                ]);


                $project_personal_report->advancement_state = $data['advancement_state'];
                $project_personal_report->scientific_production = json_encode($data['scientific_production']);
                $project_personal_report->update();


                return Redirect::route('team.leader.project.manage', ['id' => $project_personal_report->project_id])->with('message', 'report updated  Succesfully');


            } else {
                return Redirect::route('home')->with('message', 'you are not a member of this project');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function mise_project_global_report(Request $request, $id)
    {



        if (Auth::check()) {

            $project_global_report = Project_global_report::find($id);
            $project = Project::where('id', $project_global_report->project_id)->first();
            $lab = Lab::where('id', $project->lab_id)->first();



            if ($project->project_leader_id == Auth::user()->id) {



                // Validate the request data
                $data = $request->validate([

                    'advancement_state' => ['nullable', 'string'],
                    'scientific_production' => ['nullable', 'string'], // Attend un tableau


                ]);



                $project_global_report->project_leader_id = Auth::user()->id;
                $project_global_report->advancement_state = $data['advancement_state'];
                $project_global_report->scientific_production = json_encode($data['scientific_production']);
                $project_global_report->update();


                return Redirect::route('team.leader.project.manage', ['id' => $project_global_report->project_id])->with('message', 'report updated  Succesfully');


            } else {
                return Redirect::route('home')->with('message', 'you are not the leader of this project');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function scientific_production_insert(Request $request, $id)
    {

        if (Auth::check()) {

            $lab_member = Lab_member::where('user_id', Auth::user()->id)->where('member', 1)->first();


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




                if (Auth::user()->director == 1) {
                    return Redirect::route('team.leader.space.scientific.productions', ['id' => $id])->with('message', 'Scientific Production Added Succesfully');
                } else {
                    return Redirect::route('team.leader.space.scientific.productions', ['id' => $id])->with('message', 'Scientific Production Added Succesfully');
                }




            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
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
            Log::info($user_ids);

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
                return Redirect::route('team.leader.team.scientific.production.manage', ['id' => $id])->with('message', 'scientific production updated successfully');


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

                return Redirect::route('team.leader.space.scientific.productions')->with('message', 'scientific production deleted successfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not authorized to modify this scientific production');
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




                return Inertia::render('TeamLeaderSpace/ManageProduction', [
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

                return Redirect::route('team.leader.team.scientific.production.manage', ['id' => $id])->with('message', 'Member added successfully');
            } else {
                return Redirect::route('team.leader.team.scientific.production.manage', ['id' => $id])->with('message', 'You are not authorized to modify this scientific production');
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

                return Redirect::route('team.leader.team.scientific.production.manage', ['id' => $id])->with('message', 'Author removed successfully');

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



}
