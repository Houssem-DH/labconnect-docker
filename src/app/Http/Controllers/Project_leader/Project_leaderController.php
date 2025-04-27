<?php

namespace App\Http\Controllers\Project_leader;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use App\Models\Lab_member;
use App\Models\Lab;
use App\Models\Project_global_report;
use App\Models\Project_personal_report;
use App\Models\Project;
use App\Models\team_member;
use Illuminate\Validation\Rule;
use App\Models\User;
use Illuminate\Validation\Rules;
use App\Models\External_member;
use App\Models\Project_member;
use App\Models\Material;
use App\Models\Faculty;

use App\Models\Scientific_production;
use App\Models\Team;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\Notification;
use App\Models\Establishment;
use App\Models\Domain;
use App\Models\Phd_thesis;
use Illuminate\Support\Facades\Log;
use Session;








class Project_leaderController extends Controller
{


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

                return Inertia::render('ProjectLeaderSpace/Home', [
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
                return Inertia::render('ProjectLeaderSpace/Members', [
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
                return Inertia::render('ProjectLeaderSpace/Teams', [
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
                return Inertia::render('ProjectLeaderSpace/Materials', [
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
    public function projects()
    {

        if (Auth::check()) {
            $lab_member = Lab_member::where('user_id', Auth::user()->id)->where('project_leader', 1)->first();
            if ($lab_member) {

                $projects = Project::where('project_leader_id', Auth::user()->id)->with("user")->get();


                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render(
                    'ProjectLeaderSpace/Projects',
                    [
                        'projects' => $projects,
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









    public function project_index($id)
    {


        if (Auth::check()) {


            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();
            $lab = Lab::where("id", $lab_member->lab_id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
            $projectDetails = Project::where('id', $id)->first();


            if ($projectDetails->project_leader_id == Auth::user()->id) {

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

                $userRole = Session::get('user_role'); // Get session variable
                return Inertia::render('ProjectLeaderSpace/ManageProject', [
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
                    'userRole' => $userRole,
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



    public function edit_project_index($id)
    {


        if (Auth::check()) {

            $project = Project::find($id);
            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();

            $lab = Lab::where("id", $lab_member->lab_id)->first();
            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

            if ($lab && $project) {
                $teams = Team::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();


                //projet aw tab3 l lab mchi l team 
                //te3 team li lfog jsp leh zedtha 
                //verifi hed l function 


                // Fetch team members for each team
                foreach ($teams as $team) {
                    $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();



                }

                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('ProjectLeaderSpace/Partials/EditProject', [
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






    public function mise_project(Request $request, $id)
    {
        if (Auth::check()) {
            $project = Project::find($id);
            $lab = Lab::where('id', $project->lab_id)->first();

            if ($project->project_leader_id == Auth::user()->id) {

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
                return Redirect::route('project.leader.project.manage', ['id' => $id])->with('message', 'Project updated successfully');

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

            if ($project->project_leader_id == Auth::user()->id) {
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

                    return Redirect::route('project.leader.project.manage', ['id' => $id])->with('message', 'Member added Succesfully');
                } elseif (!$external_member && $data['user_id']) {

                    $project_member = new Project_member;
                    $project_member->project_id = $id;
                    $project_member->user_id = $data['user_id'];
                    $project_member->save();

                    if ($lab_m) {
                        $lab_m->is_project_member = 1;
                        $lab_m->update();

                    }

                    return Redirect::route('project.leader.project.manage', ['id' => $id])->with('message', 'Member added Succesfully');
                } elseif (!$external_member && $data['external_id']) {



                    $ExternalProjectMember = External_member::find($data['external_id']);

                    // Decode the existing project_id JSON to an array
                    $existingProjectIds = json_decode($ExternalProjectMember->project_id, true) ?? [];

                    // Check if the project ID already exists in the array
                    if (in_array($project->id, $existingProjectIds)) {
                        // If the project ID exists, return the route without making changes
                        return Redirect::route('project.leader.project.manage', ['id' => $id])
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

                    return Redirect::route('project.leader.project.manage', ['id' => $id])
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


                    return Redirect::route('project.leader.project.manage', ['id' => $id])->with('message', 'Member added Succesfully');

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


   



















    public function  project_member_delete($id, $projectId , $isExternal )
    {
        if (!Auth::check()) {
            return Redirect::route('home');
        }




        // Retrieve the project and lab details based on the member type
        if ($isExternal==1) {
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
        if ($project->project_leader_id == Auth::user()->id) {
            if ($isExternal==1) {
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

                    return Redirect::route('project.leader.project.manage', ['id' => $projectId])
                        ->with('message', 'External project member deleted successfully');
                }

                return Redirect::route('project.leader.project.manage', ['id' => $projectId])
                    ->with('message', 'Project not found for this member');
            } else {
                // Handle deletion logic for regular project member
                $member->delete();

                return Redirect::route('project.leader.project.manage', ['id' => $project->id])
                    ->with('message', 'Project member deleted successfully');
            }
        } else {
            return Redirect::route('home')->with('message', 'You are not the director of this lab');
        }

    }

    

    public function sup_no_project_member($id, $projectId)
    {
        if (Auth::check()) {

            $project = Project::where('id', $projectId)->first();



            $external_member = External_member::find($id);



            // Check if the authenticated user is the director of the lab
            if ($project->project_leader_id == Auth::user()->id) {

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

                    return Redirect::route('project.leader.project.manage', ['id' => $projectId])
                        ->with('message', 'Project member deleted successfully');
                }

                return Redirect::route('project.leader.project.manage', ['id' => $projectId])
                    ->with('message', 'Project not found for this member');
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


            if ($project->project_leader_id == Auth::user()->id) {


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
                    // Check if the project has a labs_id set
                    if ($project && $project->labs_id) {
                        return Redirect::route('collaboration.space.project.view', ['id' => $id])
                            ->with('message', 'Report added successfully.');
                        // Redirect to the project manage page with a success message

                    } else {
                        // Redirect to the collaboration space project view page with a success message
                        return Redirect::route('project.leader.project.manage', ['id' => $id])
                            ->with('message', 'Report added successfully.');
                    }

                } else {
                    return Redirect::route('project.leader.project.manage', ['id' => $id])->with('message', 'a report is already added to this project');
                }

            } else {
                return Redirect::route('home')->with('message', 'you are not the leader of this project');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function mise_project_global_report(Request $request, $id)
    {



        if (Auth::check()) {

            $project_global_report = Project_global_report::where('id', $id)->first();
            $project = Project::where('id', $project_global_report->project_id)->first();




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

                if ($project && $project->labs_id) {
                    return Redirect::route('collaboration.space.project.view', ['id' => $project->id])
                        ->with('message', 'report updated  Succesfully.');
                    // Redirect to the project manage page with a success message

                } else {
                    // Redirect to the collaboration space project view page with a success message
                    return Redirect::route('project.leader.project.manage', ['id' => $project->id])
                        ->with('message', 'report updated  Succesfully.');
                }
                


            } else {
                return Redirect::route('home')->with('message', 'you are not the leader of this project');
            }
        } else {
            return Redirect::route('home');
        }

    }

    public function sup_project_global_report($id)
    {
        if (Auth::check()) {

            $project_global_report = Project_global_report::find($id);
            $project = Project::where('id', $project_global_report->poject_id)->first();
            $lab = Lab::where('id', $project->lab_id)->first();


            if ($project->project_leader_id == Auth::user()->id) {


                $project_global_report->delete();
                return Redirect::route('project.leader.project.manage', ['id' => $id])->with('message', 'report deleted Succesfully');

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


                    if ($project && $project->labs_id) {
                        return Redirect::route('collaboration.space.project.view', ['id' => $id])
                            ->with('message', 'report Added Succesfully.');
                        // Redirect to the project manage page with a success message
    
                    } else {
                        // Redirect to the collaboration space project view page with a success message
                        return Redirect::route('project.leader.project.manage', ['id' => $id])
                            ->with('message', 'report Added Succesfully.');
                    }

                    
                } else {
                    return Redirect::route('project.leader.project.manage', ['id' => $id])->with('message', 'a report is already added to this project');
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

            $project_personal_report = Project_personal_report::where('id', $id)->first();
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


                if ($project && $project->labs_id) {
                    return Redirect::route('collaboration.space.project.view', ['id' => $project->id])
                        ->with('message', 'report updated  Succesfully.');
                    // Redirect to the project manage page with a success message

                } else {
                    // Redirect to the collaboration space project view page with a success message
                    return Redirect::route('project.leader.project.manage', ['id' => $project->id])
                        ->with('message', 'report updated  Succesfully.');
                }

               


            } else {
                return Redirect::route('home')->with('message', 'you are not a member of this project');
            }
        } else {
            return Redirect::route('home');
        }

    }


}
