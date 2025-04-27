<?php

namespace App\Http\Controllers\Admin\Domain;

use App\Http\Controllers\Controller;
use App\Models\Speciality;
use Illuminate\Http\Request;
use App\Models\Domain;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;






class DomainController extends Controller
{
    public function index()
    {
        $domains = Domain::orderBy('created_at', 'desc')->paginate(10); // Paginate with 10 users per page





        return Inertia::render(
            'Admin/Domains/index',
            [

                'domains' => $domains,
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),

            ]

        );
    }
    public function domain_insert(Request $request)
    {



        if (Auth::check()) {

            if (Auth::user()->is_super_admin == 1) {

                // Validate the request data
                $data = $request->validate([
                    'name' => ['required', 'string'],

                ]);

                $domain = new Domain;
                $domain->name = $data['name'];
                $domain->save();
                return Redirect::route('dashboard.domains');
            } else {
                return Redirect::route('home');
            }

        } else {
            return Redirect::route('home');
        }

    }




    public function sup_domain($id)
    {
        if (Auth::check()) {

            $domain = Domain::find($id);
            $specialities = Speciality::where('domain_id', $id)->get();

            if (Auth::user()->is_super_admin == 1) {


                foreach ($specialities as $speciality) {
                    $speciality->delete();
                }
                $domain->delete();
                return Redirect::route('dashboard.domains');

            } else {
                return Redirect::route('home');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function mise_domain(Request $request, $id)
    {



        if (Auth::check()) {
            $domain = Domain::find($id);

            if (Auth::user()->is_super_admin == 1) {


                // Validate the request data
                $data = $request->validate([
                    'name' => ['required', 'string'],
                ]);

                $domain->name = $data['name'];
                $domain->update();
                return Redirect::route('dashboard.domains');
            } else {
                return Redirect::route('home');
            }
        } else {
            return Redirect::route('home');
        }

    }
}
