<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Lab;
use App\Models\Lab_member;
use App\Models\Material;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Project;
use App\Models\Service;
use App\Models\Domain;
use App\Models\Team;
use App\Models\team_member;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class HomeController extends Controller
{

    public function index()
    {
        Notification::where('created_at', '<', Carbon::now()->subMonth())->delete();

        // Existing counts
        $count_users = DB::table('users')->count();
        $count_labs = DB::table('labs')->count();
        $count_projects = DB::table('projects')->count();

        // New counts for Productions, Services, and Teams
        $count_productions = DB::table('scientific_productions')->count(); // Assuming 'productions' table exists
        $count_services = DB::table('services')->count(); // Assuming 'services' table exists
        $count_teams = DB::table('teams')->count(); // Assuming 'teams' table exists

        if (Auth::check()) {
            $labMember = Lab_member::where('user_id', Auth::user()->id)->first();

            return Inertia::render('Home', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'labMember' => $labMember,
                'count_users' => $count_users,
                'count_labs' => $count_labs,
                'count_projects' => $count_projects,
                'count_productions' => $count_productions,
                'count_services' => $count_services,
                'count_teams' => $count_teams,
            ]);
        } else {
            return Inertia::render('Home', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'count_users' => $count_users,
                'count_labs' => $count_labs,
                'count_projects' => $count_projects,
                'count_productions' => $count_productions,
                'count_services' => $count_services,
                'count_teams' => $count_teams,
            ]);
        }
    }

    public function labs()
    {

        $labs = Lab::orderBy('created_at', 'desc')->get();
        $domains = Domain::orderBy('created_at', 'desc')->get();
        $services = Service::orderBy('created_at','desc')->get();
        $materials=Material::orderBy('created_at','desc')->get();
        $lab_members=Lab_member::with('user')->orderBy('created_at','desc')->get();

        return Inertia::render('Labs', [
            'labs' => $labs,
            'domains' => $domains,
            'services' => $services,
            'materials'=> $materials,
            'labMembers'=> $lab_members,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),

        ]);

    }

    public function lab_index($id)
    {

        $lab = Lab::where('id', $id)->with('faculty', 'director')->first();
        $members = Lab_member::with('user', 'team_member.team')->where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();
        $teams = Team::where('lab_id', $lab->id)->orderBy('created_at', 'desc')->get();

        // Fetch team members for each team
        foreach ($teams as $team) {
            $team->team_member = team_member::with('team.lab.lab_members', 'user')->where('team_id', $team->id)->get();

        }
        $materials = Material::where('lab_id', $id)->orderBy('created_at', 'desc')->get();

        $projects = Project::where('lab_id', $id)->where('project_display', 1)->orderBy('created_at', 'desc')->with('user')->get();
        $services = Service::where('lab_id', $id)->get();

        $lab_members_all = Lab_member::with('user', 'lab')->get();

        return Inertia::render('LabIndex', [
            'lab' => $lab,
            'teams' => $teams,
            'members' => $members,
            'materials' => $materials,
            'projects' => $projects,
            'services' => $services,
            'lab_members_all' => $lab_members_all,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),

        ]);

    }

    public function about()
    {

        $count_users = DB::table('users')->count();
        $count_labs = DB::table('labs')->count();
        $count_projects = DB::table('projects')->count();

        return Inertia::render('About', [

            'count_users' => $count_users,
            'count_labs' => $count_labs,
            'count_projects' => $count_projects,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),

        ]);

    }

    public function service_request($serviceId)
    {

        $service = Service::where('id', $serviceId)->first();

        return Inertia::render('ServiceRequest', [

            'service' => $service,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),

        ]);

    }

    public function chat($userId1, $userId2)
    {
        // Find existing chat or create a new one if it doesn't exist
        $chat = Chat::where(function ($query) use ($userId1, $userId2) {
            $query->where('user_one_id', $userId1)
                ->where('user_two_id', $userId2);
        })->orWhere(function ($query) use ($userId1, $userId2) {
            $query->where('user_one_id', $userId2)
                ->where('user_two_id', $userId1);
        })->first();

        if (!$chat) {
            // Create new chat if it does not exist
            $chat = new Chat();
            $chat->user_one_id = $userId1;
            $chat->user_two_id = $userId2;
            $chat->save();
        }

        // Retrieve messages for the chat
        $messages = Message::where('chat_id', $chat->id)->get();

        return Inertia::render('Chat', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'chat' => $chat,
            'messages' => $messages,
        ]);
    }

    public function location()
    {

        return Inertia::render('Location', [

            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),

        ]);

    }

    public function showResults(Request $request)
    {
        $query = $request->query('query'); // Capture the search query from the URL

        // Validate the query input to ensure it's safe
        if (!$query) {
            return Inertia::render('Search', [
                'query' => '',
                'labs' => [],
                'services' => [],
            ]);
        }

        // Perform search queries on multiple models, including 'keywords' field
        $labs = Lab::where(function ($queryBuilder) use ($query) {
            $queryBuilder->where('title', 'like', '%' . $query . '%')
                ->orWhere('Keywords', 'like', '%' . $query . '%'); // Adding search by keywords
        })->get();

        $services = Service::where(function ($queryBuilder) use ($query) {
            $queryBuilder->where('title', 'like', '%' . $query . '%')
                ->orWhere('Keywords', 'like', '%' . $query . '%'); // Adding search by keywords
        })->with('lab') // Eager load the lab relationship for services
            ->get();

        // Return search results to the front-end using Inertia
        return Inertia::render('Search', [
            'query' => $query,
            'labs' => $labs,
            'services' => $services,
        ]);
    }

}
