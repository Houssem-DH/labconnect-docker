<?php

namespace App\Http\Controllers\Admin\Establishment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Establishment;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Models\Faculty;





class EstablishmentController extends Controller
{

    public function index()
    {
        $establishments = Establishment::orderBy('created_at', 'desc')->paginate(50); // Paginate with 10 users per page





        return Inertia::render(
            'Admin/Establishment/index',
            [

                'establishments' => $establishments,
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),

            ]

        );
    }
    public function establishment_insert(Request $request)
    {



        if (Auth::check()) {

            if (Auth::user()->is_super_admin == 1) {


                // Validate the request data
                $data = $request->validate([
                    'type' => ['required', 'string', 'max:255'],
                    'name' => ['required', 'string'],
                    'wilaya' => ['required', 'string', 'max:255'],

                ]);

                $establishment = new Establishment;

                $establishment->type = $data['type'];
                $establishment->name = $data['name'];
                $establishment->wilaya = $data['wilaya'];
                $establishment->save();
                return Redirect::route('dashboard.establishments');
            } else {
                return Redirect::route('home');
            }
        } else {
            return Redirect::route('home');
        }

    }




    public function sup_establishment($id)
    {
        if (Auth::check()) {
            $establishment = Establishment::find($id);
            $faculties = Faculty::where('establishment_id', $id)->get();

            if (Auth::user()->is_super_admin == 1) {
                // Loop through faculties and delete them
                foreach ($faculties as $faculty) {
                    $faculty->delete();
                }

                // Delete the establishment
                $establishment->delete();

                return Redirect::route('dashboard.establishment');
            } else {
                return Redirect::route('home');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function mise_establishment(Request $request, $id)
    {



        if (Auth::check()) {
            $establishment = Establishment::find($id);

            if (Auth::user()->is_super_admin == 1) {


                // Validate the request data
                $data = $request->validate([

                    'type' => ['required', 'string', 'max:255'],
                    'name' => ['required', 'string'],
                    'wilaya' => ['required', 'string', 'max:255'],
                ]);

                $establishment->type = $data['type'];
                $establishment->name = $data['name'];
                $establishment->wilaya = $data['wilaya'];
                $establishment->update();
                return Redirect::route('dashboard.establishment');
            } else {
                return Redirect::route('home');
            }
        } else {
            return Redirect::route('home');
        }

    }

}
