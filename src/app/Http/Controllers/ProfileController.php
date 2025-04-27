<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Banned_users;
use App\Models\Career;
use App\Models\Scientific_event;
use App\Models\Master_thesis;
use App\Models\Professional_Experience;
use App\Models\Establishment;
use App\Models\Faculty;
use App\Models\Teaching;
use App\Models\User;
use App\Models\Lab_Member;
use App\Models\Domain;
use App\Models\Speciality;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request, $id): Response
    {



        $user = User::where('id', $id)->first();
        $banned_user = Banned_users::where('user_id', $id)->first();



        $establishment = Establishment::get();
        $faculties = Faculty::get();
        $labm = Lab_Member::where("user_id", $id)->first();
        $masterTheses = Master_thesis::where("user_id", $id)->get();
        $teachingExperiences = Teaching::where("user_id", $id)->get();
        $scientificEvents = Scientific_event::where("user_id", $id)->get();


        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'banned_user' => $banned_user,
            'labm' => $labm,
            'user' => $user,
            'masterTheses' => $masterTheses,
            'teachingExperiences' => $teachingExperiences,
            'scientificEvents' => $scientificEvents,



            'establishment' => $establishment,
            'faculties' => $faculties,
        ]);
    }

    /**
     * Update the user's profile information.
     */

    public function update_background_photo(Request $request, $id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Validate the incoming request data
        $request->validate([
            'background_photo' => ['image', 'nullable', 'max:10240'], // Validate if the uploaded file is an image and its maximum size
        ]);



        // Handle avatar upload if provided
        if ($request->hasFile('background_photo')) {

            // Get the full path to the avatar file
            $backgroundPhotoPath = $user->background_photo;

            // Check if the file exists in storage before attempting to delete it
            if ($backgroundPhotoPath) {
                // Delete the avatar file
                Storage::disk('public')->delete($backgroundPhotoPath);
            }


            // Store the uploaded avatar file in the storage disk

            $backgroundPhotoPath = $request->file('background_photo')->store("background photos/{$id}", 'public');

            // Update the user's avatar field with the path
            $user->background_photo = $backgroundPhotoPath;
        }

        // Save the user
        $user->save();

        return redirect()->route('profile.edit', ['id' => $id]);
    }


    public function update_avatar(Request $request, $id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Validate the incoming request data
        $request->validate([
            'avatar' => ['image', 'nullable', 'max:2048'], // Validate if the uploaded file is an image and its maximum size
        ]);



        // Handle avatar upload if provided
        if ($request->hasFile('avatar')) {

            // Get the full path to the avatar file
            $avatarPath = $user->avatar;

            // Check if the file exists in storage before attempting to delete it
            if ($avatarPath) {
                // Delete the avatar file
                Storage::disk('public')->delete($avatarPath);
            }


            // Store the uploaded avatar file in the storage disk

            $avatarPath = $request->file('avatar')->store("avatars/{$id}", 'public');

            // Update the user's avatar field with the path
            $user->avatar = $avatarPath;
        }

        // Save the user
        $user->save();

        return redirect()->route('profile.edit', ['id' => $id]);
    }








    public function update(Request $request, $id)
    {


        // Find the user by ID
        $user = User::findOrFail($id);
        $labm = Lab_Member::where('user_id', $user->id)->first();


        // Validate the incoming request data
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone_number' => ['nullable', 'numeric', 'regex:/^0[0-9]{9}$/'],


        ]);


        if ($labm) {
            $data1 = $request->validate([
                'domain' => ['nullable', 'string'],
                'speciality' => ['nullable', 'string'],
            ]);

            $isDomain = Domain::where('name', $data1['domain'])->first();
            $isSpeciality = Speciality::where('name', $data1['speciality'])->first();

            // Domain and specialty creation/updating
            if (!$isDomain && !$isSpeciality) {
                $domain = new Domain;
                $domain->name = $data1['domain'];
                $domain->save();

                $speciality = new Speciality;
                $speciality->name = $data1['speciality'];
                $speciality->domain_id = $domain->id;
                $speciality->save();
            } elseif ($isDomain && !$isSpeciality) {
                $speciality = new Speciality;
                $speciality->name = $data1['speciality'];
                $speciality->domain_id = $isDomain->id;
                $speciality->save();

                $domain = Domain::where('id', $isDomain->id)->first();
            } else {
                $speciality = Speciality::where('id', $isSpeciality->id)->first();
                $domain = Domain::where('id', $isDomain->id)->first();
            }

            // Create new lab member


            $labm->research_domain = $domain->name;
            $labm->research_specialty = $speciality->name;



            $labm->update();

        }


        // Update the user's username and email
        $user->first_name = $data['first_name'];
        $user->last_name = $data['last_name'];
        $user->email = $data['email'];
        $user->phone_number = $data['phone_number'];



        //$user->director = $data['isLabDirector'] == TRUE ? '1' : '0';


        // Save the user
        $user->update();

        return redirect()->route('profile.edit',['id' => $id]);
    }



    public function teaching_insert(Request $request, $id)
    {



        if (Auth::check()) {
            $user = User::findOrFail($id);
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {


                // Validate the request data
                $data = $request->validate([
                    'module' => ['required', 'string', 'max:255'],
                    'speciality' => ['nullable', 'string'],
                    'level' => ['nullable', 'string', 'max:255'],
                    'year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')], // Ensuring the year is within a reasonable range

                ]);





                $teaching = new Teaching;


                $teaching->user_id = $id;
                $teaching->module = $data['module'];
                $teaching->speciality = $data['speciality'];
                $teaching->level = $data['level'];
                $teaching->year = $data['year'];
                $teaching->save();
                return Redirect::route('profile.edit', ['id' => $id])->with('message', 'Added Successfully');

            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }

    public function teaching_update(Request $request, $id)
    {



        if (Auth::check()) {
            $teaching = Teaching::find($id);
            $user = User::where('id', $teaching->user_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {


                // Validate the request data
                $data = $request->validate([
                    'module' => ['required', 'string', 'max:255'],
                    'speciality' => ['nullable', 'string'],
                    'level' => ['nullable', 'string', 'max:255'],
                    'year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')], // Ensuring the year is within a reasonable range

                ]);


                $teaching->module = $data['module'];
                $teaching->speciality = $data['speciality'];
                $teaching->level = $data['level'];
                $teaching->year = $data['year'];
                $teaching->update();
                return Redirect::route('profile.edit', ['id' => $user->id])->with('message', ' updated Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }

    public function teaching_delete(Request $request, $id)
    {



        if (Auth::check()) {
            $teaching = Teaching::find($id);
            $user = User::where('id', $teaching->user_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {



                $teaching->delete();


                return Redirect::route('profile.edit', ['id' => $user->id])->with('message', ' deleted Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }



    public function master_thesis_insert(Request $request, $id)
    {



        if (Auth::check()) {
            $user = User::findOrFail($id);
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {


                // Validate the request data
                $data = $request->validate([
                   
                    'title' => ['required', 'string'],
                    'speciality' => ['nullable', 'string'],
                    'student' => ['nullable', 'string', 'max:255'],
                    'year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')], // Ensuring the year is within a reasonable range

                ]);


                
                $master_thesis = new Master_thesis;


                $master_thesis->user_id = $id;
                $master_thesis->title = $data['title'];
                $master_thesis->speciality = $data['speciality'];
                $master_thesis->student = $data['student'];
                $master_thesis->year = $data['year'];
                $master_thesis->save();
                return Redirect::route('profile.edit', ['id' => $id])->with('message', 'master thesis Added Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }



    public function master_thesis_update(Request $request, $id)
    {



        if (Auth::check()) {
            $master_thesis = Master_thesis::find($id);
            $user = User::where('id', $master_thesis->user_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {


                // Validate the request data
                $data = $request->validate([
                    'title' => ['required', 'string'],
            
                    'speciality' => ['nullable', 'string'],
                    'student' => ['nullable', 'string', 'max:255'],
                    'year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')], // Ensuring the year is within a reasonable range

                ]);

               

                $master_thesis->title = $data['title'];
                $master_thesis->speciality = $data['speciality'];
                $master_thesis->student = $data['student'];
                $master_thesis->year = $data['year'];
                $master_thesis->update();
                return Redirect::route('profile.edit', ['id' => $user->id])->with('message', 'master thesis updated Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function master_thesis_delete(Request $request, $id)
    {



        if (Auth::check()) {
            $master_thesis = Master_thesis::find($id);
            $user = User::where('id', $master_thesis->user_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {



                $master_thesis->delete();


                return Redirect::route('profile.edit', ['id' => $user->id])->with('message', 'master thesis deleted Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function event_insert(Request $request, $id)
    {



        if (Auth::check()) {
            $user = User::findOrFail($id);
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {


                // Validate the request data
                $data = $request->validate([
                    'title' => ['required', 'string'],
                    'description' => ['required', 'string'],
                ]);


                $scientific_event = new Scientific_event;


                $scientific_event->user_id = $id;
                $scientific_event->title = $data['title'];
                $scientific_event->description = $data['description'];
                $scientific_event->save();
                return Redirect::route('profile.edit', ['id' => $id])->with('message', 'scientific event Added Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }



    public function event_update(Request $request, $id)
    {



        if (Auth::check()) {
            $scientific_event = Scientific_event::find($id);
            $user = User::where('id', $scientific_event->user_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {


                // Validate the request data
                $data = $request->validate([
                    'title' => ['required', 'string'],
                    'description' => ['required', 'string'],
                ]);



                $scientific_event->title = $data['title'];
                $scientific_event->description = $data['description'];
                $scientific_event->update();
                return Redirect::route('profile.edit', ['id' => $user->id])->with('message', 'scientific event updated Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }


    public function event_delete(Request $request, $id)
    {



        if (Auth::check()) {
            $scientific_event = Scientific_event::find($id);
            $user = User::where('id', $scientific_event->user_id)->first();
            $labm = Lab_Member::where('user_id', $user->id)->first();

            if ($labm && Auth::user()->id == $user->id) {



                $scientific_event->delete();


                return Redirect::route('profile.edit', ['id' => $user->id])->with('message', 'scientific event deleted Succesfully');
            } else {
                return Redirect::route('home')->with('message', 'you are not a lab member');
            }
        } else {
            return Redirect::route('home');
        }

    }


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
