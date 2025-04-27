<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Lab_member;
use App\Models\External_member;

class SessionMiddleware
{
    public function handle(Request $request, Closure $next): Response
{
    if (Auth::check()) {
        $user = Auth::user();
        $lab_member = Lab_member::where('user_id', $user->id)->first();
        $external_member = External_member::where('user_id', $user->id)->first();

        $authorizedRoles = [];

        // Case 1: User is a director
        if ($user->director == 1) {
            $authorizedRoles = [
                'director', 'team-leader', 'project-leader', 'member',
                'phd-student', 'supervisor', 'co_supervisor', 'project_member'
            ];
        }

        // Case 2: User is a lab member or external member
        if ($lab_member ) {
            // Check lab_member roles
            if ($lab_member) {
                if ($lab_member->team_leader == 1) {
                    $authorizedRoles[] = 'team-leader';
                }
                if ($lab_member->project_leader == 1) {
                    $authorizedRoles[] = 'project-leader';
                }
                if ($lab_member->phd_student == 1) {
                    $authorizedRoles[] = 'phd-student';
                }
                if ($lab_member->member == 1) {
                    $authorizedRoles[] = 'member';
                }
                if ($lab_member->is_project_member == 1) {
                    $authorizedRoles[] = 'project_member';
                }
                if ($lab_member->is_supervisor == 1) {
                    $authorizedRoles[] = 'supervisor';
                }
                if ($lab_member->is_co_supervisor == 1) {
                    $authorizedRoles[] = 'co_supervisor';
                }
            }

            
        }
        // Check external_member roles
        if ($external_member) {
            if ($external_member->is_project_member == 1) {
                $authorizedRoles[] = 'project_member';
            }
            if ($external_member->is_supervisor == 1) {
                $authorizedRoles[] = 'supervisor';
            }
            if ($external_member->is_co_supervisor == 1) {
                $authorizedRoles[] = 'co_supervisor';
            }
        }

        // Ensure unique roles in the array
        $authorizedRoles = array_unique($authorizedRoles);

        // Store the roles in the session
        $request->session()->put('user_role', $authorizedRoles);
    }

    return $next($request);
}


}
