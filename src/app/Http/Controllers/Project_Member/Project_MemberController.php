<?php

namespace App\Http\Controllers\Project_Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
use App\Models\Project;
use App\Models\User;
use App\Models\Lab;
use Illuminate\Support\Facades\Log;
use App\Models\Lab_member;
use App\Models\Project_member;
use App\Models\Project_global_report;
use App\Models\Project_personal_report;
use App\Models\External_member;
use Session;


class Project_MemberController extends Controller
{
    /*public function project_member_insert_in_lab(Request $request, $id)
    {

        if (Auth::check()) {

            $project = Project::find($id);
            $lab = Lab::where('director_id', Auth::user()->id)->first();
            if ($project->project_leader_id == Auth::user()->id || (Auth::user()->director == 1 && $lab)) {


                // Validate the request data
                $data = $request->validate([
                    'user_id' => ['required', 'numeric'],
                ]);


                $project_member = new Project_member;
                $project_member->project_id = $id;
                $project_member->user_id = $data['user_id'];
                $project_member->save();
                return Redirect::route('lab.project.manage', ['id' => $id]);

            } else {
                return Redirect::route('home');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function project_insert_out_lab(Request $request, $id)
    {

        if (Auth::check()) {

            $project = Project::find($id);
            $lab = Lab::where('director_id',Auth::user()->id)->first();
            if ($project->project_leader_id==Auth::user()->id|| (Auth::user()->director == 1 && $lab )) {


                $data = $request->validate([
                    'user_id' => ['required', 'numeric'],
                ]);

                $project_member = new Project_member;
                $project_member->project_id = $id;
                $project_member->user_id = $data['user_id'];
                $project_member->save();


                return Redirect::route('lab.project.manage', ['id' => $id]);

            } else {
                return Redirect::route('home');
            }
        } else {
            return Redirect::route('home');
        }
    }


    public function sup_project_member($id)
    {

        if (Auth::check()) {
            $project_member = Project_member::find($id);
            $project = Project::where('id', $project_member->project_id)->first();

            $lab = Lab::where('director_id', Auth::user()->id)->first();
            if ($project->project_leader_id==Auth::user()->id|| (Auth::user()->director == 1 && $lab )) {

                $project_member->delete();
                return Redirect::route('lab.project.manage', ['id' => $project->id]);


            } else {
                return Redirect::route('home');
            }



        } else {
            return Redirect::route('home');
        }

    }*/


    public function home()
    {
        if (Auth::check()) {
            $user = Auth::user();

            // Retrieve project members for the authenticated user
            $project_members = Project_member::where('user_id', $user->id)->get();
            $project_member_ids = $project_members->pluck('project_id')->toArray();

            // Retrieve the external_member record
            $external_member = External_member::where('user_id', $user->id)->first();

            // Initialize projects variable
            $projects = collect(); // Initialize as an empty collection

            // Fetch projects for normal project members
            $projects = Project::whereIn('id', $project_member_ids)->with('user')->get();

            // Check if the user is an external member and has project IDs
            if ($external_member && $external_member->project_id) {
                // Decode the JSON project_id field
                $external_project_ids = json_decode($external_member->project_id, true);

                // Fetch external projects that are not already included
                $external_projects = Project::whereIn('id', $external_project_ids)
                    ->whereNotIn('id', $project_member_ids) // Exclude projects already included
                    ->with('user')
                    ->get();

                // Merge external projects into the projects collection
                $projects = $projects->merge($external_projects);
            }

            $userRole = Session::get('user_role'); // Get session variable
            return Inertia::render(
                'ProjectMember/Home',
                [
                    'project_member' => $project_members,
                    'projects' => $projects,
                    'userRole' => $userRole,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]
            );
        } else {
            return Redirect::route('home');
        }
    }



    public function project_index($id)
    {


        if (Auth::check()) {


            $projectDetails = Project::where('id', $id)->first();
            $isMember = Project_member::where('project_id', $projectDetails->id)
                ->where('user_id', Auth::user()->id)
                ->exists();




            $labs = Lab::all();
            $lab_members_all = Lab_member::with('user', 'lab')->get();
            // Get all external members with their associated users
            // Get all external members with their associated users
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



            if ($isMember || $noProjectMembers) {



                $projectMembers = Project_member::where('project_id', $projectDetails->id)->with('user')->get();



                $personalReports = Project_personal_report::where('project_id', $projectDetails->id)->with('user')->get();
                $personalReport = Project_personal_report::where('project_member_id', Auth::user()->id)->where('project_id', $projectDetails->id)->with('user')->first();

                $globalReport = Project_global_report::where('project_id', $projectDetails->id)->where('project_leader_id', $projectDetails->project_leader_id)->with('user')->first();


                // Check if the user is a project member in the Project_member table
                $isProjectMember = Project_member::where('user_id', Auth::user()->id)
                    ->where('project_id', $id)
                    ->exists();

                // Check if the user is an external member of the project in the external_members table
                $isExternalMember = External_member::where('user_id', Auth::user()->id)
                    ->whereJsonContains('project_id', $id)
                    ->exists();

                $userRole = Session::get('user_role'); // Get session variable

                return Inertia::render('ProjectMember/ManageProject', [
                    'personalReport' => $personalReport,
                    'personalReports' => $personalReports,
                    'globalReport' => $globalReport,
                    'labs' => $labs,
                    'isProjectMember' => $isProjectMember,
                    'isExternalMember' => $isExternalMember,
                    'userRole' => $userRole,
                    'lab_members_all' => $lab_members_all,
                    'projectDetails' => $projectDetails,
                    'projectMembers' => $projectMembers,
                    'noProjectMembers' => $noProjectMembers,
                    'canLogin' => Route::has('login'),
                    'canRegister' => Route::has('register'),
                ]);
            } else {
                return Redirect::route('/')->with('message', 'you are not a member of this project');
            }
        } else {
            return Redirect::route('home');
        }



    }


