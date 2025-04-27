<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\lab_member;
use App\Models\External_member;

class Project_memberMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {

            $lab_member = Lab_member::where('user_id', Auth::user()->id)->where('is_project_member', 1)->get();
            $external_member = External_member::where('user_id', Auth::user()->id)->where('is_project_member', 1)->get();


            if ($lab_member || $external_member) {
                return $next($request);
            } else {
                return redirect('/');
            }
        } else {
            return redirect('/');
        }
    }
}
