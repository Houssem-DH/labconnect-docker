<?php

namespace App\Http\Controllers\Admin\BannedUsers;

use App\Http\Controllers\Controller;
use App\Models\Banned_users;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

class BannedUsersController extends Controller
{
    public function index()
    {
        $bannedUsers = Banned_users::with('user')->orderby('created_at', 'desc')->paginate(10);


        return Inertia::render(
            'Admin/BannedUsers/index',
            [
                'banned_users' => $bannedUsers,
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),

            ]

        );
    }


    public function revoke_ban($id)
    {
        $user = User::find($id);

        $banned_user = Banned_users::where('user_id', $id)->first();





        if ($user) {
            if (Auth::user()->is_super_admin == 1 && ($user->is_admin == 1 || $user->is_admin == 0)) {
                

                $user->is_banned = 0;
                $user->update();
                $banned_user->delete();
                return Redirect::route('dashboard.banned-users')->with('message', 'user banned successfully');
            } else {
                if (Auth::user()->is_admin == 1 && ($user->is_admin == 0)) {

                    $user->is_banned = 0;
                    $user->update();
                    $banned_user->delete();
                    return Redirect::route('dashboard.banned-users')->with('message', 'user banned successfully');


                } else {
                    return Redirect::route('dashboard.banned-users')->with('error', 'You are not authorized to ban this user');
                }
            }
        } else {
            return Redirect::route('dashboard.banned-users')->with('error', 'user not found');
        }





    }
}
