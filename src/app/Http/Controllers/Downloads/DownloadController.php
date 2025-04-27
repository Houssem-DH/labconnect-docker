<?php

namespace App\Http\Controllers\Downloads;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Download;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

class DownloadController extends Controller
{
    public function download_insert(request $request)
    {

        if (Auth::check()) {

            // Validate the request data
            $data = $request->validate([
                'type' => ['required', 'string', 'max:255'],
                'title' => ['required', 'string', 'max:255'],
                'file' => ['required', 'file', 'max:10240'], // Assuming 'file' is for file uploads with a maximum size of 10 MB
            ]);

            $download = new Download;

            if ($request->hasFile('file')) {

                $file = $request->file('file')->store("downloads files/", 'public');
                $download->file = $file;
            }

            $download->user_id = Auth::user()->id;
            $download->type = $data['type'];
            $download->title = $data['title'];
            $download->save();
            return Redirect::route('/');

        } else {
            return Redirect::route('home');
        }
    }


    public function mise_download(request $request, $id)
    {


        if (Auth::check()) {
            $download = Download::find($id);
            if (Auth::user()->id == $download->user_id || Auth::user()->director == 1) {

                // Validate the request data
                $data = $request->validate([
                    'type' => ['required', 'string', 'max:255'],
                    'title' => ['required', 'string', 'max:255'],
                    'file' => ['required', 'file', 'max:10240'], // Assuming 'file' is for file uploads with a maximum size of 10 MB
                ]);


                if ($request->hasFile('file')) {

                    // Get the full path to the avatar file
                    $file = $download->file;

                    // Check if the file exists in storage before attempting to delete it
                    if ($file) {
                        // Delete the avatar file
                        Storage::disk('public')->delete($file);
                    }


                    // Store the uploaded avatar file in the storage disk

                    $file = $request->file('file')->store("downloads files/{$id}", 'public');

                    // Update the user's avatar field with the path
                    $download->file = $file;
                }

                $download->type = $data['type'];
                $download->title = $data['title'];
                $download->update();
                return Redirect::route('/');

            } else {
                return Redirect::route('home');
            }

        } else {
            return Redirect::route('home');
        }
    }

    public function sup_download($id)
    {
        if (Auth::check()) {

            $download = Download::find($id);
            if (Auth::user()->id == $download->user_id || Auth::user()->director == 1) {



                if ($download->file) {

                    // Get the full path to the avatar file
                    $file = $download->file;

                    // Check if the file exists in storage before attempting to delete it
                    if ($file) {
                        // Delete the avatar file
                        Storage::disk('public')->delete($file);
                    }
                }
                $download->delete();
                return Redirect::route('/');

            } else {
                return Redirect::route('home');
            }

        } else {
            return Redirect::route('home');
        }

    }
}
