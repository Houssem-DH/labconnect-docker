<?php

namespace App\Http\Controllers\Collaboration;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Notification;
use App\Models\Lab;
use App\Models\Project;
use App\Models\Team;
use App\Models\Phd_thesis;
use App\Models\Lab_member;
use App\Models\External_member;
use App\Models\Establishment;
use App\Models\Domain;
use App\Models\Project_member;
use App\Models\Project_global_report;
use App\Models\Project_personal_report;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;










class CollaborationController extends Controller
{
    public function collaboration_space_home_index()
    {

        Notification::where('created_at', '<', Carbon::now()->subMonth())->delete();

        if (Auth::check()) {
            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();
            $external_member = External_member::where('user_id', Auth::user()->id)->first();



            if (Auth::user()->director == 1) {





                // Find the lab where the current user is the director
                $lab = Lab::where('director_id', Auth::user()->id)->first();

                if (!$lab) {
                    return Redirect::route('home')->with('message', 'Lab not found or you are not the director.');
                }

                if (Auth::user()->director == 1 && $lab) {
                    // Find the collaboration space related to the lab


                    $labId = $lab->id;


                    $projects_count = Project::whereRaw("invitations->'{$labId}' IS NOT NULL")
                        ->whereRaw("invitations->> '{$labId}' = 'pending'")
                        ->count();


                    $user = Auth::user()->id;
                    $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                        ->whereRaw("invitations->> '{$user}' = 'pending'")
                        ->count();


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/Home', [
                        'lab' => $lab,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'projects_count' => $projects_count,
                        'phd_thesis_count' => $phd_thesis_count,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);

                }


                // Return the data to Inertia for display

            } elseif ($lab_member->project_leader == 1) {
                $project = Project::where('project_leader_id', Auth::user()->id)
                    ->whereNotNull('labs_id')
                    ->get();


                if (!$project) {
                    return Redirect::route('home')->with('message', 'You are not a project leader.');
                }

                if ($project) {
                    // Find the collaboration space related to the lab


                    //$labId = $lab->id;






                    $user = Auth::user()->id;
                    $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                        ->whereRaw("invitations->> '{$user}' = 'pending'")
                        ->count();



                    Log::info($phd_thesis_count);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/Home', [
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'project' => $project,
                        'phd_thesis_count' => $phd_thesis_count,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);

                }



            } elseif (
                ($lab_member && $lab_member->is_supervisor == 1) ||
                ($external_member && $external_member->is_supervisor == 1) ||
                ($lab_member && $lab_member->is_co_supervisor == 1) ||
                ($external_member && $external_member->is_co_supervisor == 1)
            ) {


                // Find the collaboration space related to the lab


                //$labId = $lab->id;






                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();


                return Inertia::render('CollaborationSpace/Home', [
                    //'lab' => $lab,
                    'phd_thesis_count' => $phd_thesis_count,
                    'lab_member' => $lab_member,
                    'external_member' => $external_member,
                    //'project' => $project,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);






            } elseif ($lab_member->phd_student == 1) {


                // Find the collaboration space related to the lab


                //$labId = $lab->id;


                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();


                return Inertia::render('CollaborationSpace/Home', [
                    //'lab' => $lab,
                    'phd_thesis_count' => $phd_thesis_count,
                    'lab_member' => $lab_member,
                    'external_member' => $external_member,
                    //'project' => $project,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);






            } elseif ($lab_member || $external_member) {


                // Find the collaboration space related to the lab


                //$labId = $lab->id;



                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();


                return Inertia::render('CollaborationSpace/Home', [
                    //'lab' => $lab,
                    'phd_thesis_count' => $phd_thesis_count,
                    'lab_member' => $lab_member,
                    'external_member' => $external_member,
                    //'project' => $project,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);






            } else {
                return Redirect::route('home')->with('message', 'Access denied.');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function collaboration_space_projects_index()
    {
        Notification::where('created_at', '<', Carbon::now()->subMonth())->delete();
        if (Auth::check()) {

            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();
            $external_member = External_member::where('user_id', Auth::user()->id)->first();

            if (Auth::user()->director == 1) {

                // Find the lab where the current user is the director
                $lab = Lab::where('director_id', Auth::user()->id)->first();
                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();


                $labId = $lab->id;

                $projects_count = Project::whereRaw("invitations->'{$labId}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$labId}' = 'pending'")
                    ->count();

                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();




                if (!$lab) {
                    return Redirect::route('home')->with('message', 'Lab not found or you are not the director.');
                }

                if (Auth::user()->director == 1 && $lab) {
                    // Find the collaboration space related to the lab
                    $lab_projects = Project::whereJsonContains('labs_id', (string) $lab->id)->with('user')->get();

                    $leader_projects = Project::where('project_leader_id', Auth::user()->id)
                        ->whereNotNull('labs_id')
                        ->get();


                    $projectMemberIds = Project_member::where('user_id', Auth::user()->id)->pluck('project_id');

                    // Récupérer les projets correspondant à ces IDs
                    $member_projects = Project::whereIn('id', $projectMemberIds)->whereNotNull('labs_id')->get();





                    Log::info($lab_projects);


                    return Inertia::render('CollaborationSpace/Projects', [

                        'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'lab_projects' => $lab_projects,
                        'leader_projects' => $leader_projects,
                        'member_projects' => $member_projects,
                        'lab_members_all' => $lab_members_all,
                        'lab_members' => $lab_members,
                        'projects_count' => $projects_count,
                        'phd_thesis_count' => $phd_thesis_count,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);


                }

            } elseif ($lab_member->project_leader == 1) {

                $member = Lab_member::where('user_id', Auth::user()->id)->first();
                $lab = Lab::where('id', $member->lab_id)->first();



                $leader_projects = Project::where('project_leader_id', Auth::user()->id)
                    ->whereNotNull('labs_id')->with('user')
                    ->get();

                $projectMemberIds = Project_member::where('user_id', Auth::user()->id)->pluck('project_id');

                // Récupérer les projets correspondant à ces IDs
                $member_projects = Project::whereIn('id', $projectMemberIds)->whereNotNull('labs_id')->get();




                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();


                //$labId = $lab->id;




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$leader_projects && !$member_projects) {
                    return Redirect::route('home')->with('message', 'Acess denied.');
                }

                if ($leader_projects || $member_projects) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::whereJsonContains('labs_id', (string) $lab->id)->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/Projects', [

                        'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        //'projects' => $projects,
                        'lab_members_all' => $lab_members_all,
                        'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'leader_projects' => $leader_projects,
                        'member_projects' => $member_projects,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }


            } elseif (
                ($lab_member && $lab_member->is_supervisor == 1) ||
                ($external_member && $external_member->is_supervisor == 1) ||
                ($lab_member && $lab_member->is_co_supervisor == 1) ||
                ($external_member && $external_member->is_co_supervisor == 1)
            ) {

                // Récupérer les IDs des projets auxquels l'utilisateur est membre
                $projectMemberIds = Project_member::where('user_id', Auth::user()->id)->pluck('project_id');

                // Récupérer les projets correspondant à ces IDs
                $member_projects = Project::whereIn('id', $projectMemberIds)->whereNotNull('labs_id')->with('user')->get();


                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                $lab_members = Lab_member::with('user')->where('lab_id', $lab_member->id)->orderBy('created_at', 'desc')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();


                //$labId = $lab->id;





                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$member_projects) {
                    return Redirect::route('home')->with('message', 'You are not a member in a collaboration project .');
                }

                if ($member_projects) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::whereJsonContains('labs_id', (string) $lab->id)->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/Projects', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        //'projects' => $projects,
                        'lab_members_all' => $lab_members_all,
                        'projectMemberIds' => $projectMemberIds,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'member_projects' => $member_projects,
                        'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        //'project' => $project,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } elseif ($lab_member->phd_student == 1) {

                // Récupérer les IDs des projets auxquels l'utilisateur est membre
                $projectMemberIds = Project_member::where('user_id', Auth::user()->id)->pluck('project_id');

                // Récupérer les projets correspondant à ces IDs
                $member_projects = Project::whereIn('id', $projectMemberIds)->whereNotNull('labs_id')->with('user')->get();


                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                $lab_members = Lab_member::with('user')->where('lab_id', $lab_member->id)->orderBy('created_at', 'desc')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();


                //$labId = $lab->id;




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$member_projects) {
                    return Redirect::route('home')->with('message', 'You are not a member in a collaboration project .');
                }

                if ($member_projects) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::whereJsonContains('labs_id', (string) $lab->id)->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/Projects', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        //'projects' => $projects,
                        'lab_members_all' => $lab_members_all,
                        'projectMemberIds' => $projectMemberIds,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'member_projects' => $member_projects,
                        'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        //'project' => $project,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } elseif ($lab_member || $external_member) {

                // Récupérer les IDs des projets auxquels l'utilisateur est membre
                $projectMemberIds = Project_member::where('user_id', Auth::user()->id)->pluck('project_id');

                // Récupérer les projets correspondant à ces IDs
                $member_projects = Project::whereIn('id', $projectMemberIds)->whereNotNull('labs_id')->with('user')->get();


                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                $lab_members = Lab_member::with('user')->where('lab_id', $lab_member->id)->orderBy('created_at', 'desc')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();


                //$labId = $lab->id;




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$member_projects) {
                    return Redirect::route('home')->with('message', 'You are not a member in a collaboration project .');
                }

                if ($member_projects) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::whereJsonContains('labs_id', (string) $lab->id)->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/Projects', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        //'projects' => $projects,
                        'lab_members_all' => $lab_members_all,
                        'projectMemberIds' => $projectMemberIds,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'member_projects' => $member_projects,
                        'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        //'project' => $project,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } else {
                return Redirect::route('home')->with('message', 'Acess denied');
            }

        } else {
            return Redirect::route('home');
        }
    }


    public function collaboration_space_projects_view_index($id)
    {
        Notification::where('created_at', '<', Carbon::now()->subMonth())->delete();
        if (Auth::check()) {

            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();
            $external_member = External_member::where('user_id', Auth::user()->id)->first();


            if (Auth::user()->director == 1) {

                $lab = Lab::where('director_id', Auth::user()->id)->first();
                $labs = Lab::get();
                $project = Project::findOrFail($id);
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();

                $user = User::where("id", $lab->director_id)->first();



                $pr_members = Project::where('id', $project->id)
                    ->whereJsonContains('labs_id', (string) $lab->id)
                    ->first();

                $projectMembers = Project_member::where('project_id', $project->id)->where('user_id', Auth::user()->id)->with('user')->first();

                $projectMemberss = Project_member::where('project_id', $project->id)->with('user')->get();





                // Get all external members
                $externalMembers = External_member::with('user')->get();

                // Extract the numeric ID from the project ID you're searching for
                $projectId = $project->id;

                // Filter external members where project_id contains the numeric project ID
                $noProjectMembers = $externalMembers->filter(function ($member) use ($projectId) {
                    $projectIds = json_decode($member->project_id, true);

                    // Ensure $projectIds is an array
                    $projectIds = is_array($projectIds) ? $projectIds : [];

                    // Check if the numeric project ID exists in the decoded project IDs
                    return in_array($projectId, $projectIds);
                });


                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();


                $labId = $lab->id;

                $projects_count = Project::whereRaw("invitations->'{$labId}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$labId}' = 'pending'")
                    ->count();





                if (!$lab && !$pr_members && !$projectMembers && Auth::user()->id != $project->project_leader_id) {
                    return Redirect::route('home')->with('message', 'Access denied.');
                }




                if (($pr_members && !empty($project->labs_id)) || ($projectMembers && !empty($project->labs_id)) || (Auth::user()->id == $project->project_leader_id && !empty($project->labs_id))) {


                    $personalReports = Project_personal_report::where('project_id', $project->id)->with('user')->get();
                    $personalReport = Project_personal_report::where('project_member_id', Auth::user()->id)->where('project_id', $project->id)->with('user')->first();

                    $globalReport = Project_global_report::where('project_id', $project->id)->where('project_leader_id', $project->project_leader_id)->with('user')->first();
                    // Find the collaboration space related to the lab

                    $isProjectLeader = Project::where('id', $projectId)->where('project_leader_id', Auth::user()->id)->first();
                    $isProjectMember = Project_member::where('user_id', Auth::user()->id)->where('project_id', $id)->with('user')->get();





                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/ProjectView', [

                        'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'projectDetails' => $project,
                        'projectMembers' => $projectMembers,
                        'noProjectMembers' => $noProjectMembers,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'personalReport' => $personalReport,
                        'personalReports' => $personalReports,
                        'globalReport' => $globalReport,
                        'isProjectMember' => $isProjectMember,
                        'isProjectLeader' => $isProjectLeader,
                        'projectMemberss' => $projectMemberss,

                        'lab_members_all' => $lab_members_all,
                        'lab_members' => $lab_members,
                        'projects_count' => $projects_count,
                        'phd_thesis_count' => $phd_thesis_count,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);


                    // Return the data to Inertia for display

                }

            } elseif ($lab_member->project_leader == 1) {
                $member = Lab_member::where('user_id', Auth::user()->id)->first();
                $lab = Lab::where('id', $member->lab_id)->first();
                $project = Project::findOrFail($id);


                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                $lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();
                $projectMemberss = Project_member::where('project_id', $project->id)->with('user')->get();



                $user = User::where("id", $lab->director_id)->first();





                $projectMembers = Project_member::where('project_id', $project->id)->where('user_id', Auth::user()->id)->with('user')->first();




                // Get all external members
                $externalMembers = External_member::with('user')->get();

                // Extract the numeric ID from the project ID you're searching for
                $projectId = $project->id;

                // Filter external members where project_id contains the numeric project ID
                $noProjectMembers = $externalMembers->filter(function ($member) use ($projectId) {
                    $projectIds = json_decode($member->project_id, true);

                    // Ensure $projectIds is an array
                    $projectIds = is_array($projectIds) ? $projectIds : [];

                    // Check if the numeric project ID exists in the decoded project IDs
                    return in_array($projectId, $projectIds);
                });


                //$labId = $lab->id;




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$projectMembers && Auth::user()->id != $project->project_leader_id) {
                    return Redirect::route('home')->with('message', 'Project not found or you are not a project leader.');
                }

                if ((Auth::user()->id == $project->project_leader_id && !empty($project->labs_id)) || ($projectMembers && !empty($project->labs_id))) {
                    // Find the collaboration space related to the lab


                    $personalReports = Project_personal_report::where('project_id', $project->id)->with('user')->get();
                    $personalReport = Project_personal_report::where('project_member_id', Auth::user()->id)->where('project_id', $project->id)->with('user')->first();

                    $globalReport = Project_global_report::where('project_id', $project->id)->where('project_leader_id', $project->project_leader_id)->with('user')->first();
                    // Find the collaboration space related to the lab

                    $isProjectLeader = Project::where('id', $projectId)->where('project_leader_id', Auth::user()->id)->first();
                    $isProjectMember = Project_member::where('user_id', Auth::user()->id)->where('project_id', $id)->with('user')->get();





                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/ProjectView', [

                        'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'projectDetails' => $project,
                        'projectMembers' => $projectMembers,
                        'projectMemberss' => $projectMemberss,
                        'noProjectMembers' => $noProjectMembers,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'personalReport' => $personalReport,
                        'personalReports' => $personalReports,
                        'globalReport' => $globalReport,
                        'isProjectMember' => $isProjectMember,
                        'isProjectLeader' => $isProjectLeader,

                        'lab_members_all' => $lab_members_all,
                        'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);

                }


            } elseif (
                ($lab_member && $lab_member->is_supervisor == 1) ||
                ($external_member && $external_member->is_supervisor == 1) ||
                ($lab_member && $lab_member->is_co_supervisor == 1) ||
                ($external_member && $external_member->is_co_supervisor == 1)
            ) {

                $labs = Lab::get();
                $project = Project::findOrFail($id);

                $projectMember = Project_member::where('project_id', $project->id)
                    ->where('user_id', Auth::user()->id)->with('user')
                    ->first();

                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();

                //$user = User::where("id", $lab->director_id)->first();

                $projectMemberss = Project_member::where('project_id', $project->id)->with('user')->get();


                // Get all external members
                $externalMembers = External_member::with('user')->get();

                // Extract the numeric ID from the project ID you're searching for
                $projectId = $project->id;

                // Filter external members where project_id contains the numeric project ID
                $noProjectMembers = $externalMembers->filter(function ($member) use ($projectId) {
                    $projectIds = json_decode($member->project_id, true);

                    // Ensure $projectIds is an array
                    $projectIds = is_array($projectIds) ? $projectIds : [];

                    // Check if the numeric project ID exists in the decoded project IDs
                    return in_array($projectId, $projectIds);
                });







                //$labId = $lab->id;




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$projectMember) {
                    return Redirect::route('home')->with('message', 'You are not a member in this project .');
                }

                if ($projectMember && !empty($project->labs_id)) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::where('project_leader_id', Auth::user()->id)
                    //->whereNotNull('labs_id')
                    //->get();





                    $personalReports = Project_personal_report::where('project_id', $project->id)->with('user')->get();
                    $personalReport = Project_personal_report::where('project_member_id', Auth::user()->id)->where('project_id', $project->id)->with('user')->first();

                    $globalReport = Project_global_report::where('project_id', $project->id)->where('project_leader_id', $project->project_leader_id)->with('user')->first();
                    // Find the collaboration space related to the lab

                    $isProjectLeader = Project::where('id', $projectId)->where('project_leader_id', Auth::user()->id)->first();
                    $isProjectMember = Project_member::where('user_id', Auth::user()->id)->where('project_id', $id)->with('user')->get();


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/ProjectView', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'projectDetails' => $project,
                        'projectMemberss' => $projectMemberss,
                        'noProjectMembers' => $noProjectMembers,
                        'projectMember' => $projectMember,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'personalReport' => $personalReport,
                        'personalReports' => $personalReports,
                        'globalReport' => $globalReport,
                        'isProjectMember' => $isProjectMember,
                        'isProjectLeader' => $isProjectLeader,

                        'lab_members_all' => $lab_members_all,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }


            } elseif ($lab_member->phd_student == 1) {

                $labs = Lab::get();
                $project = Project::findOrFail($id);

                $projectMember = Project_member::where('project_id', $project->id)
                    ->where('user_id', Auth::user()->id)
                    ->first();

                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();

                //$user = User::where("id", $lab->director_id)->first();
                $projectDetails = Project::where('id', $id)->first();
                $projectMemberss = Project_member::where('project_id', $projectDetails->id)->with('user')->get();


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


                //$labId = $lab->id;



                $project_personal_report = Project_personal_report::where('project_id', $project->id)->where('project_member_id', Auth::user()->id)->with('user')->first();





                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$projectMember) {
                    return Redirect::route('home')->with('message', 'You are not a member in this project .');
                }

                if ($projectMember && !empty($project->labs_id)) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::where('project_leader_id', Auth::user()->id)
                    //->whereNotNull('labs_id')
                    //->get();





                    $personalReports = Project_personal_report::where('project_id', $project->id)->with('user')->get();
                    $personalReport = Project_personal_report::where('project_member_id', Auth::user()->id)->where('project_id', $project->id)->with('user')->first();

                    $globalReport = Project_global_report::where('project_id', $project->id)->where('project_leader_id', $project->project_leader_id)->with('user')->first();
                    // Find the collaboration space related to the lab

                    $isProjectLeader = Project::where('id', $projectId)->where('project_leader_id', Auth::user()->id)->first();
                    $isProjectMember = Project_member::where('user_id', Auth::user()->id)->where('project_id', $id)->with('user')->get();



                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/ProjectView', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'projectDetails' => $project,
                        'projectMemberss' => $projectMemberss,
                        'noProjectMembers' => $noProjectMembers,
                        'projectMember' => $projectMember,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'personalReport' => $personalReport,
                        'personalReports' => $personalReports,
                        'globalReport' => $globalReport,
                        'isProjectMember' => $isProjectMember,
                        'isProjectLeader' => $isProjectLeader,


                        'lab_members_all' => $lab_members_all,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }


            } elseif ($lab_member || $external_member) {

                $labs = Lab::get();
                $project = Project::findOrFail($id);

                $projectMember = Project_member::where('project_id', $project->id)
                    ->where('user_id', Auth::user()->id)
                    ->first();

                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();

                //$user = User::where("id", $lab->director_id)->first();
                $projectDetails = Project::where('id', $id)->first();
                $projectMemberss = Project_member::where('project_id', $projectDetails->id)->with('user')->get();


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


                //$labId = $lab->id;


                $project_personal_report = Project_personal_report::where('project_id', $project->id)->where('project_member_id', Auth::user()->id)->with('user')->first();





                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$projectMember) {
                    return Redirect::route('home')->with('message', 'You are not a member in this project .');
                }

                if ($projectMember && !empty($project->labs_id)) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::where('project_leader_id', Auth::user()->id)
                    //->whereNotNull('labs_id')
                    //->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/ProjectView', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'projectDetails' => $project,
                        'projectMemberss' => $projectMemberss,
                        'noProjectMembers' => $noProjectMembers,
                        'projectMember' => $projectMember,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,

                        'lab_members_all' => $lab_members_all,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,

                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }


            } else {
                return Redirect::route('home')->with('message', 'Acess denied');
            }

        } else {
            return Redirect::route('home');
        }
    }


    public function collaboration_space_invitations_index()
    {
        Notification::where('created_at', '<', Carbon::now()->subMonth())->delete();
        if (Auth::check()) {

            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();
            $external_member = External_member::where('user_id', Auth::user()->id)->first();

            if (Auth::user()->director == 1) {

                $lab = Lab::where('director_id', Auth::user()->id)->first();

                if (!$lab) {
                    return Redirect::route('home')->with('message', 'Lab not found or you are not the director.');
                }

                if (Auth::user()->director == 1 && $lab) {
                    // Retrieve projects where the lab's invitation is pending
                    $labId = $lab->id;

                    $projects = Project::whereRaw("invitations->'{$labId}' IS NOT NULL")
                        ->whereRaw("invitations->> '{$labId}' = 'pending'")
                        ->get();

                    $user = Auth::user()->id;

                    $phd_thesiss = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                        ->whereRaw("invitations->> '{$user}' = 'pending'")
                        ->get();



                    $labId = $lab->id;


                    $invitaion_not = Notification::where('read', false)
                        ->whereIn('type', ['invite_project_collaboration', 'invite_phd_thesis_collaboration'])
                        ->where(function ($query) use ($labId) {
                            $query->where('lab_id', $labId)
                                ->orWhere('phd_student_id', Auth::user()->id);
                        })
                        ->update(['read' => true]);


                    $projects_count = Project::whereRaw("invitations->'{$labId}' IS NOT NULL")
                        ->whereRaw("invitations->> '{$labId}' = 'pending'")
                        ->count();


                    $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                        ->whereRaw("invitations->> '{$user}' = 'pending'")
                        ->count();


                    // Return the data to Inertia for display


                    return Inertia::render('CollaborationSpace/Invitations', [
                        'lab' => $lab,
                        'projects' => $projects,
                        'projects_count' => $projects_count,
                        'phd_thesiss' => $phd_thesiss,
                        'phd_thesis_count' => $phd_thesis_count,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } elseif ($lab_member->project_leader == 1) {
                $user = Auth::user()->id;

                $phd_thesiss = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->get();



                //$labId = $lab->id;

                $invitaion_not = Notification::where('read', false)->where('type', 'invite_phd_thesis_collaboration')->where('phd_student_id', Auth::user()->id)->update(['read' => true]);






                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();
                // Return the data to Inertia for display

                //Log::info($notifications);
                return Inertia::render('CollaborationSpace/Invitations', [
                    //'lab' => $lab,
                    'phd_thesiss' => $phd_thesiss,
                    'phd_thesis_count' => $phd_thesis_count,
                    'lab_member' => $lab_member,
                    'external_member' => $external_member,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);


            } elseif (
                ($lab_member && $lab_member->is_supervisor == 1) ||
                ($external_member && $external_member->is_supervisor == 1) ||
                ($lab_member && $lab_member->is_co_supervisor == 1) ||
                ($external_member && $external_member->is_co_supervisor == 1)
            ) {

                $user = Auth::user()->id;
                $phd_thesiss = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->get();


                //$labId = $lab->id;

                $invitaion_not = Notification::where('read', false)->where('type', 'invite_phd_thesis_collaboration')->where('phd_student_id', Auth::user()->id)->update(['read' => true]);



                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();
                // Return the data to Inertia for display

                //Log::info($notifications);
                return Inertia::render('CollaborationSpace/Invitations', [
                    //'lab' => $lab,
                    'phd_thesiss' => $phd_thesiss,
                    'phd_thesis_count' => $phd_thesis_count,
                    'lab_member' => $lab_member,
                    'external_member' => $external_member,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);


            } elseif ($lab_member->phd_student == 1) {

                $user = Auth::user()->id;
                $phd_thesiss = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->get();


                //$labId = $lab->id;

                $invitaion_not = Notification::where('read', false)->where('type', 'invite_phd_thesis_collaboration')->where('phd_student_id', Auth::user()->id)->update(['read' => true]);



                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();
                // Return the data to Inertia for display

                //Log::info($notifications);
                return Inertia::render('CollaborationSpace/Invitations', [
                    //'lab' => $lab,
                    'phd_thesiss' => $phd_thesiss,
                    'phd_thesis_count' => $phd_thesis_count,
                    'lab_member' => $lab_member,
                    'external_member' => $external_member,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);


            } elseif ($lab_member || $external_member) {

                $user = Auth::user()->id;
                $phd_thesiss = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->get();


                //$labId = $lab->id;

                $invitaion_not = Notification::where('read', false)->where('type', 'invite_phd_thesis_collaboration')->where('phd_student_id', Auth::user()->id)->update(['read' => true]);




                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();
                // Return the data to Inertia for display

                //Log::info($notifications);
                return Inertia::render('CollaborationSpace/Invitations', [
                    //'lab' => $lab,
                    'phd_thesiss' => $phd_thesiss,
                    'phd_thesis_count' => $phd_thesis_count,
                    'lab_member' => $lab_member,
                    'external_member' => $external_member,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);


            } else {
                return Redirect::route('home')->with('message', 'Acess denied');
            }

        } else {
            return Redirect::route('home');
        }
    }



    public function collaboration_space_phd_thesis_index()
    {
        Notification::where('created_at', '<', Carbon::now()->subMonth())->delete();
        if (Auth::check()) {

            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();
            $external_member = External_member::where('user_id', Auth::user()->id)->first();

            if (Auth::user()->director == 1) {

                $collab_phd_thesis = Phd_thesis::whereJsonContains('phd_students_id', (string) Auth::user()->id)->get();
                $supervisor_phd_thesis = Phd_thesis::where('supervisor_id', (string) Auth::user()->id)->get();
                $co_supervisor_phd_thesis = Phd_thesis::where('co_supervisor_id', (string) Auth::user()->id)->whereNotNull('phd_students_id')->get();




                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();

                $lab = Lab::where('director_id', Auth::user()->id)->first();

                $labId = $lab->id;

                $projects_count = Project::whereRaw("invitations->'{$labId}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$labId}' = 'pending'")
                    ->count();




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$collab_phd_thesis && !$supervisor_phd_thesis && !$co_supervisor_phd_thesis) {
                    return Redirect::route('home')->with('message', 'Access denied.');
                }

                if ($collab_phd_thesis || $supervisor_phd_thesis || $co_supervisor_phd_thesis) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::whereJsonContains('labs_id', (string) $lab->id)->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/PhdThesis', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'projects_count' => $projects_count,
                        //'projects' => $projects,
                        'lab_members_all' => $lab_members_all,
                        'collab_phd_thesis' => $collab_phd_thesis,
                        //'projects' => $projects,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        'supervisor_phd_thesis' => $supervisor_phd_thesis,
                        'co_supervisor_phd_thesis' => $co_supervisor_phd_thesis,
                        //'project' => $project,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } elseif ($lab_member->project_leader == 1) {

                $collab_phd_thesis = Phd_thesis::whereJsonContains('phd_students_id', (string) Auth::user()->id)->get();
                $supervisor_phd_thesis = Phd_thesis::where('supervisor_id', (string) Auth::user()->id)->get();
                $co_supervisor_phd_thesis = Phd_thesis::where('co_supervisor_id', (string) Auth::user()->id)->whereNotNull('phd_students_id')->get();




                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();


                //$labId = $lab->id;




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$collab_phd_thesis && !$supervisor_phd_thesis && !$co_supervisor_phd_thesis) {
                    return Redirect::route('home')->with('message', 'Access denied .');
                }

                if ($collab_phd_thesis || $supervisor_phd_thesis || $co_supervisor_phd_thesis) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::whereJsonContains('labs_id', (string) $lab->id)->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/PhdThesis', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        //'projects' => $projects,
                        'lab_members_all' => $lab_members_all,
                        'collab_phd_thesis' => $collab_phd_thesis,
                        //'projects' => $projects,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        'supervisor_phd_thesis' => $supervisor_phd_thesis,
                        'co_supervisor_phd_thesis' => $co_supervisor_phd_thesis,
                        //'project' => $project,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }



            } elseif (
                ($lab_member && $lab_member->is_supervisor == 1) ||
                ($external_member && $external_member->is_supervisor == 1) ||
                ($lab_member && $lab_member->is_co_supervisor == 1) ||
                ($external_member && $external_member->is_co_supervisor == 1)
            ) {

                $collab_phd_thesis = Phd_thesis::whereJsonContains('phd_students_id', (string) Auth::user()->id)->get();
                $supervisor_phd_thesis = Phd_thesis::where('supervisor_id', (string) Auth::user()->id)->get();
                $co_supervisor_phd_thesis = Phd_thesis::where('co_supervisor_id', (string) Auth::user()->id)->whereNotNull('phd_students_id')->get();




                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();


                //$labId = $lab->id;




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$collab_phd_thesis && !$supervisor_phd_thesis && !$co_supervisor_phd_thesis) {
                    return Redirect::route('home')->with('message', 'Access denied .');
                }

                if ($collab_phd_thesis || $supervisor_phd_thesis || $co_supervisor_phd_thesis) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::whereJsonContains('labs_id', (string) $lab->id)->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/PhdThesis', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        //'projects' => $projects,
                        'lab_members_all' => $lab_members_all,
                        'collab_phd_thesis' => $collab_phd_thesis,

                        //'projects' => $projects,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        'supervisor_phd_thesis' => $supervisor_phd_thesis,
                        'co_supervisor_phd_thesis' => $co_supervisor_phd_thesis,
                        //'project' => $project,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } elseif ($lab_member->phd_student == 1) {

                $collab_phd_thesis = Phd_thesis::whereJsonContains('phd_students_id', (string) Auth::user()->id)->get();
                $personal_phd_thesis = Phd_thesis::where('phd_student_id', (string) Auth::user()->id)->whereNotNull('phd_students_id')->first();




                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();


                //$labId = $lab->id;




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$collab_phd_thesis && !$personal_phd_thesis) {
                    return Redirect::route('home')->with('message', 'Access denied .');
                }

                if ($collab_phd_thesis || $personal_phd_thesis) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::whereJsonContains('labs_id', (string) $lab->id)->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/PhdThesis', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        //'projects' => $projects,
                        'lab_members_all' => $lab_members_all,
                        'collab_phd_thesis' => $collab_phd_thesis,
                        'personal_phd_thesis' => $personal_phd_thesis,
                        //'projects' => $projects,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        //'project' => $project,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } elseif ($lab_member || $external_member) {

                $collab_phd_thesis = Phd_thesis::whereJsonContains('phd_students_id', (string) Auth::user()->id)->get();


                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();


                //$labId = $lab->id;




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$collab_phd_thesis) {
                    return Redirect::route('home')->with('message', 'Access denied .');
                }

                if ($collab_phd_thesis) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::whereJsonContains('labs_id', (string) $lab->id)->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/PhdThesis', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        //'projects' => $projects,
                        'lab_members_all' => $lab_members_all,
                        'collab_phd_thesis' => $collab_phd_thesis,
                        //'projects' => $projects,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        //'project' => $project,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } else {
                return Redirect::route('home')->with('message', 'Acess denied');
            }

        } else {
            return Redirect::route('home');
        }
    }


    public function collaboration_space_phd_thesis_view_index($id)
    {
        Notification::where('created_at', '<', Carbon::now()->subMonth())->delete();
        if (Auth::check()) {

            $lab_member = Lab_member::where('user_id', Auth::user()->id)->first();
            $external_member = External_member::where('user_id', Auth::user()->id)->first();

            if (Auth::user()->director == 1) {
                $members = collect();
                $labs = Lab::get();

                $phd_thesis = Phd_thesis::findOrFail($id);

                $phd_thesis_member = Phd_thesis::where('id', $phd_thesis->id)
                    ->whereJsonContains('phd_students_id', (string) Auth::user()->id)
                    ->first();

                $supervisor_phd_thesis_member = Phd_thesis::where('id', (string) $phd_thesis->id)->where('supervisor_id', (string) Auth::user()->id)->first();
                $co_supervisor_phd_thesis_member = Phd_thesis::where('id', (string) $phd_thesis->id)->where('co_supervisor_id', (string) Auth::user()->id)->first();


                if ($phd_thesis_member) {
                    $members = User::whereIn('id', $phd_thesis_member->phd_students_id)->get();
                }

                //$projectMember = Project_member::where('project_id', $project->id)
                //->where('user_id', Auth::user()->id)
                // ->first();

                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();
                $lab_members = Lab_member::with('user')->get();
                $external_members = External_member::with('user')->get();




                //$user = User::where("id", $lab->director_id)->first();



                $lab = Lab::where('director_id', Auth::user()->id)->first();

                $labId = $lab->id;

                $projects_count = Project::whereRaw("invitations->'{$labId}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$labId}' = 'pending'")
                    ->count();





                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$phd_thesis_member && !$supervisor_phd_thesis_member && !$co_supervisor_phd_thesis_member) {
                    return Redirect::route('home')->with('message', 'Access denied.');
                }

                if ($phd_thesis_member || $supervisor_phd_thesis_member || ($co_supervisor_phd_thesis_member && !empty($phd_thesis->phd_students_id) && !is_array($phd_thesis->phd_students_id) && !empty(json_decode($phd_thesis->phd_students_id)))) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::where('project_leader_id', Auth::user()->id)
                    //->whereNotNull('labs_id')
                    //->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/PhdThesisView', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'phd_thesis' => $phd_thesis,
                        'phd_thesis_member' => $phd_thesis_member,
                        'lab_members' => $lab_members,
                        'external_members' => $external_members,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'projects_count' => $projects_count,
                        'members' => $members,


                        'lab_members_all' => $lab_members_all,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } elseif ($lab_member->project_leader == 1) {
                $members = collect();
                $labs = Lab::get();

                $phd_thesis = Phd_thesis::findOrFail($id);

                $phd_thesis_member = Phd_thesis::where('id', $phd_thesis->id)
                    ->whereJsonContains('phd_students_id', (string) Auth::user()->id)
                    ->first();

                $supervisor_phd_thesis_member = Phd_thesis::where('id', (string) $phd_thesis->id)->where('supervisor_id', (string) Auth::user()->id)->first();
                $co_supervisor_phd_thesis_member = Phd_thesis::where('id', (string) $phd_thesis->id)->where('co_supervisor_id', (string) Auth::user()->id)->first();


                $members = [];

                if ($phd_thesis_member && $phd_thesis_member->phd_students_id !== null) {
                    $members = array_merge($members, User::whereIn('id', $phd_thesis_member->phd_students_id)->get()->toArray());
                }

                if ($supervisor_phd_thesis_member && $supervisor_phd_thesis_member->phd_students_id !== null) {
                    $members = array_merge($members, User::whereIn('id', $supervisor_phd_thesis_member->phd_students_id)->get()->toArray());
                }

                if ($co_supervisor_phd_thesis_member && $co_supervisor_phd_thesis_member->phd_students_id !== null) {
                    $members = array_merge($members, User::whereIn('id', $co_supervisor_phd_thesis_member->phd_students_id)->get()->toArray());
                }
             

                //$projectMember = Project_member::where('project_id', $project->id)
                //->where('user_id', Auth::user()->id)
                // ->first();

                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();
                $lab_members = Lab_member::with('user')->get();
                $external_members = External_member::with('user')->get();




                //$user = User::where("id", $lab->director_id)->first();



                //$labId = $lab->id;




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$phd_thesis_member && !$supervisor_phd_thesis_member && !$co_supervisor_phd_thesis_member) {
                    return Redirect::route('home')->with('message', 'Access denied .');
                }

                if ($phd_thesis_member || $supervisor_phd_thesis_member || ($co_supervisor_phd_thesis_member && !empty(json_decode($phd_thesis->phd_students_id)))) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::where('project_leader_id', Auth::user()->id)
                    //->whereNotNull('labs_id')
                    //->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/PhdThesisView', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'phd_thesis' => $phd_thesis,
                        'phd_thesis_member' => $phd_thesis_member,
                        'lab_members' => $lab_members,
                        'external_members' => $external_members,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'members' => $members,
                        'lab_members_all' => $lab_members_all,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } elseif (
                ($lab_member && $lab_member->is_supervisor == 1) ||
                ($external_member && $external_member->is_supervisor == 1) ||
                ($lab_member && $lab_member->is_co_supervisor == 1) ||
                ($external_member && $external_member->is_co_supervisor == 1)
            ) {


                $members = collect();
                $labs = Lab::get();

                $phd_thesis = Phd_thesis::findOrFail($id);

                $phd_thesis_member = Phd_thesis::where('id', $phd_thesis->id)
                    ->whereJsonContains('phd_students_id', (string) Auth::user()->id)
                    ->first();

                $supervisor_phd_thesis_member = Phd_thesis::where('supervisor_id', Auth::user()->id)->first();
                $co_supervisor_phd_thesis_member = Phd_thesis::where('co_supervisor_id', Auth::user()->id)->first();


                $members = [];

                if ($phd_thesis_member && $phd_thesis_member->phd_students_id !== null) {
                    $members = array_merge($members, User::whereIn('id', $phd_thesis_member->phd_students_id)->get()->toArray());
                }

                if ($supervisor_phd_thesis_member && $supervisor_phd_thesis_member->phd_students_id !== null) {
                    $members = array_merge($members, User::whereIn('id', $supervisor_phd_thesis_member->phd_students_id)->get()->toArray());
                }

                if ($co_supervisor_phd_thesis_member && $co_supervisor_phd_thesis_member->phd_students_id !== null) {
                    $members = array_merge($members, User::whereIn('id', $co_supervisor_phd_thesis_member->phd_students_id)->get()->toArray());
                }


                Log::info("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");


                //$projectMember = Project_member::where('project_id', $project->id)
                //->where('user_id', Auth::user()->id)
                // ->first();

                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();
                $lab_members = Lab_member::with('user')->get();
                $external_members = External_member::with('user')->get();




                //$user = User::where("id", $lab->director_id)->first();



                //$labId = $lab->id;




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$phd_thesis_member && !$supervisor_phd_thesis_member && !$co_supervisor_phd_thesis_member) {
                    return Redirect::route('home')->with('message', 'Access denied.');
                }

                if ($phd_thesis_member || $supervisor_phd_thesis_member || ($co_supervisor_phd_thesis_member && !empty(json_decode($phd_thesis->phd_students_id)))) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::where('project_leader_id', Auth::user()->id)
                    //->whereNotNull('labs_id')
                    //->get();





                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/PhdThesisView', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'phd_thesis' => $phd_thesis,
                        'phd_thesis_member' => $phd_thesis_member,
                        'lab_members' => $lab_members,
                        'external_members' => $external_members,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'members' => $members,
                        'lab_members_all' => $lab_members_all,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } elseif ($lab_member->phd_student == 1) {

                $members = collect();
                $labs = Lab::get();

                $phd_thesis = Phd_thesis::findOrFail($id);

                $phd_thesis_member = Phd_thesis::where('id', $phd_thesis->id)
                    ->whereJsonContains('phd_students_id', (string) Auth::user()->id)
                    ->first();

                $phd_student_phd_thesis_member = Phd_thesis::where('id', (string) $phd_thesis->id)->where('phd_student_id', (string) Auth::user()->id)->first();


                if ($phd_thesis_member) {
                    $members = User::whereIn('id', $phd_thesis_member->phd_students_id)->get();
                }





                //$projectMember = Project_member::where('project_id', $project->id)
                //->where('user_id', Auth::user()->id)
                // ->first();

                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();
                $lab_members = Lab_member::with('user')->get();
                $external_members = External_member::with('user')->get();




                //$user = User::where("id", $lab->director_id)->first();



                //$labId = $lab->id;




                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$phd_thesis_member && !$phd_student_phd_thesis_member) {
                    return Redirect::route('home')->with('message', 'Access denied.');
                }

                if ($phd_thesis_member || $phd_student_phd_thesis_member) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::where('project_leader_id', Auth::user()->id)
                    //->whereNotNull('labs_id')
                    //->get();


                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/PhdThesisView', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'phd_thesis' => $phd_thesis,
                        'phd_thesis_member' => $phd_thesis_member,
                        'lab_members' => $lab_members,
                        'external_members' => $external_members,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'members' => $members,
                        'lab_members_all' => $lab_members_all,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } elseif ($lab_member || $external_member) {

                $labs = Lab::get();

                $phd_thesis = Phd_thesis::findOrFail($id);

                $phd_thesis_member = Phd_thesis::where('id', $phd_thesis->id)
                    ->whereJsonContains('phd_students_id', (string) Auth::user()->id)
                    ->first();




                //$projectMember = Project_member::where('project_id', $project->id)
                //->where('user_id', Auth::user()->id)
                // ->first();

                $labs = Lab::get();
                $establishments = Establishment::get();
                $lab_members_all = Lab_member::with('user', 'lab')->get();
                //$lab_members = Lab_member::with('user')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
                $domains = Domain::get();
                $lab_members = Lab_member::with('user')->get();
                $external_members = External_member::with('user')->get();




                //$user = User::where("id", $lab->director_id)->first();



                //$labId = $lab->id;





                $user = Auth::user()->id;
                $phd_thesis_count = Phd_thesis::whereRaw("invitations->'{$user}' IS NOT NULL")
                    ->whereRaw("invitations->> '{$user}' = 'pending'")
                    ->count();



                if (!$phd_thesis_member) {
                    return Redirect::route('home')->with('message', 'You are not a member in this collaboration phd thesis .');
                }

                if ($phd_thesis_member) {
                    // Find the collaboration space related to the lab
                    //$projects = Project::where('project_leader_id', Auth::user()->id)
                    //->whereNotNull('labs_id')
                    //->get();

                    $members = User::whereIn('id', $phd_thesis_member->phd_students_id)->get();



                    //Log::info($projects);


                    // Return the data to Inertia for display
                    return Inertia::render('CollaborationSpace/PhdThesisView', [

                        //'lab' => $lab,
                        'labs' => $labs,
                        'establishments' => $establishments,
                        'domains' => $domains,
                        'phd_thesis' => $phd_thesis,
                        'phd_thesis_member' => $phd_thesis_member,
                        'lab_members' => $lab_members,
                        'external_members' => $external_members,
                        'lab_member' => $lab_member,
                        'external_member' => $external_member,
                        'members' => $members,
                        'lab_members_all' => $lab_members_all,
                        //'lab_members' => $lab_members,
                        'phd_thesis_count' => $phd_thesis_count,
                        'canLogin' => Route::has('login'),
                        'canRegister' => Route::has('register'),
                    ]);
                }

            } else {
                return Redirect::route('home')->with('message', 'Acess denied');
            }

        } else {
            return Redirect::route('home');
        }
    }


    public function director_collab_project_member_insert(Request $request, $id)
    {
        if (Auth::check()) {
            $project = Project::find($id);

            // Récupérer les IDs des laboratoires associés au projet
            $labsIds = is_string($project->labs_id) ? json_decode($project->labs_id, true) ?? [] : $project->labs_id;


            // Vérifier si l'utilisateur est le directeur de l'un des laboratoires associés au projet
            $isAuthorized = Lab::whereIn('id', $labsIds)
                ->where('director_id', Auth::user()->id)
                ->exists();

            if (Auth::user()->director == 1 && $isAuthorized) {
                // Validate the request data
                $data = $request->validate([
                    'user_id' => ['nullable', 'numeric'],
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
                    return back()->withErrors(['message' => 'This project member already exists.']);
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

                    return Redirect::route('collaboration.space.project.view', ['id' => $id])->with('message', 'Member added Succesfully');
                } elseif (!$external_member && $data['user_id']) {
                    $project_member = new Project_member;
                    $project_member->project_id = $id;
                    $project_member->user_id = $data['user_id'];
                    $project_member->save();

                    if ($lab_m) {
                        $lab_m->is_project_member = 1;
                        $lab_m->update();
                    }

                    return Redirect::route('collaboration.space.project.view', ['id' => $id])->with('message', 'Member added Succesfully');
                } elseif ($data['first_name'] && $data['last_name'] && $data['email'] && $data['password']) {
                    // Vérification des noms similaires
                    $existingUsers = User::all();

                    foreach ($existingUsers as $existingUser) {
                        $firstNameSimilarity = 0;
                        $lastNameSimilarity = 0;

                        similar_text($data['first_name'], $existingUser->first_name, $firstNameSimilarity);
                        similar_text($data['last_name'], $existingUser->last_name, $lastNameSimilarity);

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

                    return Redirect::route('collaboration.space.project.view', ['id' => $id])->with('message', 'Member added Succesfully');
                } else {
                    return Redirect::route('home')->with('message', 'Something went wrong, try again');
                }
            } else {
                return Redirect::route('home')->with('message', 'You are not authorized to manage this project');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function director_invite_Labs(Request $request, $id)
    {



        if (Auth::check()) {
            $project = Project::where('id', $id)->first();
            $lab = Lab::where('id', $project->lab_id)->first();
            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {


                // Validate the request data
                $data = $request->validate([

                    'labs' => ['nullable', 'array'], // Attend un tableau
                    'labs.*' => ['integer'], // Chaque élément du tableau doit être une chaîne
                    'domains' => ['nullable', 'array'], // Attend un tableau
                    'domains.*' => ['string'], // Chaque élément du tableau doit être une chaîne
                ]);


                $labs = Lab::whereIn('id', $data['labs'])->get();


                Log::info('Labs2:');


                // Inviter ces laboratoires
                foreach ($labs as $labb) {
                    $project->inviteLab($labb->id);

                    $notification = new Notification();
                    $notification->lab_id = $labb->id;
                    $notification->type = "invite_project_collaboration";
                    $notification->message = "You have been invited to collaborate on the project{$project->title}.";
                    $notification->save();
                }


                Log::info('Labs3:');

                // Récupérer les laboratoires par domaine
                $labsByDomain = Lab::whereJsonContains('domain', $data['domains'])->get();

                Log::info('Labs4:');
                // Inviter ces laboratoires
                foreach ($labsByDomain as $labb) {
                    $project->inviteLab($labb->id);

                    $notification = new Notification();
                    $notification->lab_id = $labb->id;
                    $notification->type = "invite_project_collaboration";
                    $notification->message = "You have been invited to collaborate on the project{$project->title}.";
                    $notification->save();


                }

                Log::info('Labs5:');

                return Redirect::route('collaboration.space.projects')->with('message', 'Invitations sent.');

            } else {
                return Redirect::route('home')->with('message', 'you are not the director of this lab');
            }

        } else {
            return Redirect::route('home');
        }
    }


    public function director_mise_project_collab(Request $request, $id)
    {


        if (Auth::check()) {
            $project = Project::find($id);
            $lab = Lab::where('id', $project->lab_id)->first();
            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {
                Log::info("aaaaaaaaaaaaaaaa");
                // Validate the request data
                $data = $request->validate([
                    'project_leader_id' => ['required', 'numeric'],
                    'type' => ['nullable', 'string', 'max:255'],
                    'code' => ['nullable', 'string', 'max:255', Rule::unique('projects')->ignore($id)],
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
                return Redirect::route('collaboration.space.project.view', ['id' => $id])->with('message', 'Project updated Succesfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not authorized to update this project');
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

                return Redirect::route('collaboration.space.projects')->with('message', 'Project deleted Succesfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab');
            }

        } else {
            return Redirect::route('home');
        }

    }

    public function director_removeLabsFromProject($id, $id2)
    {
        if (Auth::check()) {
            $project = Project::findOrFail($id);

            // Check if the lab exists
            $lab = Lab::where('id', $project->lab_id)->first();
            if (!$lab) {
                return Redirect::route('home')->with('message', 'Lab not found.');
            }

            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {

                // Decode labs_id if it is a JSON string
                $labsIdArray = is_string($project->labs_id) ? json_decode($project->labs_id, true) : $project->labs_id;

                // Ensure $labsIdArray is an array
                if (!is_array($labsIdArray)) {
                    $labsIdArray = [];
                }

                // Ensure $id2 is an array
                $id2Array = is_array($id2) ? $id2 : [$id2];

                // Remove specified lab IDs from the array
                $labsIdArray = array_diff($labsIdArray, $id2Array);

                // Update the project with the new labs_id
                $project->labs_id = (array_values($labsIdArray));
                $project->save();

                return Redirect::route('collaboration.space.project.view', ['id' => $id])->with('message', 'Laboratories removed from the project.');
            } else {
                return Redirect::route('home')->with('message', 'You are not the director of this lab.');
            }
        } else {
            return Redirect::route('home');
        }
    }

    public function director_reject_project_Invitation(Request $request, $id, $id1)
    {

        if (Auth::check()) {


            $project = Project::findOrFail($id1);
            $lab = Lab::findOrFail($id);
            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {


                $project->respondToInvitation($lab->id, 'rejected');

                return Redirect::route('collaboration.space.invitations')->with('message', 'Invitation refused.');
            } else {
                return Redirect::route('home')->with('message', 'you are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function director_accept_project_Invitation($id, $id1)
    {

        if (Auth::check()) {



            $lab = Lab::findOrFail($id);
            $project = Project::findOrFail($id1);
            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {


                $project->respondToInvitation($lab->id, 'accepted');

                $project_member = new Project_member;
                $project_member->project_id = $id1;
                $project_member->user_id = $lab->director_id;
                $project_member->save();

                return Redirect::route('collaboration.space.invitations')->with('message', 'Invitation accepted.');
            } else {
                return Redirect::route('home')->with('message', 'you are not the director of this lab');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function director_create_project_invite_Labs(Request $request, $id)
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
                    'labs' => ['nullable', 'array'], // Attend un tableau
                    'labs.*' => ['integer'], // Chaque élément du tableau doit être une chaîne
                    'domains' => ['nullable', 'array'], // Attend un tableau
                    'domains.*' => ['string'], // Chaque élément du tableau doit être une chaîne
                    'project_display' => ['sometimes', 'boolean'],
                    'invitations_abstract' => ['nullable', 'string'],


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
                // Wrap $id in an array and encode it
                $project->labs_id = [$id]; // Store as an array
                $project->invitations_abstract = $data['invitations_abstract'];


                $project->save();


                $project_member = new Project_member();
                $project_member->user_id = $data['project_leader_id'];
                $project_member->project_id = $project->id;
                $project_member->save();






                
                $labsToInvite = collect();

                // Combine labs from the provided `labs` array
                if (!empty($data['labs'])) {
                    $labsToInvite = Lab::whereIn('id', $data['labs'])->get();
                }

                // Combine labs from the provided `domains`, excluding `$lab`
                if (!empty($data['domains'])) {
                    $labsByDomain = Lab::whereJsonContains('domain', $data['domains'])->get();
                    $labsToInvite = $labsToInvite->merge($labsByDomain);
                }

                // Exclude the current `$lab` from the invitation process
                $labsToInvite = $labsToInvite->where('id', '!=', $lab->id);

                // Log information
                Log::info('Inviting labs:', $labsToInvite->pluck('id')->toArray());

                // Invite labs and create notifications
                foreach ($labsToInvite as $labb) {
                    $project->inviteLab($labb->id);

                    // Create a notification
                    Notification::create([
                        'lab_id' => $labb->id,
                        'type' => "invite_project_collaboration",
                        'message' => "You have been invited to collaborate on the project {$project->title}.",
                    ]);
                }


                Log::info('Labs5:');


                return Redirect::route('collaboration.space.projects')->with('message', 'Invitations sent.');

            } else {
                return Redirect::route('home')->with('message', 'you are not the director of this lab');
            }

        } else {
            return Redirect::route('home');
        }
    }



    public function member_reject_phd_thesis_Invitation(Request $request, $id, $id1)
    {

        if (Auth::check()) {
            $user = User::findOrFail($id);
            $lam_m = Lab_member::where('user_id', $user->id)->first();
            $ext_m = External_member::where('user_id', $user->id)->first();

            $phd_thesis = Phd_thesis::findOrFail($id1);
            if ($lam_m || $ext_m) {


                $phd_thesis->respondToPhdthesisInvitation($user->id, 'rejected');

                return Redirect::route('collaboration.space.invitations')->with('message', 'Invitation refused.');
            } else {
                return Redirect::route('home')->with('message', 'Access denied');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function member_accept_phd_thesis_Invitation($id, $id1)
    {

        if (Auth::check()) {



            $user = User::findOrFail($id);
            $lam_m = Lab_member::where('user_id', $user->id)->first();
            $ext_m = External_member::where('user_id', $user->id)->first();

            $phd_thesis = Phd_thesis::findOrFail($id1);

            Log::info($id);
            if ($lam_m || $ext_m) {


                $phd_thesis->respondToPhdthesisInvitation($user->id, 'accepted');

                return Redirect::route('collaboration.space.invitations')->with('message', 'Invitation accepted.');
            } else {
                return Redirect::route('home')->with('message', 'Access denied');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function supervisor_cosupervisor_phd_thesis_collab_update(Request $request, $id)
    {

        if (Auth::check()) {
            $phd_thesis = Phd_thesis::where('id', $id)->first();

            $team = Team::where('id', $phd_thesis->team_id)->first();
            $supervisor = User::where('id', $phd_thesis->supervisor_id)->first();
            $cosupervisor = User::where('id', $phd_thesis->co_supervisor_id)->first();


            $phd_students_ids = json_decode($phd_thesis->phd_students_id, true);

            if ((Auth::user()->id == $supervisor->id && !empty($phd_students_ids)) || (Auth::user()->id == $cosupervisor->id && !empty($phd_students_ids))) {


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

                return Redirect::route('/')->with('message', 'thesis updated Succesfully');


            } else {
                return Redirect::route('home')->with('message', 'Access denied');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function student_phd_thesis_collab_update(Request $request, $id)
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
                    'invitations_abstract' => ['nullable', 'string'],
                ]);



                $phd_thesis->thesis_title = $data['thesis_title'];
                $phd_thesis->keywords = $data['keywords'];
                $phd_thesis->references = $data['references'];
                $phd_thesis->abstract = $data['abstract'];
                $phd_thesis->invitations_abstract = $data['invitations_abstract'];
                $phd_thesis->update();

                return Redirect::route('/')->with('message', 'thesis updated Succesfully');


            } else {
                return Redirect::route('home')->with('message', 'Access denied');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function supervisor_removePhdStudentsFromThesis($thesisId, $studentIds)
    {
        if (Auth::check()) {
            $phdThesis = Phd_thesis::findOrFail($thesisId);

            // Vérifier si l'utilisateur connecté est directeur ou superviseur
            if (Auth::user()->id == $phdThesis->supervisor->id) {

                // Décoder phd_students_id si c'est une chaîne JSON
                $phdStudentsArray = is_string($phdThesis->phd_students_id) ? json_decode($phdThesis->phd_students_id, true) : $phdThesis->phd_students_id;

                // S'assurer que $phdStudentsArray est un tableau
                if (!is_array($phdStudentsArray)) {
                    $phdStudentsArray = [];
                }

                // S'assurer que $studentIds est un tableau
                $studentIdsArray = is_array($studentIds) ? $studentIds : [$studentIds];

                // Retirer les IDs spécifiés du tableau
                $phdStudentsArray = array_diff($phdStudentsArray, $studentIdsArray);

                // Mettre à jour la thèse avec le nouveau phd_students_id
                $phdThesis->phd_students_id = array_values($phdStudentsArray);
                $phdThesis->save();

                return Redirect::route('collaboration.space.phd.thesis.view', ['id' => $thesisId])->with('message', 'Students removed from the PhD thesis.');
            } else {
                return Redirect::route('home')->with('message', 'You are not authorized to remove students from this thesis.');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function supervisor_invite_member_phd_thesis_collab(Request $request, $id)
    {



        if (Auth::check()) {
            $phd_thesis = Phd_thesis::where('id', $id)->first();

            if (Auth::user()->id == $phd_thesis->supervisor_id) {



                $data = $request->validate([
                    'invitations_abstract' => ['nullable', 'string'],
                    'lab_m' => ['nullable', 'numeric'], // Attend un tableau

                    'ext_m' => ['nullable', 'numeric'], // Attend un tableau

                ]);

                // Get the existing array of student IDs
                $phd_students_ids = $phd_thesis->phd_students_id;

                // Ensure it's an array
                if (!is_array($phd_students_ids)) {
                    $phd_students_ids = [];
                }

                // Convert phd_student_id to a string
                $phd_student_id_str = (string) $phd_thesis->phd_student_id;

                // Add the ID if it doesn't already exist
                if (!in_array($phd_student_id_str, $phd_students_ids)) {
                    $phd_students_ids[] = $phd_student_id_str;
                }

                // Assign the array back to the attribute
                $phd_thesis->phd_students_id = $phd_students_ids;


                $phd_thesis->invitations_abstract = $data['invitations_abstract'];

                $phd_thesis->update();




                // Validate the request data



                $lab_members = Lab_member::where('user_id', $data['lab_m'])->with('user')->get();




                Log::info('Labs2:');


                // Inviter ces laboratoires
                foreach ($lab_members as $lab_m) {
                    $phd_thesis->invitePhd_thesis($lab_m->user_id);

                    $notification = new Notification();
                    $notification->phd_student_id = $lab_m->user_id;
                    $notification->type = "invite_phd_thesis_collaboration";
                    $notification->message = "You have been invited to collaborate on the phd thesis{$phd_thesis->thesis_title}.";
                    $notification->save();
                }


                Log::info('Labs3:');

                // Récupérer les laboratoires par domaine
                $external_members = External_member::where('user_id', $data['ext_m'])->with('user')->get();

                Log::info('Labs4:');
                // Inviter ces laboratoires
                foreach ($external_members as $ext_m) {
                    $phd_thesis->invitePhd_thesis($ext_m->user_id);

                    $notification = new Notification();
                    $notification->phd_student_id = $ext_m->user_id;
                    $notification->type = "invite_phd_thesis_collaboration";
                    $notification->message = "You have been invited to collaborate on the phd thesis{$phd_thesis->title}.";
                    $notification->save();


                }

                Log::info('Labs5:');

                return Redirect::route('collaboration.space.phd.thesis.view', ['id' => $id])->with('message', 'Invitations sent.');

            } else {
                return Redirect::route('home')->with('message', 'Access denied');
            }

        } else {
            return Redirect::route('home');
        }
    }



    public function project_leader_mise_project_collab(Request $request, $id, $id2)
    {


        if (Auth::check()) {
            $project = Project::find($id);
            $lab = Lab::where('id', $project->lab_id)->first();
            if ($project->project_leader_id == Auth::user()->id && !empty(json_decode($project->labs_id))) {

                // Validate the request data
                $data = $request->validate([
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
                return Redirect::route('project_leaderhghg.space.team')->with('message', 'Project updated Succesfully');

            } else {
                return Redirect::route('home')->with('message', 'You are not authorized to update this project');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function director_project_member_collab_delete($id)
    {
        if (Auth::check()) {
            $project_member = Project_member::find($id);
            $project = Project::where('id', $project_member->project_id)->first();


            $labsIds = is_string($project->labs_id) ? json_decode($project->labs_id, true) ?? [] : $project->labs_id;


            // Vérifier si l'utilisateur est le directeur de l'un des laboratoires associés au projet
            $isAuthorized = Lab::whereIn('id', $labsIds)
                ->where('director_id', Auth::user()->id)
                ->exists();


            if ($isAuthorized) {


                $project_member->delete();
                return Redirect::route('/', ['id' => $project->id])->with('message', 'member deleted Succesfully');


            } else {
                return Redirect::route('home')->with('message', 'Access denied.');
            }
        } else {
            return Redirect::route('home');
        }
    }


}