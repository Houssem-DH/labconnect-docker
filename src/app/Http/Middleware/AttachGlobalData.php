<?php

namespace App\Http\Middleware;

use App\Models\Lab_member;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class AttachGlobalData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Add global data to the Inertia response
        Inertia::share([
            'labMember' => Auth::check() ? Lab_member::where('user_id', Auth::user()->id)->first() ?? [] : [],
        ]);

        return $next($request);
    }
}