    public function project_personal_report_insert(Request $request, $id)
    {
        if (Auth::check()) {
            $project = Project::find($id);

            if (!$project) {
                return Redirect::route('home')->with('message', 'Project not found');
            }

            $isMember = Project_member::where('project_id', $project->id)
                ->where('user_id', Auth::user()->id)
                ->exists();

            $externalMembers = External_member::with('user')->get();
            // Filter external members where project_id contains the numeric project ID
            $noProjectMembers = $externalMembers->filter(function ($member) use ($id) {
                $projectIds = json_decode($member->project_id, true);

                // Ensure $projectIds is an array
                $projectIds = is_array($projectIds) ? $projectIds : [];

                // Check if the numeric project ID exists in the decoded project IDs
                return in_array($id, $projectIds);
            });



            if ($isMember || $noProjectMembers) {
                $exist_project_personal_report = Project_personal_report::where('project_id', $project->id)
                    ->where('project_member_id', Auth::user()->id)
                    ->first();

                if (!$exist_project_personal_report) {
                    // Validate the request data
                    $data = $request->validate([
                        'advancement_state' => ['nullable', 'string'],
                        'scientific_production' => ['nullable', 'string'], // Expecting an array
                    ]);

                    $project_personal_report = new Project_personal_report();
                    $project_personal_report->project_id = $id;
                    $project_personal_report->project_member_id = Auth::user()->id;
                    $project_personal_report->advancement_state = $data['advancement_state'];
                    $project_personal_report->scientific_production = json_encode($data['scientific_production']);
                    $project_personal_report->save();

                    return Redirect::route('project.member.project.manage', ['id' => $id])
                        ->with('message', 'Report added successfully');
                } else {
                    return Redirect::route('project.member.project.manage', ['id' => $id])
                        ->with('message', 'A report is already added to this project');
                }
            } else {
                return Redirect::route('home')->with('message', 'You are not a member of this project');
            }
        } else {
            return Redirect::route('home')->with('message', 'Please log in to continue');
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
            $externalMembers = External_member::with('user')->get();
            // Filter external members where project_id contains the numeric project ID
            $noProjectMembers = $externalMembers->filter(function ($member) use ($id) {
                $projectIds = json_decode($member->project_id, true);

                // Ensure $projectIds is an array
                $projectIds = is_array($projectIds) ? $projectIds : [];

                // Check if the numeric project ID exists in the decoded project IDs
                return in_array($id, $projectIds);
            });


            if (($isMember || $noProjectMembers) && $project_personal_report->project_member_id == Auth::user()->id) {



                // Validate the request data
                $data = $request->validate([

                    'advancement_state' => ['nullable', 'string'],
                    'scientific_production' => ['nullable', 'string'], // Attend un tableau


                ]);


                $project_personal_report->advancement_state = $data['advancement_state'];
                $project_personal_report->scientific_production = json_encode($data['scientific_production']);
                $project_personal_report->update();


                return Redirect::route('project.member.project.manage', ['id' => $project->id])->with('message', 'report updated  Succesfully');


            } else {
                return Redirect::route('home')->with('message', 'you are not a member of this project');
            }
        } else {
            return Redirect::route('home');
        }

    }

    public function sup_project_personal_report($id)
    {
        if (Auth::check()) {

            $project_personal_report = Project_personal_report::find($id);
            $project = Project::where('id', $project_personal_report->poject_id)->first();

            $isMember = Project_member::where('project_id', $project->id)
                ->where('user_id', Auth::user()->id)
                ->exists();



            if ($isMember && $project_personal_report->project_member_id == Auth::user()->id) {


                $project_personal_report->delete();
                return Redirect::route('/', ['id' => $id])->with('message', 'report deleted Succesfully');

            } else {
                return Redirect::route('home')->with('message', 'you are not the creator of this project');
            }

        } else {
            return Redirect::route('home');
        }

    }


}
