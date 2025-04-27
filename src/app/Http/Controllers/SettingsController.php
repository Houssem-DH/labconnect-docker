<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

use Inertia\Response;

class SettingsController extends Controller
{
    public function index()
    {






        return Inertia::render(
            'Settings/index',
            [


                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),

            ]

        );
    }
}
