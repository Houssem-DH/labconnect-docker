<?php

namespace App\Http\Controllers\ProjectCollabRequest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Lab;
use App\Models\Project_collab_request;
use Illuminate\Support\Facades\Redirect;



class ProjectCollabRequestController extends Controller
{
    public function project_collab_request_insert(Request $request, $id)
    {

        if (Auth::check()) {
            $lab = Lab::where('id', $id)->first();
            if (Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {


                // Validate the request data
                $data = $request->validate([

                    'domain' => ['required', 'array'], // Attend un tableau
                    'domain.*' => ['string'], // Chaque élément du tableau doit être une chaîne
                    'title' => ['required', 'string', 'max:255'],
                    'problematic' => ['required', 'string'],
                    'objective' => ['required', 'string'],
                    
                ]);


                $project_collab_request = new Project_collab_request;
               
                $project_collab_request->lab_id = $id;
                $project_collab_request->domain = json_encode($data['domain']);
                $project_collab_request->title = $data['title'];
                $project_collab_request->problematic = $data['problematic'];
                $project_collab_request->objective = $data['objective'];
                $project_collab_request->save();

            
                return Redirect::route('director.space.collaboration')->with('message', 'Project Request Created Succesfully');

            } else {
                return Redirect::route('home')->with('message', 'you should be the director of this lab ');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function mise_collab_request(Request $request, $id)
    {


        if (Auth::check()) {
            $project_collab_request = Project_collab_request::find($id);
            $lab = Lab::where('id', $project_collab_request->lab_id)->first();
            if ( Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {

                // Validate the request data
                $data = $request->validate([
                    'domain' => ['required', 'array'], // Attend un tableau
                    'domain.*' => ['string'], // Chaque élément du tableau doit être une chaîne
                    'title' => ['required', 'string', 'max:255'],
                    'problematic' => ['required', 'string'],
                    'objective' => ['required', 'string'],
                ]);


                $project_collab_request->domain = json_encode($data['domain']);
                $project_collab_request->title = $data['title'];
                $project_collab_request->problematic = $data['problematic'];
                $project_collab_request->objective = $data['objective'];
                $project_collab_request->update();
                return Redirect::route('director.space.team');

            } else {
                return Redirect::route('home');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function sup_collab_request($id, $id2)
    {
        if (Auth::check()) {
            $project_collab_request = Project_collab_request::find($id);
            $lab = Lab::where('id', $project_collab_request->lab_id)->first();
            if ( Auth::user()->director == 1 && Auth::user()->id == $lab->director_id) {


                $project_collab_request->delete();

                return Redirect::route('director.space.team');

            } else {
                return Redirect::route('home');
            }

        } else {
            return Redirect::route('home');
        }

    }
}
