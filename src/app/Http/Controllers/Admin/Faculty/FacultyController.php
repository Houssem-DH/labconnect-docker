<?php

namespace App\Http\Controllers\Admin\Faculty;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Faculty;
use Illuminate\Support\Facades\Redirect;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Models\Establishment;







class FacultyController extends Controller
{

    public function index()
    {
        $users = User::where('is_admin', 1)->get();
        $faculties = Faculty::with('establishment')->with('user')->orderBy('created_at', 'desc')->paginate(10); // Paginate with 10 users per page
        $establishments = Establishment::where('type', "University")->orderBy('created_at', 'desc')->get(); // Paginate with 10 users per page




        return Inertia::render(
            'Admin/Faculty/index',
            [
                'users' => $users,
                'faculties' => $faculties,
                'establishments' => $establishments,
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),

            ]

        );
    }

    public function faculty_insert(Request $request)
    {



        if (Auth::check()) {

            if (Auth::user()->is_super_admin == 1) {


                // Validate the request data
                $data = $request->validate([

                    'user_id' => ['required', 'numeric'],
                    'establishment_id' => ['required', 'numeric'],
                    'name' => ['required', 'string', 'max:255'],

                ]);

                $faculty = new Faculty;

                $faculty->establishment_id = $data['establishment_id'];
                $faculty->user_id = $data['user_id'];
                $faculty->name = $data['name'];
                $faculty->save();
                return Redirect::route('dashboard.faculty');
            } else {
                return Redirect::route('home');
            }
        } else {
            return Redirect::route('home');
        }

    }




    public function sup_faculty($id)
    {
        if (Auth::check()) {

            $faculty = Faculty::find($id);

            if (Auth::user()->is_super_admin == 1) {


                $faculty->delete();
                return Redirect::route('dashboard.faculty');

            } else {
                return Redirect::route('home');
            }

        } else {
            return Redirect::route('home');
        }

    }


    public function mise_faculty(Request $request, $id)
    {



        if (Auth::check()) {
            $faculty = Faculty::find($id);

            if (Auth::user()->is_super_admin == 1) {


                // Validate the request data
                $data = $request->validate([
                    'user_id' => ['required', 'numeric'],
                    'name' => ['required', 'string', 'max:255'],
                    'establishment_id' => ['required', 'numeric'],

                ]);
                $faculty->establishment_id = $data['establishment_id'];
                $faculty->user_id = $data['user_id'];
                $faculty->name = $data['name'];
                $faculty->update();
                return Redirect::route('dashboard.faculty');
            } else {
                return Redirect::route('home');
            }
        } else {
            return Redirect::route('home');
        }

    }


}
