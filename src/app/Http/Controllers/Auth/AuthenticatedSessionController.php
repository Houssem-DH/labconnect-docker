<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Lab_member;
use App\Models\External_member;


class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();
    $request->session()->regenerate();

    $user = Auth::user();
    $lab_member = Lab_member::where('user_id', $user->id)->first();
    $external_member = External_member::where('user_id', $user->id)->first();

    // Director role redirect
    if ($user->director == '1') {
        return Redirect::route('director.space.home');
    }

    // Lab member or external member role redirects
    if ($lab_member || $external_member) {
        if ($lab_member) {
            if ($lab_member->team_leader == 1) {
                return Redirect::route('team.leader.space.home');
            }
            if ($lab_member->phd_student == 1) {
                return Redirect::route('phd.student.space.home');
            }
            if ($lab_member->project_leader == 1) {
                return Redirect::route('project.leader.space.home');
            }
            if ($lab_member->is_supervisor == 1) {
                return Redirect::route('supervisor.space.home');
            }
            if ($lab_member->is_co_supervisor == 1) {
                return Redirect::route('co.supervisor.space.home');
            }
            if ($lab_member->is_project_member == 1) {
                return Redirect::route('project.member.space.projects');
            }
            if ($lab_member->member == 1) {
                return Redirect::route('member.space.home');
            }
        }

        if ($external_member) {
            if ($external_member->is_supervisor == 1) {
                return Redirect::route('supervisor.space.home');
            }
            if ($external_member->is_co_supervisor == 1) {
                return Redirect::route('co.supervisor.space.home');
            }
            if ($external_member->is_project_member == 1) {
                return Redirect::route('project.member.space.projects');
            }
        }
    }

    // Admin roles redirect
    if ($user->is_super_admin == '1') {
        return Redirect::route('dashboard');
    }
    if ($user->is_admin == '1') {
        return Redirect::route('admin.dashboard');
    }

    // Default redirect
    return redirect()->intended(RouteServiceProvider::HOME);
}

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
