<?php

namespace App\Http\Controllers\AdminF;

use App\Http\Controllers\Controller;
use App\Models\Establishment;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {


        $faculty = Faculty::with('establishment')->with('user')->where('user_id', Auth::user()->id)->first();
        $count_labs = DB::table('labs')->count();



        return Inertia::render(
            'AdminF/Dashboard',
            [
                'faculty' => $faculty,
                'count_labs' => $count_labs,
            ]
        );
    }
}
