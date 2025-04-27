<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{

    public function index()
    {


        $count_users = DB::table('users')->count();
        $count_banned_users = DB::table('banned_users')->count();
        $count_labs = DB::table('labs')->count();
        return Inertia::render('Admin/Dashboard',
        [
            'count_users' => $count_users,
            'count_banned_users' => $count_banned_users,
            'count_labs' => $count_labs,
        ]);
    }

}
