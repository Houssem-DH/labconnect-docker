<?php

namespace App\Http\Controllers\Admin\Speciality;

use App\Http\Controllers\Controller;
use App\Models\Domain;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\Speciality;


class SpecialityController extends Controller
{
    public function index()
    {
        $specialities = Speciality::with('domain')->orderBy('created_at', 'desc')->paginate(10); // Paginate with 10 users per page
        $domains = Domain::get(); // Paginate with 10 users per page





        return Inertia::render(
            'Admin/Specialities/index',
            [

                'specialities' => $specialities,
                'domains' => $domains,
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),

            ]

        );
    }
    public function speciality_insert(Request $request )
    {



        if (Auth::check()) {

            if (Auth::user()->is_super_admin == 1) {

                // Validate the request data
                $data = $request->validate([
                    'name' => ['required', 'string'],
                    'domain_id' => ['required', 'numeric'],

                ]);

                $speciality = new Speciality;
                $speciality->domain_id =$data['domain_id'] ;
                $speciality->name = $data['name'];
                $speciality->save();
                return Redirect::route('dashboard.specialities');
            } else {
                return Redirect::route('home');
            }

        } else {
            return Redirect::route('home');
        }

    }




    public function sup_speciality($id)
    {
        if (Auth::check()) {

            $speciality = Speciality::find($id);

            if (Auth::user()->is_super_admin == 1) {


                $speciality->delete();
                return Redirect::route('dashboard.specialities');

            } else {
                return Redirect::route('home');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function mise_speciality(Request $request, $id)
    {



        if (Auth::check()) {
            $speciality = Speciality::find($id);

            if (Auth::user()->is_super_admin == 1) {


                // Validate the request data
                $data = $request->validate([
                    'name' => ['required', 'string'],
                    'domain_id' => ['required', 'numeric'],

                ]);

                $speciality->name = $data['name'];
                $speciality->domain_id =$data['domain_id'] ;
                $speciality->update();
                return Redirect::route('dashboard.specialities');
            } else {
                return Redirect::route('home');
            }
        } else {
            return Redirect::route('home');
        }

    }
}
