<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Models\Lab;
use App\Models\Lab_member;
use App\Models\Material;
use App\Models\Project;
use App\Models\Journal;
use App\Models\Phd_thesis;
use App\Models\Proceeding;
use App\Models\Conference;
use App\Models\Chapter;
use App\Models\Book;
use App\Models\Service_request;
use App\Models\Team;
use App\Models\team_member;
use App\Models\Notification;
use App\Models\Establishment;
use App\Models\Scientific_activity;
use App\Models\Project_global_report;
use App\Models\Project_personal_report;
use App\Models\Faculty;
use App\Models\Domain;
use App\Models\External_member;
use App\Models\Speciality;
use App\Models\Teaching;
use App\Models\Service;
use App\Models\Exist_service_request;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Project_member;
use App\Models\Master_thesis;
use App\Models\Scientific_event;
use App\Models\Scientific_production;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Services\ChatService;
use App\Models\ChargilyPayment;

use Session;

class DirectorController extends Controller
{

    protected $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    public function home()
    {


        if (Auth::check()) {



            $lab = Lab::where("director_id", Auth::user()->id)->first();
            $user = User::where("id", $lab->director_id)->first();
            $faculty = Faculty::with('establishment')->where('id', $lab->faculty_institute_id)->first();


            $domains = Domain::get();
            $specialities = Speciality::get();

            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {


                $number_teams = Team::where('lab_id', $lab->id)->count();
                $number_lab_members = Lab_member::where('lab_id', $lab->id)->count();
                $number_researchers = Lab_member::where('lab_id', $lab->id)->where('researcher', 1)->count();
                $researchers_establishment = Lab_member::where('lab_id', $lab->id)->where('researcher_establishment', 1)->count();
                $researchers_out_establishment = Lab_member::where('lab_id', $lab->id)->where('researcher_out_establishment', 1)->count();
                $associated_researchers = Lab_member::where('lab_id', $lab->id)->where('associated_researcher', 1)->count();
                $number_support_stuff = Lab_member::where('lab_id', $lab->id)->where('support_stuff', 1)->count();
                $establishment = Establishment::get();
                $faculties = Faculty::get();
                $domains = Domain::get();
                $specialities = Speciality::get();
                $teams = Team::where('id', $lab->id)->get();
                $recentLabMembers = Lab_member::where('lab_id', $lab->id)
                    ->latest() // Orders by the 'created_at' column in descending order
                    ->take(3)  // Limits the results to the last 4 members
                    ->with('user')
                    ->get();






                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('DirectorSpace/Home', [
                    'lab' => $lab,
                    'recentLabMembers' => $recentLabMembers,
                    'user' => $user,
                    'domains' => $domains,
                    'specialities' => $specialities,
                    'userRole' => $userRole,
                    'number_teams' => $number_teams,
                    'number_lab_members' => $number_lab_members,
                    'number_researchers' => $number_researchers,
                    'researchers_establishment' => $researchers_establishment,
                    'researchers_out_establishment' => $researchers_out_establishment,
                    'associated_researchers' => $associated_researchers,
                    'establishment' => $establishment,
                    'faculties' => $faculties,
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


            $lab = Lab::where("director_id", Auth::user()->id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user', 'team_member.team')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
            $domains = Domain::get();
            $specialities = Speciality::get();
            $teams = Team::where('lab_id', $lab->id)->get();

            Log::info($teams);

            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {


                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('DirectorSpace/Members', [
                    'lab' => $lab,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'userRole' => $userRole,
                    'lab_members_all' => $lab_members_all,
                    'domains' => $domains,
                    'specialities' => $specialities,
                    'teams' => $teams,
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


    public function teams()
    {


        if (Auth::check()) {


            $lab = Lab::where("director_id", Auth::user()->id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
            $domains = Domain::get();
            $specialities = Speciality::get();

            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {
                $teams = Team::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();





                // Fetch team members for each team
                foreach ($teams as $team) {
                    $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();



                }


                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('DirectorSpace/Teams', [
                    'lab' => $lab,
                    'teams' => $teams,
                    'userRole' => $userRole,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'lab_members_all' => $lab_members_all,
                    'domains' => $domains,
                    'specialities' => $specialities,
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

    public function projects()
    {


        if (Auth::check()) {


            $lab = Lab::where("director_id", Auth::user()->id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {
                $teams = Team::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $projects = Project::where('lab_id', $lab->id)->with('user')->orderBy('created_at', 'desc')->get();





                // Fetch team members for each team
                foreach ($teams as $team) {
                    $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();



                }

                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('DirectorSpace/Projects', [
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


            $lab = Lab::where("director_id", Auth::user()->id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
            $domains = Domain::get();
            $specialities = Speciality::get();


            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {
                $teams = Team::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $materials = Material::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();





                // Fetch team members for each team
                foreach ($teams as $team) {
                    $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();



                }
                $userRole = Session::get('user_role'); // Get session variable
                return Inertia::render('DirectorSpace/Materials', [
                    'lab' => $lab,
                    'teams' => $teams,
                    'userRole' => $userRole,
                    'materials' => $materials,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'lab_members_all' => $lab_members_all,
                    'domains' => $domains,
                    'specialities' => $specialities,
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


    public function scientific_activities()
    {


        if (Auth::check()) {


            $lab = Lab::where("director_id", Auth::user()->id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
            $domains = Domain::get();
            $specialities = Speciality::get();


            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {
                $teams = Team::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $materials = Material::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();


                $scientificActivities = Scientific_activity::where('lab_id', $lab->id)->get();





                // Fetch team members for each team
                foreach ($teams as $team) {
                    $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();



                }
                $userRole = Session::get('user_role'); // Get session variable
                return Inertia::render('DirectorSpace/ScientificActivities', [
                    'lab' => $lab,
                    'scientificActivities' => $scientificActivities,
                    'teams' => $teams,
                    'userRole' => $userRole,
                    'materials' => $materials,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'lab_members_all' => $lab_members_all,
                    'domains' => $domains,
                    'specialities' => $specialities,
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



    public function scientific_productions()
    {


        if (Auth::check()) {


            $scientificProductions = Scientific_production::whereJsonContains('user_id_author', (string) Auth::user()->id)->get();



            $userRole = Session::get('user_role'); // Get session variable



            return Inertia::render('DirectorSpace/ScientificProduction', [
                'scientificProductions' => $scientificProductions,
                'userRole' => $userRole,

                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
            ]);

        } else {
            return Redirect::route('home');
        }



    }




    public function services()
    {


        if (Auth::check()) {
            $lab = Lab::where("director_id", Auth::user()->id)->first();
            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {
                $services = Service::where('lab_id', $lab->id)->get();



                $userRole = Session::get('user_role'); // Get session variable



                return Inertia::render('DirectorSpace/Services', [
                    'services' => $services,
                    'userRole' => $userRole,
                    'lab' => $lab,

                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);
            }

        } else {
            return Redirect::route('home');
        }



    }
    // Controller (app/Http/Controllers/DirectorSpaceController.php)
    public function reservations()
    {
        if (!Auth::check()) {
            return Redirect::route('home');
        }

        $lab = Lab::where("director_id", Auth::id())->first();

        if (!$lab || Auth::user()->director != 1) {
            return Redirect::route('home');
        }

        $paidReservations = ChargilyPayment::with(['materialReservation.material.lab', 'user'])
            ->where('status', 'paid')
            ->whereHas('materialReservation.material', function ($query) use ($lab) {
                $query->where('lab_id', $lab->id); // Assuming materials belong to a lab
            })

            ->paginate(10)
            ->through(fn($payment) => [
                'id' => $payment->id,
                'user' => $payment->user->only('name', 'email'),
                'amount' => number_format($payment->amount, 2),
                'currency' => $payment->currency,
                'paid_at' => $payment->created_at->format('M d, Y H:i'),
                'material' => $payment->materialReservation->material->name,
                'reservation_date' => Carbon::parse($payment->materialReservation->reservation_date)->format('M d, Y'),
                'status' => $payment->materialReservation->status,
                'quantity' => $payment->materialReservation->quantity,
                'return_date' => optional($payment->materialReservation->return_date)->format('M d, Y'),
            ]);

        return Inertia::render('DirectorSpace/Reservations', [
            'paidReservations' => $paidReservations,
            'lab' => $lab,
            'userRole' => Session::get('user_role'),
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }


    /*public function lab_member_insert_yes(Request $request, $id)
    {

        $lab = Lab::where('id', $id)->where('director_id', Auth::user()->id)->first();
        

        if (Auth::check() && Auth::user()->director == 1 && $lab) {
            

            $data = $request->validate([
                'user_id' => ['required', 'numeric'],
                'domain_id' => ['nullable', 'string'],
                'speciality_id' => ['nullable', 'string'],
                'domain' => ['nullable', 'string'],
                'speciality' => ['nullable', 'string'],
                'isProject_leader' => ['sometimes', 'boolean'], // Validate if present, should be boolean (true/false)
                'isTeam_leader' => ['sometimes', 'boolean'], // Validate if present, should be boolean (true/false)
                'isMember' => ['sometimes', 'boolean'], // Validate if present, should be boolean (true/false)
                'isPhd_student' => ['sometimes', 'boolean'], // Validate if present, should be boolean (true/false)
                'member_rank' => ['required', 'string', 'max:255'], // New validation rule for member rank
                'support_stuff' => ['sometimes', 'boolean'],
                'researcher' => ['sometimes', 'boolean'],
                'researcher_establishment' => ['sometimes', 'boolean'],
                'researcher_out_establishment' => ['sometimes', 'boolean'],
                'associated_researcher' => ['sometimes', 'boolean'],
                'team_id' => ['required', 'numeric'],
            ]);





            $user = User::where('id', $request->user_id)->first();
            $labm = Lab_Member::where("user_id", $user->id)->where("lab_id", $lab->id)->first();

            if (!$labm) {

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




                $lab_member = new Lab_Member;

                // Attach the user to the lab


                $lab_member->lab_id = $id;
                $lab_member->user_id = $data['user_id'];
                $lab_member->research_domain = $domain->name;
                $lab_member->research_specialty = $speciality->name;
                $lab_member->project_leader = $data['isProject_leader'] == TRUE ? '1' : '0';
                $lab_member->team_leader = $data['isTeam_leader'] == TRUE ? '1' : '0';
                $lab_member->member = $data['isMember'] == TRUE ? '1' : '0';
                $lab_member->phd_student = $data['isPhd_student'] == TRUE ? '1' : '0';
                $lab_member->member_rank = $data['member_rank']; // Save member rank to the database
                $lab_member->support_stuff = $data['support_stuff'] == TRUE ? '1' : '0';
                $lab_member->researcher = $data['researcher'] == TRUE ? '1' : '0';
                $lab_member->researcher_establishment = $data['researcher_establishment'] == TRUE ? '1' : '0';
                $lab_member->researcher_out_establishment = $data['researcher_out_establishment'] == TRUE ? '1' : '0';
                $lab_member->associated_researcher = $data['associated_researcher'] == TRUE ? '1' : '0';
                $lab_member->user_id = $data['user_id'];

                $lab_member->save();


                $team_member = new Team_Member;
                $team_member->team_id =  $data['team_id'];
                $team_member->user_id = $data['user_id'];
                $team_member->save();



            }

            return Redirect::route('director.space.members');
        } else {
            return Redirect::route('home');
        }
    }*/

    public function lab_member_insert(Request $request, $id)
    {
        // Check if the lab exists and the current user is the director of this lab
        $lab = Lab::where('id', $id)->where('director_id', Auth::user()->id)->first();
        if (Auth::check() && Auth::user()->director == 1 && $lab) {
            // Validate incoming request data
            $data = $request->validate([
                'email' => 'nullable|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
                'isProject_leader' => ['sometimes', 'boolean'],
                'isTeam_leader' => ['sometimes', 'boolean'],
                'isMember' => ['sometimes', 'boolean'],
                'isPhd_student' => ['sometimes', 'boolean'],
                'first_name' => ['required', 'string', 'max:255'],
                'last_name' => ['required', 'string', 'max:255'],
                'domain_id' => ['nullable'],
                'speciality_id' => ['nullable'],
                'member_rank' => ['required', 'string', 'max:255'],
                'support_stuff' => ['sometimes', 'boolean'],
                'researcher' => ['sometimes', 'boolean'],
                'researcher_establishment' => ['sometimes', 'boolean'],
                'researcher_out_establishment' => ['sometimes', 'boolean'],
                'associated_researcher' => ['sometimes', 'boolean'],
                'phone' => ['nullable', 'numeric'],
                'team_id' => ['required', 'numeric'],
                'is_project_member' => ['sometimes', 'boolean'],
                'is_supervisor' => ['sometimes', 'boolean'],
                'is_co_supervisor' => ['sometimes', 'boolean'],
                'member_type' => ['required', 'string', 'max:255'],
            ]);

            $team = Team::where('id', $data['team_id'])->first();
            if ($data['first_name'] && $data['last_name']) {
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
                        $lab_m = Lab_member::where('user_id', $existingUser->id)->first();
                        $external_member = External_member::where('user_id', $existingUser->id)->first();
                        if ($lab_m) {
                            return Redirect::route('director.space.members')->with('message', 'A user with a similar name already exists.');
                        }
                        if ($external_member && !$lab_m) {

                            $speciality = Speciality::where('id', $data['speciality_id'])->first();
                            $domain = Domain::where('id', $data['domain_id'])->first();

                            // Create new lab member
                            $lab_member = new Lab_Member;
                            $lab_member->lab_id = $id;
                            $lab_member->user_id = $existingUser->id;
                            $lab_member->project_leader = $data['isProject_leader'] ? '1' : '0';
                            $lab_member->research_domain = $domain->name;
                            $lab_member->research_specialty = $speciality->name;
                            $lab_member->team_leader = $data['isTeam_leader'] ? '1' : '0';
                            $lab_member->member = $data['isMember'] ? '1' : '0';
                            $lab_member->phd_student = $data['isPhd_student'] ? '1' : '0';
                            $lab_member->member_rank = $data['member_rank'];
                            $lab_member->support_stuff = $data['support_stuff'] ? '1' : '0';
                            $lab_member->researcher = $data['researcher'] ? '1' : '0';
                            $lab_member->researcher_establishment = $data['researcher_establishment'] ? '1' : '0';
                            $lab_member->researcher_out_establishment = $data['researcher_out_establishment'] ? '1' : '0';
                            $lab_member->associated_researcher = $data['associated_researcher'] ? '1' : '0';
                            $lab_member->is_project_member = $data['is_project_member'] ? '1' : '0';
                            $lab_member->is_supervisor = $data['is_supervisor'] ? '1' : '0';
                            $lab_member->is_co_supervisor = $data['is_co_supervisor'] ? '1' : '0';
                            $lab_member->member_type = $data['member_type'];
                            $lab_member->save();
                            // Create new team member
                            $team_member = new Team_Member;
                            $team_member->team_id = $data['team_id'];
                            $team_member->user_id = $existingUser->id;
                            $team_member->save();
                            $old_team_leader = Lab_member::where("user_id", $team->team_leader_id)->first();



                            if ($data['isTeam_leader'] == '1') {
                                if ($old_team_leader) {
                                    $old_team_leader->team_leader = 0;
                                }

                                $team->team_leader_id = $existingUser->id;
                                $team->save();
                            }
                            return Redirect::route('director.space.members')->with('message', 'Member Added Succesfully');
                        }
                    }
                }
                if ($data['email'] && $data['password']) {
                    // Create new user
                    $user = User::create([
                        'first_name' => $request->first_name,
                        'last_name' => $request->last_name,
                        'email' => $request->email,
                        'phone_number' => $request->phone,
                        'password' => Hash::make($request->password),
                    ]);

                    $speciality = Speciality::where('id', $data['speciality_id'])->first();
                    $domain = Domain::where('id', $data['domain_id'])->first();

                    // Create new lab member
                    $lab_member = new Lab_Member;
                    $lab_member->lab_id = $id;
                    $lab_member->user_id = $user->id;
                    $lab_member->project_leader = $data['isProject_leader'] ? '1' : '0';
                    $lab_member->research_domain = $domain->name;
                    $lab_member->research_specialty = $speciality->name;
                    $lab_member->team_leader = $data['isTeam_leader'] ? '1' : '0';
                    $lab_member->member = $data['isMember'] ? '1' : '0';
                    $lab_member->phd_student = $data['isPhd_student'] ? '1' : '0';
                    $lab_member->member_rank = $data['member_rank'];
                    $lab_member->support_stuff = $data['support_stuff'] ? '1' : '0';
                    $lab_member->researcher = $data['researcher'] ? '1' : '0';
                    $lab_member->researcher_establishment = $data['researcher_establishment'] ? '1' : '0';
                    $lab_member->researcher_out_establishment = $data['researcher_out_establishment'] ? '1' : '0';
                    $lab_member->associated_researcher = $data['associated_researcher'] ? '1' : '0';
                    $lab_member->is_project_member = $data['is_project_member'] ? '1' : '0';
                    $lab_member->is_supervisor = $data['is_supervisor'] ? '1' : '0';
                    $lab_member->is_co_supervisor = $data['is_co_supervisor'] ? '1' : '0';
                    $lab_member->member_type = $data['member_type'];
                    $lab_member->save();
                    // Create new team member
                    $team_member = new Team_Member;
                    $team_member->team_id = $data['team_id'];
                    $team_member->user_id = $user->id;
                    $team_member->save();


                    $old_team_leader = Lab_member::where("user_id", $team->team_leader_id)->first();

                    if ($data['isTeam_leader'] == '1') {
                        if ($old_team_leader) {
                            $old_team_leader->team_leader = 0;
                            $old_team_leader->save();
                        }

                        $team->team_leader_id = $user->id;
                        $team->save();
                    }
                }
            }

            // Créer des chats pour le nouveau membre avec les autres membres
            $lab_members = Lab_Member::where('lab_id', $id)->where('user_id', '!=', Auth::user()->id)->get();
            foreach ($lab_members as $otherMember) {
                $this->chatService->getOrCreateChatSession($otherMember->user_id);
            }

            return Redirect::route('director.space.members')->with('message', 'Member Added Successfully');
        } else {
            return Redirect::route('home')->with('message', 'You are not the director of this lab');
        }
    }





    public function sup_lab_member($id)
    {
        if (Auth::check()) {
            $lab_member = Lab_member::where('id', $id)->first();
            $user = User::where('id', $lab_member->user_id)->first();

            //hna kayn hwayj nzidohom apres 

            $project_member = Project_member::where('user_id', $user->id)->get();
            $team_member = Team_member::where('user_id', $user->id)->first();
            $scientific_event = Scientific_event::where('user_id', $user->id)->get();
            $master_thesis = Master_thesis::where('user_id', $user->id)->get();
            $teaching = Teaching::where('user_id', $user->id)->get();



            $lb_id = $lab_member->lab_id;
            $lab = Lab::where('id', $lab_member->lab_id)->first();

            $external_member = External_member::where('user_id', $user->id)->first();

            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {

                $team = Team::where('team_leader_id', $user->id)->where('lab_id', $lab->id)->first();
                $project = Project::where('project_leader_id', $user->id)->where('lab_id', $lab->id)->first();

                if (!$team && !$project) {

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


                    $lab_member->delete();

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



                    return Redirect::route('director.space.members')->with('message', 'Member Deleted Successfully');
                    ;

                } else {
                    return Redirect::route('director.space.members')->with('message', 'This User is a Team/Project Leader , You Should Replace it Before Deleting');
                }
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }



        } else {
            return Redirect::route('home');
        }

    }


    public function lab_member_edit(Request $request, $id)
    {
        $labm = Lab_Member::find($id);
        $lab = Lab::where('id', $labm->lab_id)->where('director_id', Auth::user()->id)->first();


        if (Auth::check() && Auth::user()->director == 1 && $lab) {
            // Validate incoming request data
            $data = $request->validate([
                'isProject_leader' => ['sometimes', 'boolean'],
                'isTeam_leader' => ['sometimes', 'boolean'],
                'isMember' => ['sometimes', 'boolean'],
                'isPhd_student' => ['sometimes', 'boolean'],
                'domain_id' => ['required'],
                'speciality_id' => ['required'],
                'member_rank' => ['required', 'string', 'max:255'],
                'support_stuff' => ['sometimes', 'boolean'],
                'researcher' => ['sometimes', 'boolean'],
                'researcher_establishment' => ['sometimes', 'boolean'],
                'researcher_out_establishment' => ['sometimes', 'boolean'],
                'associated_researcher' => ['sometimes', 'boolean'],
                'team_id' => ['required', 'numeric'],
                'is_project_member' => ['sometimes', 'boolean'],
                'is_supervisor' => ['sometimes', 'boolean'],
                'is_co_supervisor' => ['sometimes', 'boolean'],
                'member_type' => ['required', 'string', 'max:255'],
            ]);



            $team = Team::where('id', $data['team_id'])->first();

            $user = User::where('id', $labm->user_id)->first();





            $speciality = Speciality::where('id', $data['speciality_id'])->first();
            $domain = Domain::where('id', $data['domain_id'])->first();


            // Create new lab member

            $labm->project_leader = $data['isProject_leader'] ? '1' : '0';
            $labm->research_domain = $domain->name;
            $labm->research_specialty = $speciality->name;
            $labm->team_leader = $data['isTeam_leader'] ? '1' : '0';
            $labm->member = $data['isMember'] ? '1' : '0';
            $labm->phd_student = $data['isPhd_student'] ? '1' : '0';
            $labm->member_rank = $data['member_rank'];
            $labm->support_stuff = $data['support_stuff'] ? '1' : '0';
            $labm->researcher = $data['researcher'] ? '1' : '0';
            $labm->researcher_establishment = $data['researcher_establishment'] ? '1' : '0';
            $labm->researcher_out_establishment = $data['researcher_out_establishment'] ? '1' : '0';
            $labm->associated_researcher = $data['associated_researcher'] ? '1' : '0';
            $labm->is_project_member = $data['is_project_member'] ? '1' : '0';
            $labm->is_supervisor = $data['is_supervisor'] ? '1' : '0';
            $labm->is_co_supervisor = $data['is_co_supervisor'] ? '1' : '0';
            $labm->member_type = $data['member_type'];
            $labm->update();





            $team_member = Team_Member::where('user_id', $labm->user_id)->first();
            if ($team_member) {
                $team_member->team_id = $data['team_id'];
                $team_member->update();
            } else {
                $team_member = new Team_Member();
                $team_member->user_id = $labm->user_id;
                $team_member->team_id = $data['team_id'];
                $team_member->save();

            }


            $old_team_leader = Lab_member::where("user_id", $team->team_leader_id)->first();

            if ($data['isTeam_leader'] === 1) {
                if ($old_team_leader) {
                    $old_team_leader->team_leader = 0;
                    $old_team_leader->save();
                }

                $team->team_leader_id = $user->id;
                $team->save();
            }


            return Redirect::route('director.space.members')->with('message', 'Member Updated Successfully');
        } else {
            return Redirect::route('home')->with('message', 'You are not the director of this lab');
        }
    }




    public function add_material_index()
    {


        if (Auth::check()) {


            $lab = Lab::where("director_id", Auth::user()->id)->first();



            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {


                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('DirectorSpace/Partials/AddMaterial', [
                    'lab' => $lab,
                    'userRole' => $userRole,
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


    public function material_insert(Request $request, $id)
    {



        if (Auth::check()) {

            $lab = Lab::find($id);
            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {


                // Validate the request data
                $data = $request->validate([
                    'name' => ['required', 'string', 'max:255'],
                    'use_case' => ['nullable', 'string'],
                    'reference' => ['required', 'string'],
                    'description' => ['required', 'string'],
                    'picture' => ['image', 'nullable', 'max:2048'], // Validate if the uploaded file is an image and its maximum size
                    'availability' => ['sometimes', 'boolean'],
                    'reservation_price' => ['nullable', 'numeric'],
                    'reservation_type' => ['required', 'string', 'max:255'],

                ]);


                $material = new Material;




                if ($request->hasFile('picture')) {

                    $picture = $request->file('picture')->store("material/{$id}", 'public');
                    $material->picture = $picture;
                }
                $material->lab_id = $id;
                $material->name = $data['name'];
                $material->use_case = $data['use_case'];
                $material->reference = $data['reference'];
                $material->description = $data['description'];
                $material->availability = $data['availability'] ? '1' : '0';
                $material->reservation_price = $data['reservation_price'];
                $material->reservation_type = $data['reservation_type'];


                $material->save();
                return Redirect::route('director.space.materials')->with('message', 'Material Added Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function sup_material($id)
    {
        if (Auth::check()) {

            $material = Material::find($id);
            $lab = Lab::where('id', $material->lab_id)->first();

            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {

                if ($material->picture) {

                    // Get the full path to the avatar file
                    $picture = $material->picture;

                    // Check if the file exists in storage before attempting to delete it
                    if ($picture) {
                        // Delete the avatar file
                        Storage::disk('public')->delete($picture);
                    }
                }

                $material->delete();
                return Redirect::route('director.space.materials')->with('message', 'Material Deleted Succesfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }

        } else {
            return Redirect::route('home');
        }

    }

    public function mise_material(Request $request, $id)
    {



        if (Auth::check()) {
            $material = Material::find($id);
            $lab = Lab::where('id', $material->lab_id)->first();

            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {


                // Validate the request data
                $data = $request->validate([

                    'name' => ['required', 'string', 'max:255'],
                    'use_case' => ['nullable', 'string'],
                    'reference' => ['required', 'string'],
                    'description' => ['required', 'string'],
                    'picture' => ['image', 'nullable', 'max:2048'], // Validate if the uploaded file is an image and its maximum size
                    'availability' => ['sometimes', 'boolean'],
                    'reservation_price' => ['nullable', 'numeric'],
                    'reservation_type' => ['required', 'string', 'max:255'],

                ]);


                if ($request->hasFile('picture')) {

                    // Get the full path to the avatar file
                    $picture = $material->picture;

                    // Check if the file exists in storage before attempting to delete it
                    if ($picture) {
                        // Delete the avatar file
                        Storage::disk('public')->delete($picture);
                    }


                    // Store the uploaded avatar file in the storage disk

                    $picture = $request->file('picture')->store("material/{$id}", 'public');

                    // Update the user's avatar field with the path
                    $material->picture = $picture;
                }

                //------------------------------------

                $material->name = $data['name'];
                $material->use_case = $data['use_case'];
                $material->reference = $data['reference'];
                $material->description = $data['description'];
                $material->availability = $data['availability'] ? '1' : '0';
                $material->reservation_price = $data['reservation_price'];
                $material->reservation_type = $data['reservation_type'];
                $material->update();
                return Redirect::route('director.space.materials')->with('message', 'Material Updated Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }

    }




    public function team_insert(Request $request, $id)
    {



        if (Auth::check()) {

            $lab = Lab::where('id', $id)->first();
            $teams_count = Team::where('lab_id', $lab->id)->count();

            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {

                if ($lab->type == "research_unit" || ($lab->type == "lab" && $teams_count <= 8)) {





                    // Validate the request data
                    $data = $request->validate([
                        'title' => ['required', 'string'],
                        'acronym_team_name' => ['required', 'string'],
                        'Keywords' => ['required', 'string'],
                        'theme_description' => ['required', 'string', 'max:255'],
                        'sub_research_area' => ['nullable', 'array'], // Attend un tableau
                        'sub_research_area.*' => ['string'], // Chaque élément du tableau doit être une chaîne
                    ]);






                    $team = new Team;



                    $team->lab_id = $id;
                    $team->title = $data['title'];

                    $team->acronym_team_name = $data['acronym_team_name'];


                    $team->Keywords = $data['Keywords'];

                    $team->theme_description = $data['theme_description'];

                    $team->sub_research_area = json_encode($data['sub_research_area']);
                    $team->save();



                    return Redirect::route('director.space.teams')->with('message', 'Team Added Succesfully');
                    ;
                } else {
                    return Redirect::route('director.space.home')->with('message', 'To add another team ,you should change the type of this lab to research unit');
                }
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }

    }



    public function team_manage($id)
    {


        if (Auth::check()) {


            $lab = Lab::where("director_id", Auth::user()->id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
            $domains = Domain::get();


            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {
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
                return Inertia::render('DirectorSpace/ManageTeam', [
                    'lab' => $lab,
                    'team' => $team,
                    'scientificProductions' => $scientificProductions,
                    'team_members' => $team_members,
                    'userRole' => $userRole,
                    'lab_members' => $lab_members,
                    'labs' => $labs,
                    'domains' => $domains,
                    'lab_members_all' => $lab_members_all,
                    'projects' => $projects,
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


    public function sup_team($id)
    {
        if (Auth::check()) {

            $team = Team::where('id', $id)->first();
            $phd_thesis = Phd_thesis::where('team_id', $id)->get();
            $team_members = Team_member::where('team_id', $id)->get();
            $lab = Lab::where('id', $team->lab_id)->first();


            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {

                foreach ($team_members as $item) {
                    $item->delete();
                }

                foreach ($phd_thesis as $item) {
                    $item->delete();
                }

                $team->delete();
                return Redirect::route('director.space.teams')->with('message', 'Team Deleted Succesfully');
                ;

            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
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
            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {



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
                return Redirect::route('director.space.teams')->with('message', 'Team updated Succesfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function add_project_index()
    {


        if (Auth::check()) {


            $lab = Lab::where("director_id", Auth::user()->id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {
                $teams = Team::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();


                //projet aw tab3 l lab mchi l team 
                //te3 team li lfog jsp leh zedtha 
                //verifi hed l function 


                // Fetch team members for each team
                foreach ($teams as $team) {
                    $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();



                }

                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('DirectorSpace/Partials/AddProject', [
                    'lab' => $lab,
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

    public function edit_project_index($id)
    {


        if (Auth::check()) {

            $project = Project::find($id);
            $lab = Lab::where("director_id", Auth::user()->id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {
                $teams = Team::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();


                //projet aw tab3 l lab mchi l team 
                //te3 team li lfog jsp leh zedtha 
                //verifi hed l function 


                // Fetch team members for each team
                foreach ($teams as $team) {
                    $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();



                }

                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('DirectorSpace/Partials/EditProject', [
                    'lab' => $lab,
                    'project' => $project,
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


    public function index($id)
    {


        if (Auth::check()) {



            $lab = Lab::where("director_id", Auth::user()->id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();




            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {


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

                $isProjectLeader = Project::where('id', $id)->where('project_leader_id', Auth::user()->id)->first();

                return Inertia::render('DirectorSpace/ManageProject', [
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
                    return Redirect::route('lab.project.manage', ['id' => $id])->with('message', 'report Added Succesfully');
                } else {
                    return Redirect::route('lab.project.manage', ['id' => $id])->with('message', 'a report is already added to this project');
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
                    return Redirect::route('lab.project.manage', ['id' => $id])->with('message', 'report Added Succesfully');
                } else {
                    return Redirect::route('lab.project.manage', ['id' => $id])->with('message', 'a report is already added to this project');
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


                return Redirect::route('lab.project.manage', ['id' => $project_personal_report->project_id])->with('message', 'report updated  Succesfully');


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


                return Redirect::route('lab.project.manage', ['id' => $project_global_report->project_id])->with('message', 'report updated  Succesfully');


            } else {
                return Redirect::route('home')->with('message', 'you are not the leader of this project');
            }
        } else {
            return Redirect::route('home');
        }

    }
    public function index2($id)
    {


        if (Auth::check()) {



            $lab = Lab::where("director_id", Auth::user()->id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
            $external_members = External_member::get();
            $isProductionMember = Scientific_production::where('id', $id)
                ->whereJsonContains('user_id_author', (string) Auth::user()->id)
                ->first();



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




                return Inertia::render('DirectorSpace/ManageProduction', [
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
                return Redirect::route('home')->with('message', 'You are not member of this Production');
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
                    return Redirect::route('director.space.scientific.productions', ['id' => $id])->with('message', 'Scientific Production Added Succesfully');
                } else {
                    return Redirect::route('director.space.scientific.productions', ['id' => $id])->with('message', 'Scientific Production Added Succesfully');
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
                return Redirect::route('lab.team.scientific.production.manage', ['id' => $id])->with('message', 'Scientific Production updated successfully');


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

                return Redirect::route('director.space.scientific.productions')->with('message', 'Scientific Production deleted successfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not authorized to modify this scientific production');
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

                return Redirect::route('lab.team.scientific.production.manage', ['id' => $id])->with('message', 'Author added successfully');
            } else {
                return Redirect::route('lab.team.scientific.production.manage', ['id' => $id])->with('message', 'You are not authorized to modify this scientific production');
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

                return Redirect::route('lab.team.scientific.production.manage', ['id' => $id])->with('message', 'Author removed successfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not authorized to modify this scientific production');
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

                return Redirect::route('lab.team.scientific.production.manage', ['id' => $id])->with('message', 'Author removed successfully');
            } else {
                return Redirect::route('/')->with('message', 'You are not authorized to modify this scientific production');
            }
        } else {
            return Redirect::route('home');
        }
    }




    public function project_insert(Request $request, $id)
    {

        if (Auth::check()) {
            $lab = Lab::where('id', $id)->first();
            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {


                // Validate the request data
                $data = $request->validate([
                    'project_leader_id' => ['required', 'numeric'],
                    'type' => ['nullable', 'string', 'max:255'],
                    'code' => ['nullable', 'string', 'max:255', Rule::unique('projects')],
                    'title' => ['required', 'string', 'max:255'],
                    'problematic' => ['nullable', 'string'],
                    'reference' => ['nullable', 'string'],
                    'objective' => ['nullable', 'string'],
                    'expected_results' => ['nullable', 'array'], // Attend un tableau
                    'expected_results.*' => ['string'], // Chaque élément du tableau doit être une chaîne
                    'keywords' => ['nullable', 'string', 'max:255'],
                    'methodology' => ['nullable', 'string'],
                    'material' => ['nullable', 'array'], // Attend un tableau
                    'material.*' => ['string'], // Chaque élément du tableau doit être une chaîne
                    'project_display' => ['sometimes', 'boolean'],

                ]);


                $project = new Project;

                $project->lab_id = $id;
                $project->project_leader_id = $data['project_leader_id'];
                $project->type = $data['type'];
                $project->code = $data['code'];
                $project->title = $data['title'];
                $project->problematic = $data['problematic'];
                $project->reference = $data['reference'];
                $project->objective = $data['objective'];
                $project->expected_results = json_encode($data['expected_results']);
                $project->keywords = $data['keywords'];
                $project->methodology = $data['methodology'];
                $project->material = json_encode($data['material']);
                $project->project_display = $data['project_display'] ? '1' : '0';
                $project->save();


                $project_member = new Project_member();
                $project_member->user_id = $data['project_leader_id'];
                $project_member->project_id = $project->id;
                $project_member->save();




                return Redirect::route('director.space.projects')->with('message', 'Project Added Succesfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function mise_project(Request $request, $id)
    {
        if (Auth::check()) {
            $project = Project::find($id);
            $lab = Lab::where('id', $project->lab_id)->first();

            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {

                // Validate the request data
                $data = $request->validate([
                    'project_leader_id' => ['required', 'numeric'],
                    'type' => ['nullable', 'string', 'max:255'],
                    'code' => [
                        'nullable',
                        'string',
                        'max:255',
                        Rule::unique('projects')->ignore($id) // Adjusted validation rule
                    ],
                    'title' => ['required', 'string', 'max:255'],
                    'problematic' => ['nullable', 'string'],
                    'reference' => ['nullable', 'string'],
                    'objective' => ['nullable', 'string'],
                    'expected_results' => ['nullable', 'array'], // Expects an array
                    'expected_results.*' => ['string'], // Each array element must be a string
                    'keywords' => ['nullable', 'string', 'max:255'],
                    'methodology' => ['nullable', 'string'],
                    'material' => ['nullable', 'array'], // Expects an array
                    'material.*' => ['string'], // Each array element must be a string
                    'project_display' => ['sometimes', 'boolean'],
                ]);

                $project->project_leader_id = $data['project_leader_id'];
                $project->type = $data['type'];
                $project->code = $data['code'];
                $project->title = $data['title'];
                $project->problematic = $data['problematic'];
                $project->reference = $data['reference'];
                $project->objective = $data['objective'];
                $project->expected_results = json_encode($data['expected_results']);
                $project->keywords = $data['keywords'];
                $project->methodology = $data['methodology'];
                $project->material = json_encode($data['material']);
                $project->project_display = $data['project_display'] ? '1' : '0';
                $project->update();
                return Redirect::route('lab.project.manage', ['id' => $id])->with('message', 'Project updated successfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }

        } else {
            return Redirect::route('home');
        }
    }


    public function sup_project($id)
    {
        if (Auth::check()) {
            $project = Project::find($id);
            $project_member = Project_member::where("project_id", $project->id)->get();
            $lab = Lab::where('id', $project->lab_id)->first();
            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {

                foreach ($project_member as $item) {
                    $item->delete();
                }

                $project->delete();

                return Redirect::route('director.space.projects')->with('message', 'Project deleted Succesfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function project_space_index()
    {


        if (Auth::check()) {


            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();



            $lab = Lab::where("id", $lab_member->lab_id)->first();

            $projects = Project::where('project_leader_id', Auth::user()->id)->get();



            if ($lab) {






                // Fetch team members for each team

                $userRole = Session::get('user_role'); // Get session variable
                return Inertia::render('ProjectLeaderSpace/Home', [
                    'lab' => $lab,
                    'projects' => $projects,
                    'userRole' => $userRole,
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

    //-------------------------------MEMBERSSSS team--------------------------------------------------------------------

    public function sup_team_member($id)
    {

        if (Auth::check()) {
            $team_member = Team_Member::find($id);
            $team = Team::where('id', $team_member->team_id)->first();
            $lab = Lab::where('id', $team->lab_id)->first();
            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {

                $team_member->delete();
                return Redirect::route('director.space.teams')->with('message', 'Member deleted Succesfully');


            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }



        } else {
            return Redirect::route('home');
        }

    }

    //-------------------------------MEMBERSSSS project--------------------------------------------------------------------


    public function sup_project_member($id, $projectId, $isExternal)
    {
        if (!Auth::check()) {
            return Redirect::route('home');
        }

        // Retrieve the project and lab details based on the member type
        if ($isExternal == 1) {
            $member = External_member::find($id);
            $project = Project::find($projectId);
            Log::info("message1");
        } else {
            $member = Project_member::find($id);
            $project = Project::where('id', $member->project_id)->first();
            Log::info("message2");
        }

        if (!$project) {
            return Redirect::route('home')->with('message', 'Project not found');
        }

        $lab = Lab::where('id', $project->lab_id)->first();

        // Check if the authenticated user is the director of the lab
        if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {
            if ($isExternal == 1) {
                Log::info("message3");
                // Handle deletion logic for external member
                $projectIds = json_decode($member->project_id, true);

                if (($key = array_search($projectId, $projectIds)) !== false) {
                    unset($projectIds[$key]);

                    // Update project_id field
                    $member->project_id = empty($projectIds) ? null : json_encode(array_values($projectIds));
                    $member->save();

                    $prMember = Project_member::where("user_id", $member->user_id)->first();
                    // Handle deletion logic for regular project member
                    $prMember->delete();

                    // Check if the request was made from /collaboration-space
                    $referer = url()->previous();
                    if (str_contains($referer, '/collaboration-space')) {
                        return Redirect::route('collaboration.space.project.view', ['id' => $project->id])
                            ->with('message', 'External project member deleted successfully');
                    }

                    return Redirect::route('lab.project.manage', ['id' => $projectId])
                        ->with('message', 'External project member deleted successfully');
                }

                return Redirect::route('lab.project.manage', ['id' => $projectId])
                    ->with('message', 'Project not found for this member');
            } else {
                // Handle deletion logic for regular project member
                $member->delete();

                // Check if the request was made from /collaboration-space
                $referer = url()->previous();
                if (str_contains($referer, '/collaboration-space')) {
                    return Redirect::route('collaboration.space.project.view', ['id' => $project->id])
                        ->with('message', 'Project member deleted successfully');
                }

                return Redirect::route('lab.project.manage', ['id' => $project->id])
                    ->with('message', 'Project member deleted successfully');
            }
        } else {
            return Redirect::route('home')->with('message', 'You are not the director of this lab');
        }
    }



    public function sup_no_project_member($id, $projectId)
    {
        if (Auth::check()) {
            $external_member = External_member::find($id);
            $project = Project::find($projectId);

            $lab = Lab::where('id', $project->lab_id)->first();

            // Check if the authenticated user is the director of the lab
            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {

                // Decode the project_id JSON field
                $projectIds = json_decode($external_member->project_id, true);

                // Check if $projectId exists in the array
                if (($key = array_search($projectId, $projectIds)) !== false) {
                    // Remove the project from the array
                    unset($projectIds[$key]);

                    // If the array is empty after removing the project, set project_id to null
                    if (empty($projectIds)) {
                        $external_member->project_id = null;
                    } else {
                        // Reindex the array and update the external_member
                        $external_member->project_id = json_encode(array_values($projectIds));
                    }

                    // Save the changes
                    $external_member->save();

                    return Redirect::route('lab.project.manage', ['id' => $projectId])
                        ->with('message', 'Project member deleted successfully');
                }

                return Redirect::route('lab.project.manage', ['id' => $projectId])
                    ->with('message', 'Project not found for this member');
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }
    }



    public function project_member_insert_in_lab(Request $request, $id)
    {
        if (Auth::check()) {
            $project = Project::find($id);
            $lab = Lab::where('id', $project->lab_id)->first();

            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {
                // Validate the request data
                $data = $request->validate([
                    'user_id' => ['nullable', 'numeric'],
                    'external_id' => ['nullable', 'numeric'],
                    'email' => 'nullable|string|lowercase|email|max:255|unique:' . User::class,
                    'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
                    'first_name' => ['nullable', 'string', 'max:255'],
                    'last_name' => ['nullable', 'string', 'max:255'],
                    'phone_number' => ['nullable', 'string', 'regex:/^0[0-9]{9}$/'],
                ]);

                $lab_m = Lab_member::where('user_id', $data['user_id'])->first();
                $external_member = External_member::where('user_id', $data['user_id'])->first();

                // Check if the project member already exists
                $existing_project_member = Project_member::where('project_id', $id)
                    ->where('user_id', $data['user_id'])
                    ->first();

                if ($existing_project_member) {
                    return back()->with(['message' => 'This project member already exists.']);
                } elseif ($external_member && $data['user_id']) {


                    $external_member->project_id = json_encode([$project->id]);
                    $external_member->is_project_member = 1;
                    $external_member->update();


                    $project_member = new Project_member;
                    $project_member->project_id = $id;
                    $project_member->user_id = $data['user_id'];
                    $project_member->save();

                    if ($lab_m) {
                        $lab_m->is_project_member = 1;
                        $lab_m->update();

                    }

                    return Redirect::route('lab.project.manage', ['id' => $id])->with('message', 'Member added Succesfully');
                } elseif (!$external_member && $data['user_id']) {

                    $project_member = new Project_member;
                    $project_member->project_id = $id;
                    $project_member->user_id = $data['user_id'];
                    $project_member->save();

                    if ($lab_m) {
                        $lab_m->is_project_member = 1;
                        $lab_m->update();

                    }

                    return Redirect::route('lab.project.manage', ['id' => $id])->with('message', 'Member added Succesfully');
                } elseif (!$external_member && $data['external_id']) {



                    $ExternalProjectMember = External_member::find($data['external_id']);

                    // Decode the existing project_id JSON to an array
                    $existingProjectIds = json_decode($ExternalProjectMember->project_id, true) ?? [];

                    // Check if the project ID already exists in the array
                    if (in_array($project->id, $existingProjectIds)) {
                        // If the project ID exists, return the route without making changes
                        return Redirect::route('lab.project.manage', ['id' => $id])
                            ->with('message', 'Project already exists for this member');
                    }

                    // If the project ID does not exist, add it to the array
                    $existingProjectIds[] = $project->id;

                    // Encode the updated array back to JSON and save it
                    $ExternalProjectMember->project_id = json_encode($existingProjectIds);
                    $ExternalProjectMember->is_project_member = 1;

                    $ExternalProjectMember->save();

                    $project_member = new Project_member;
                    $project_member->project_id = $id;
                    $project_member->user_id = $ExternalProjectMember->user_id;
                    $project_member->save();

                    return Redirect::route('lab.project.manage', ['id' => $id])
                        ->with('message', 'Member added successfully');
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



                    $ExternalProjectMember = new External_member;

                    $ExternalProjectMember->project_id = json_encode([$project->id]);
                    $ExternalProjectMember->is_project_member = 1;
                    $ExternalProjectMember->user_id = $user->id;
                    $ExternalProjectMember->save();


                    $project_member = new Project_member;
                    $project_member->project_id = $id;
                    $project_member->user_id = $user->id;
                    $project_member->save();


                    return Redirect::route('lab.project.manage', ['id' => $id])->with('message', 'Member added Succesfully');

                } else {
                    return Redirect::route('home')->with('message', 'Something wrong in this operation , try again');
                }
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function add_activity_index()
    {


        if (Auth::check()) {


            $lab = Lab::where("director_id", Auth::user()->id)->first();



            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {


                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('DirectorSpace/Partials/AddActivity', [
                    'lab' => $lab,
                    'userRole' => $userRole,
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

    public function scientific_activity_insert(Request $request, $id)
    {



        if (Auth::check()) {

            $lab = Lab::find($id);
            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {


                // Validate the request data
                $data = $request->validate([
                    'title' => ['required', 'string', 'max:255'],
                    'description' => ['required', 'string'],
                ]);


                $scientific_activity = new Scientific_activity;


                $scientific_activity->lab_id = $id;
                $scientific_activity->title = $data['title'];
                $scientific_activity->description = $data['description'];
                $scientific_activity->save();
                return Redirect::route('director.spacescientific.activities')->with('message', 'Scientific Activity Added Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function sup_scientific_activity($id)
    {
        if (Auth::check()) {

            $scientific_activity = Scientific_activity::find($id);
            $lab = Lab::where('id', $scientific_activity->lab_id)->first();

            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {

                $scientific_activity->delete();

                return Redirect::route('director.spacescientific.activities')->with('message', 'Scientific Activity Deleted Succesfully');

            } else {
                return Redirect::route('home')->with('message', 'you are not the director of this lab');
            }

        } else {
            return Redirect::route('home');
        }

    }

    public function mise_scientific_activity(Request $request, $id)
    {



        if (Auth::check()) {
            $scientific_activity = Scientific_activity::find($id);
            $lab = Lab::where('id', $scientific_activity->lab_id)->first();

            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {


                // Validate the request data
                $data = $request->validate([

                    'title' => ['required', 'string', 'max:255'],
                    'description' => ['required', 'string'],

                ]);


                $scientific_activity->title = $data['title'];
                $scientific_activity->description = $data['description'];
                $scientific_activity->update();
                return Redirect::route('director.spacescientific.activities')->with('message', 'Scientific Activity Updated Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }

    }

    //-------------------------------LAB-------------------------------------------

    public function mise_lab(request $request, $id)
    {

        if (Auth::check()) {
            $lab = Lab::find($id);
            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {



                // Validate the request data
                $data = $request->validate([
                    'type' => ['required', 'string'],
                    'domain_id' => ['required', 'array'], // Attend un tableau
                    'domain_id.*' => ['numeric'], // Chaque élément du tableau doit être une chaîne
                    'speciality_id' => ['nullable', 'array'], // Attend un tableau
                    'speciality_id.*' => ['numeric'], // Chaque élément du tableau doit être une chaîne
                    'title' => ['required', 'string'],
                    'acronym_lab_name' => ['required', 'string'],
                    'creation_date' => ['required', 'date'], // Ensure it's a valid date format
                    'date_appointment' => ['required', 'date'], // Ensure it's a valid date format
                    'previous_director' => ['required', 'string', 'max:255'], // Max length of 255 characters
                    'e_adresse' => ['required', 'email'], // Ensure it's a valid email address
                    'tlp' => ['required', 'numeric'],
                    'presentation' => ['required'],
                    'research_objectives' => ['required'],
                    'Keywords' => ['nullable'],
                    'maps' => ['nullable', 'array'], // Attend un tableau
                    'maps.*' => ['numeric'], // Chaque élément du tableau doit être une chaîne
                ]);









                $specialities = Speciality::whereIn('id', $data['speciality_id'])->pluck('name');
                $domains = Domain::whereIn('id', $data['domain_id'])->pluck('name');

                $lab->title = $data['title'];
                $lab->acronym_lab_name = $data['acronym_lab_name'];
                $lab->director_id = Auth::user()->id;
                $lab->type = $data['type'];

                $lab->domain = json_encode($domains);
                $lab->speciality = json_encode($specialities);

                $lab->creation_date = $data['creation_date'];
                $lab->date_appointment = $data['date_appointment'];
                $lab->previous_director = $data['previous_director'];
                $lab->e_adresse = $data['e_adresse'];
                $lab->tlp = $data['tlp'];
                $lab->presentation = $data['presentation'];
                $lab->research_objectives = $data['research_objectives'];
                $lab->Keywords = $data['Keywords'];

                $lab->maps = json_encode($data['maps']);

                $lab->update();



                return Redirect::route('director.space.home')->with('message', 'Lab Updated Succesfully');
            } else {
                return Redirect::route('director.space.home')->with('message', 'You are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function mise_lab_pic(request $request, $id)
    {

        if (Auth::check()) {
            $lab = Lab::find($id);
            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {

                $request->validate([
                    'picture' => ['image', 'nullable', 'max:2048'], // Validate if the uploaded file is an image and its maximum size
                ]);



                // Handle avatar upload if provided
                if ($request->hasFile('picture')) {

                    // Get the full path to the avatar file
                    $backgroundPhotoPath = $lab->picture;

                    // Check if the file exists in storage before attempting to delete it
                    if ($backgroundPhotoPath) {
                        // Delete the avatar file
                        Storage::disk('public')->delete($backgroundPhotoPath);
                    }


                    // Store the uploaded avatar file in the storage disk

                    $backgroundPhotoPath = $request->file('picture')->store("Lab photo/{$id}", 'public');

                    // Update the user's avatar field with the path
                    $lab->picture = $backgroundPhotoPath;
                }




                $lab->update();
                return Redirect::route('director.space.home')->with('message', 'Lab Picture Updated Succesfully');
            } else {
                return Redirect::route('director.space.home')->with('message', 'You are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function service_insert(Request $request, $id)
    {



        if (Auth::check()) {

            $lab = Lab::find($id);
            if (Auth::user()->id == $lab->director_id && Auth::user()->director == 1) {


                // Validate the request data
                $data = $request->validate([
                    'title' => ['required', 'string', 'max:255'],
                    'description' => ['required', 'string'],
                    'price' => ['nullable', 'numeric'],
                    'category' => ['nullable', 'string', 'max:255'],
                    'Keywords' => ['nullable', 'string'],
                    'duration' => ['nullable', 'numeric'],
                    'requirements' => ['required', 'string'],
                    'availability' => ['required', 'numeric'],
                    'picture' => ['image', 'nullable'], // Validate if the uploaded file is an image and its maximum size

                ]);


                $service = new Service;




                if ($request->hasFile('picture')) {

                    $picture = $request->file('picture')->store("service/{$id}", 'public');
                    $service->picture = $picture;
                }
                $service->lab_id = $id;
                $service->title = $data['title'];
                $service->description = $data['description'];
                $service->price = $data['price'];
                $service->category = $data['category'];
                $service->Keywords = $data['Keywords'];
                $service->duration = $data['duration'];
                $service->requirements = $data['requirements'];
                $service->availability = $data['availability'];
                $service->save();
                return Redirect::route('director.space.services')->with('message', 'Service Added Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function sup_service($id)
    {
        if (Auth::check()) {

            $service = Service::find($id);
            $lab = Lab::where('id', $service->lab_id)->first();

            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {

                if ($service->picture) {

                    // Get the full path to the avatar file
                    $picture = $service->picture;

                    // Check if the file exists in storage before attempting to delete it
                    if ($picture) {
                        // Delete the avatar file
                        Storage::disk('public')->delete($picture);
                    }
                }

                $service->delete();
                return Redirect::route('director.space.services')->with('message', 'Service Deleted Succesfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function mise_service(Request $request, $id)
    {



        if (Auth::check()) {
            $service = Service::find($id);
            $lab = Lab::where('id', $service->lab_id)->first();

            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {


                // Validate the request data
                $data = $request->validate([

                    'title' => ['required', 'string', 'max:255'],
                    'description' => ['required', 'string'],
                    'price' => ['nullable', 'numeric'],
                    'category' => ['nullable', 'string', 'max:255'],
                    'Keywords' => ['nullable', 'string'],
                    'duration' => ['nullable', 'numeric'],
                    'requirements' => ['required', 'string'],
                    'availability' => ['required', 'numeric'],
                    'picture' => ['nullable', 'image'], // Validate if the uploaded file is an image and its maximum size

                ]);


                if ($request->hasFile('picture')) {

                    // Get the full path to the avatar file
                    $picture = $service->picture;

                    // Check if the file exists in storage before attempting to delete it
                    if ($picture) {
                        // Delete the avatar file
                        Storage::disk('public')->delete($picture);
                    }


                    // Store the uploaded avatar file in the storage disk

                    $picture = $request->file('picture')->store("service/{$id}", 'public');

                    // Update the user's avatar field with the path
                    $service->picture = $picture;
                }

                //------------------------------------

                $service->title = $data['title'];
                $service->description = $data['description'];
                $service->price = $data['price'];
                $service->category = $data['category'];
                $service->Keywords = $data['Keywords'];
                $service->duration = $data['duration'];
                $service->requirements = $data['requirements'];
                $service->availability = $data['availability'];
                $service->update();
                return Redirect::route('director.space.services')->with('message', 'Service Updated Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function service_requests_index()
    {
        $lab = Lab::where("director_id", Auth::user()->id)->first();

        $services = Service::where('lab_id', $lab->id)->get();
        $serviceIds = $services->pluck('id');

        $exist_service_requests = Exist_service_request::whereIn('service_id', $serviceIds)->where('request', 'pending')->get();
        $labId = $lab->id; // The lab ID you are checking for

        $service_requests = Service_request::whereJsonContains('request', [$labId => 'pending'])->get();

        $service_requests_not = Notification::where('read', false)
            ->whereIn('type', ['service_request', 'exist_service_request'])
            ->where(function ($query) use ($labId) {
                $query->where('lab_id', $labId);
            })
            ->update(['read' => true]);




        $labs = Lab::all();
        $establishments = Establishment::all();
        $domains = Domain::all();

        return Inertia::render('DirectorSpace/ServicesRequests', [
            'lab' => $lab,
            'services' => $services,
            'exist_service_requests' => $exist_service_requests,
            'service_requests' => $service_requests,
            'labs' => $labs,
            'establishments' => $establishments,
            'domains' => $domains,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }




    public function accept_exist_service_request(Request $request, $id)
    {
        if (Auth::check()) {

            $exist_service_request = Exist_service_request::find($id);
            $service = Service::where('id', $exist_service_request->service_id)->first();
            $lab = Lab::where('id', $service->lab_id)->first();
            $user = User::findOrFail($exist_service_request->user_id);


            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {


                // Validate the request data
                $data = $request->validate([
                    'lab_service_accept_answer' => ['required', 'string'],
                    'lab_answer_duration' => ['nullable', 'regex:/^\d{1,2}h\s?\d{1,2}min$/'],


                    'lab_answer_requirements' => ['nullable', 'string'],
                    'lab_comments' => ['nullable', 'string'],
                    'contact_message' => ['nullable', 'string'],
                ]);

                $exist_service_request->request = 'accepted';
                $exist_service_request->lab_service_accept_answer = $data['lab_service_accept_answer'];
                $exist_service_request->lab_answer_duration = $data['lab_answer_duration'];
                $exist_service_request->lab_answer_requirements = $data['lab_answer_requirements'];
                $exist_service_request->lab_comments = $data['lab_comments'];
                $exist_service_request->contact_message = $data['contact_message'];


                $notification = new Notification();
                $notification->user_id = $exist_service_request->user_id;
                $notification->service_id = $service->id;
                $notification->exist_service_request_id = $exist_service_request->id;
                $notification->type = "exist_service_request_accept";
                $notification->message = "Dear Mr./Ms. " . $user->first_name . " " . $user->last_name . ", your request for the service \"" . $service->title . "\" has been accepted. Please check your requests for more details. Thank you for your trust.";
                $notification->save();


                // Enregistrer la demande de service
                $exist_service_request->update();

                return Redirect::route('service.requests.index')->with('message', 'Service Request accepted Successfully');
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function reject_exist_service_request($id)
    {
        if (Auth::check()) {

            $exist_service_request = Exist_service_request::find($id);
            $service = Service::where('id', $exist_service_request->service_id)->first();
            $lab = Lab::where('id', $service->lab_id)->first();
            $user = User::findOrFail($exist_service_request->user_id);


            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {



                $exist_service_request->request = 'rejected';


                $notification = new Notification();
                $notification->user_id = $exist_service_request->user_id;
                $notification->service_id = $service->id;
                $notification->exist_service_request_id = $exist_service_request->id;
                $notification->type = "exist_service_request_reject";
                $notification->message = "Dear Mr./Ms. " . $user->first_name . " " . $user->last_name . ", your request for the service \"" . $service->title . "\" has been rejected. Please check your requests for more details. Thank you for your trust.";
                $notification->save();


                // Enregistrer la demande de service
                $exist_service_request->update();

                return Redirect::route('service.requests.index')->with('message', 'Service Request rejected Successfully');
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }
    }



    public function accept_service_request(Request $request, $id)
    {
        if (Auth::check()) {
            $lab = Lab::where('director_id', Auth::user()->id)->first();
            $service_request = Service_request::findOrFail($id);
            $user = User::findOrFail($service_request->user_id);

            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {
                // Validation des données du formulaire
                $data = $request->validate([
                    'lab_answer_title' => ['required', 'string'],
                    'lab_service_accept_answer' => ['required', 'string'],
                    'lab_answer_price' => ['nullable', 'numeric'],
                    'lab_answer_duration' => ['nullable', 'regex:/^\d{1,2}h\s?\d{1,2}min$/'],
                    'lab_answer_requirements' => ['nullable', 'string'],
                    'lab_comments' => ['nullable', 'string'],
                ]);

                // Passer les réponses et le statut à la méthode respondToRequest
                $service_request->respondToRequest($lab->id, 'accepted', $data);

                $notification = new Notification();
                $notification->user_id = $service_request->user_id;
                $notification->lab_id = $lab->id;
                $notification->service_request_id = $service_request->id;
                $notification->type = "service_request_accept";
                $notification->message = "Dear Mr./Ms. " . $user->first_name . " " . $user->last_name . ", your request for the service \"" . $service_request->title . "\" has been accepted. Please check your requests for more details. Thank you for your trust.";
                $notification->save();

                return Redirect::route('service.requests.index')->with('message', 'Service Request accepted.');
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab.');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function reject_service_request(Request $request, $id)
    {

        if (Auth::check()) {


            $lab = Lab::where('director_id', Auth::user()->id)->first();
            $service_request = Service_request::findOrFail($id);
            $user = User::findOrFail($service_request->user_id);


            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {


                $service_request->respondToRequest($lab->id, 'rejected', null);

                $notification = new Notification();
                $notification->user_id = $service_request->user_id;
                $notification->lab_id = $lab->id;
                $notification->service_request_id = $service_request->id;
                $notification->type = "service_request_reject";
                $notification->message = "Dear Mr./Ms. " . $user->first_name . " " . $user->last_name . ", your request for the service \"" . $service_request->title . "\" has been rejected. Please check your requests for more details. Thank you for your trust.";
                $notification->save();

                return Redirect::route('service.requests.index')->with('message', 'Request refused.');
            } else {
                return Redirect::route('home')->with('message', 'you are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function update_accept_service_request_informations(Request $request, $id)
    {
        if (Auth::check()) {
            // Récupérer le laboratoire dirigé par l'utilisateur authentifié
            $lab = Lab::where('director_id', Auth::user()->id)->first();
            $service_request = Service_request::findOrFail($id);
            $user = User::findOrFail($service_request->user_id);

            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {
                // Vérifier si le laboratoire a déjà accepté la demande
                $currentRequestStatus = $service_request->request[$lab->id] ?? null;
                if ($currentRequestStatus !== 'accepted') {
                    return Redirect::route('service.requests.index')
                        ->with('message', 'You cannot update this request because it has not been accepted yet.');
                }

                // Validation des données du formulaire
                $data = $request->validate([
                    'lab_answer_title' => ['required', 'string'],
                    'lab_service_accept_answer' => ['required', 'string'],
                    'lab_answer_price' => ['nullable', 'numeric'],
                    'lab_answer_duration' => ['nullable', 'regex:/^\d{1,2}h\s?\d{1,2}min$/'],
                    'lab_answer_requirements' => ['nullable', 'string'],
                    'lab_comments' => ['nullable', 'string'],
                ]);

                // Mettre à jour les réponses dans les colonnes correspondantes
                $service_request->respondToRequest($lab->id, 'accepted', $data);

                // Créer une notification pour informer l'utilisateur de la mise à jour
                $notification = new Notification();
                $notification->user_id = $service_request->user_id;
                $notification->lab_id = $lab->id;
                $notification->service_request_id = $service_request->id;
                $notification->type = "service_request_accept_update";
                $notification->message = "Dear Mr./Ms. " . $user->first_name . " " . $user->last_name . ", the director of the lab for the service \"" . $service_request->title . "\" has updated the details of accepting your request. Please check your requests for more details. Thank you for your trust.";
                $notification->save();

                return Redirect::route('service.requests.index')->with('message', 'Service Request information updated successfully.');
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab.');
            }
        } else {
            return Redirect::route('home');
        }
    }





}
