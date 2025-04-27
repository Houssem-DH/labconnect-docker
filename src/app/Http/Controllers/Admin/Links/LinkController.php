<?php

namespace App\Http\Controllers\Admin\Links;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Link;
use App\Models\Lab;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

class LinkController extends Controller
{
    public function link_insert(request $request, $id)
    {

        if (Auth::check()) {
            if (Auth::user()->is_super_admin == 1 || Auth::user()->is_admin == 1) {

                $data = $request->validate([
                    'name' => ['required', 'string', 'max:255'],
                    'link' => ['required', 'url', 'max:255'], // Assuming 'link' is a URL
                ]);

                $link = new Link;
                $link->user_id = Auth::user()->id;
                $link->name = $data['name'];
                $link->link = $data['link'];
                $link->save();
                return Redirect::route('dashboard');
            } else {
                return Redirect::route('dashboard');
            }

        } else {
            return Redirect::route('dashboard');
        }
    }

    public function mise_link(request $request, $id)
    {

        if (Auth::check()) {
            $link = Link::find($id);
            if ((Auth::user()->is_super_admin == 1 && $link->user_id == Auth::user()->id) || (Auth::user()->is_admin == 1 && $link->user_id == Auth::user()->id)) {


                // Validate the request data
                $data = $request->validate([
                    'name' => ['required', 'string', 'max:255'],
                    'link' => ['required', 'url', 'max:255'], // Assuming 'link' is a URL
                ]);

                $link->name = $data['name'];
                $link->link = $data['link'];
                $link->update();
                return Redirect::route('dashboard');
            } else {
                return Redirect::route('dashboard');
            }

        } else {
            return Redirect::route('dashboard');
        }
    }

    public function sup_link($id)
    {
        if (Auth::check()) {
            $link = Link::find($id);
            if ((Auth::user()->is_super_admin == 1 && $link->user_id == Auth::user()->id) || (Auth::user()->is_admin == 1 && $link->user_id == Auth::user()->id)) {


                $link->delete();
                return Redirect::route('dashboard');
            } else {
                return Redirect::route('dashboard');
            }
        } else {
            return Redirect::route('dashboard');
        }

    }
}
