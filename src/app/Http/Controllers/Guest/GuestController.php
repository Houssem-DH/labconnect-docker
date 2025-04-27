<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lab;
use App\Models\Team;
use App\Models\Domain;
use App\Models\Establishment;
use App\Models\Lab_member;
use App\Models\Project;
use App\Models\User;
use App\Models\Service;
use App\Models\Material;
use App\Models\Material_reservation;
use App\Models\Scientific_production;
use App\Models\Team_member;
use App\Models\Project_member;
use App\Models\Service_request;
use App\Models\Exist_service_request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\ChargilyPayment;
use Chargily\ChargilyPay\Auth\Credentials;
use Chargily\ChargilyPay\ChargilyPay;
use App\Models\Notification;





class GuestController extends Controller
{
    public function index()
    {

        $labs = Lab::get();

        return Inertia::render(
            '/',
            [
                'labs' => $labs,
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
            ]
        );


    }

    public function lab_index($id)
    {





        $lab = Lab::where('id', $id)->first();
        $labmembers = Lab_member::where('lab_id', $lab->id)->with('user')->get();
        $teams = Team::where('lab_id', $lab->id)->get();
        $projects = Project::where('lab_id', $lab->id)->where('project_display', 1)->get();









        return Inertia::render('/', [
            'lab' => $lab,
            'labmembers' => $labmembers,
            'teams' => $teams,
            'projects' => $projects,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);





    }

    public function lab_member_index($id)
    {





        $user = User::where('user_id', $id)->first();
        $labmember = Lab_member::where('user_id', $user->id)->with('user')->first();

        $scientific_productions = Scientific_production::whereJsonContains('user_id_author', $user->id)->get();








        return Inertia::render('/', [
            'user' => $user,
            'labmember' => $labmember,
            'scientific_productions' => $scientific_productions,

            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);





    }


    public function team_index($id)
    {





        $team = Team::where('id', $id)->first();
        $team_members = Team_member::where('team_id', $team->id)->with('user')->get();










        return Inertia::render('/', [
            'team' => $team,
            'team_members' => $team_members,

            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);





    }

    public function project_index($id)
    {





        $project = Project::where('id', $id)->first();
        $project_members = Project_member::where('project_id', $project->id)->with('user')->get();










        return Inertia::render('/', [
            'project' => $project,
            'project_members' => $project_members,

            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);





    }

    public function scientific_production_index($id)
    {





        $scientific_production = Scientific_production::where('id', $id)->first();
        $user_ids = json_decode($scientific_production->user_id_author, true);
        $users = User::whereIn('id', $user_ids)->get();







        return Inertia::render('/', [
            'scientific_production' => $scientific_production,
            'users' => $users,

            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);





    }


    public function all_scientific_productios_index()
    {





        $scienticif_production = Scientific_production::get();//*..*dirha search by keywords / authors 










        return Inertia::render('/', [
            'scienticif_production' => $scienticif_production,

            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);





    }

    public function services()
    {
        $user_id = Auth::user()->id;

        $service_requests = Service_request::where('user_id', Auth::user()->id)->get();
        $exist_service_requests = Exist_service_request::where('user_id', Auth::user()->id)->with('service')->get();
        $labs = Lab::get();
        $establishments = Establishment::get();

        $domains = Domain::get();

        $service_requests_not = Notification::where('read', false)
            ->whereIn('type', [
                'exist_service_request_to_user',
                'exist_service_request_accept',
                'exist_service_request_reject',
                'service_request_accept',
                'service_request_accept_update',
                ''
            ])
            ->where(function ($query) use ($user_id) {
                $query->where('user_id', $user_id);
            })
            ->update(['read' => true]);


        return Inertia::render('ServiceRequests/Services', [
            'service_requests' => $service_requests,
            'exist_service_requests' => $exist_service_requests,
            'labs' => $labs,
            'establishments' => $establishments,
            'domains' => $domains,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),

        ]);



    }

    public function my_requests_index()
    {




        $exist_service_requests = Exist_service_request::where('user_id', Auth::user()->id)->get();
        $service_requests = Service_request::where('user_id', Auth::user()->id)->get();
        $labs = Lab::get();
        $establishments = Establishment::get();

        $domains = Domain::get();





        return Inertia::render('MyRequests', [
            'service_requests' => $service_requests,
            'exist_service_requests' => $exist_service_requests,
            'labs' => $labs,
            'establishments' => $establishments,
            'domains' => $domains,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),

        ]);



    }






    public function service_request_insert(Request $request)
    {
        if (Auth::check()) {

            // Validate the request data
            $data = $request->validate([
                'labs' => ['nullable', 'array'], // Attend un tableau
                'labs.*' => ['integer'], // Chaque élément du tableau doit être un entier
                'domains' => ['nullable', 'array'], // Attend un tableau
                'domains.*' => ['string'], // Chaque élément du tableau doit être une chaîne
                'applicant_type' => ['required', 'string', 'max:255'],
                'title' => ['required', 'string', 'max:255'],
                'description' => ['required', 'string'],
                'applicant_tlp' => ['required', 'numeric', 'regex:/^0[0-9]{9}$/'],
                'applicant_adresse_email' => ['nullable', 'email'], // Ensure it's a valid email address
                'request_date' => ['required', 'date'], // Vérifie que la valeur est une date valide.
                'required_by' => ['required', 'date', 'after_or_equal:request_date'], // Vérifie que la valeur est une date valide et après 'request_date'.
                'comments' => ['nullable', 'string'],
            ]);

            if (!empty($data['labs']) || !empty($data['domains'])) {
                $service_request = new Service_request;

                $service_request->user_id = Auth::user()->id;
                $service_request->applicant_type = $data['applicant_type'];
                $service_request->title = $data['title'];
                $service_request->description = $data['description'];
                $service_request->applicant_tlp = $data['applicant_tlp'];
                $service_request->applicant_adresse_email = $data['applicant_adresse_email'];
                $service_request->request_date = $data['request_date'];
                $service_request->required_by = $data['required_by'];
                $service_request->comments = $data['comments'];

                // Inviter les laboratoires spécifiés par ID
                if (!empty($data['labs'])) {
                    $labs = Lab::whereIn('id', $data['labs'])->get();

                    // Inviter ces laboratoires
                    foreach ($labs as $labb) {
                        $service_request->StatusRequest($labb->id);

                        // Vérifier si la notification existe déjà
                        $existingNotification = Notification::where('lab_id', $labb->id)
                            ->where('service_request_id', $service_request->id)
                            ->first();

                        if (!$existingNotification) {  // Si la notification n'existe pas, alors on la crée
                            $notification = new Notification();
                            $notification->lab_id = $labb->id;
                            $notification->service_request_id = $service_request->id;
                            $notification->type = "service_request";
                            $notification->message = "You have received a service request from " . Auth::user()->first_name . " " . Auth::user()->last_name . ".";
                            $notification->save();
                        }
                    }
                }

                // Récupérer les laboratoires par domaine
                if (!empty($data['domains'])) {
                    // Récupérer les laboratoires qui contiennent un des domaines spécifiés
                    $labsByDomain = Lab::where(function ($query) use ($data) {
                        foreach ($data['domains'] as $domain) {
                            $query->orWhereJsonContains('domain', $domain);
                        }
                    })->get();

                    // Si aucun laboratoire n'est trouvé pour les domaines sélectionnés
                    if ($labsByDomain->isEmpty()) {
                        // Rediriger l'utilisateur avec un message d'erreur
                        return Redirect::route('service.index')->with('message', 'No labs found for the specified domains.');
                    }

                    // Inviter ces laboratoires
                    foreach ($labsByDomain as $labb) {
                        $service_request->StatusRequest($labb->id);

                        // Vérifier si la notification existe déjà
                        $existingNotification = Notification::where('lab_id', $labb->id)
                            ->where('service_request_id', $service_request->id)
                            ->first();

                        if (!$existingNotification) {  // Si la notification n'existe pas, alors on la crée
                            $notification = new Notification();
                            $notification->lab_id = $labb->id;
                            $notification->service_request_id = $service_request->id;
                            $notification->type = "service_request";
                            $notification->message = "You have received a service request from " . Auth::user()->first_name . " " . Auth::user()->last_name . ".";
                            $notification->save();
                        }
                    }
                }

                // Enregistrer la demande de service
                $service_request->save();

                return Redirect::route('service.index')->with('message', 'Service Added Successfully');
            } else {
                return Redirect::route('service.index')->with('message', 'You must choose laboratories or domains to request a service');
            }

        } else {
            return Redirect::route('home');
        }
    }





    public function mise_service_request(Request $request, $id)
    {
        if (Auth::check()) {
            $service_request = Service_request::find($id);

            if (Auth::user()->id == $service_request->user_id) {

                // Validate the request data
                $data = $request->validate([
                    'labs' => ['nullable', 'array'], // Attend un tableau
                    'labs.*' => ['integer'], // Chaque élément du tableau doit être un entier
                    'domains' => ['nullable', 'array'], // Attend un tableau
                    'domains.*' => ['string'], // Chaque élément du tableau doit être une chaîne
                    'applicant_type' => ['required', 'string', 'max:255'],
                    'title' => ['required', 'string', 'max:255'],
                    'description' => ['required', 'string'],
                    'applicant_tlp' => ['required', 'numeric', 'regex:/^[0-9]{9}$/'],
                    'applicant_adresse_email' => ['nullable', 'email'], // Ensure it's a valid email address
                    'request_date' => ['required', 'date'], // Vérifie que la valeur est une date valide.
                    'required_by' => ['required', 'date', 'after_or_equal:request_date'], // Vérifie que la valeur est une date valide et après 'request_date'.
                    'comments' => ['nullable', 'string'],
                ]);

                // Mise à jour des champs de la demande de service
                $service_request->applicant_type = $data['applicant_type'];
                $service_request->title = $data['title'];
                $service_request->description = $data['description'];
                $service_request->applicant_tlp = $data['applicant_tlp'];
                $service_request->applicant_adresse_email = $data['applicant_adresse_email'];
                $service_request->request_date = $data['request_date'];
                $service_request->required_by = $data['required_by'];
                $service_request->comments = $data['comments'];

                // Inviter les laboratoires spécifiés par ID
                if (!empty($data['labs'])) {
                    $labs = Lab::whereIn('id', $data['labs'])->get();

                    // Inviter ces laboratoires
                    foreach ($labs as $labb) {
                        $service_request->StatusRequest($labb->id);

                        // Vérifier si la notification existe déjà pour ce laboratoire et cette demande
                        $existingNotification = Notification::where('lab_id', $labb->id)
                            ->where('service_request_id', $service_request->id)
                            ->first();

                        if (!$existingNotification) {  // Si la notification n'existe pas, alors on la crée
                            $notification = new Notification();
                            $notification->lab_id = $labb->id;
                            $notification->service_request_id = $service_request->id;
                            $notification->type = "service_request";
                            $notification->message = Auth::user()->first_name . " " . Auth::user()->last_name . " has updated the service request.";
                            $notification->save();
                        }
                    }
                }

                // Récupérer les laboratoires par domaine
                if (!empty($data['domains'])) {
                    // Récupérer les laboratoires qui contiennent un des domaines spécifiés
                    $labsByDomain = Lab::where(function ($query) use ($data) {
                        foreach ($data['domains'] as $domain) {
                            $query->orWhereJsonContains('domain', $domain);
                        }
                    })->get();

                    // Si aucun laboratoire n'est trouvé pour les domaines sélectionnés
                    if ($labsByDomain->isEmpty()) {
                        // Rediriger l'utilisateur avec un message d'erreur
                        return Redirect::route('service.index')->with('message', 'No labs found for the specified domains.');
                    }

                    // Inviter ces laboratoires
                    foreach ($labsByDomain as $labb) {
                        $service_request->StatusRequest($labb->id);

                        // Vérifier si la notification existe déjà pour ce laboratoire et cette demande
                        $existingNotification = Notification::where('lab_id', $labb->id)
                            ->where('service_request_id', $service_request->id)
                            ->first();

                        if (!$existingNotification) {  // Si la notification n'existe pas, alors on la crée
                            $notification = new Notification();
                            $notification->lab_id = $labb->id;
                            $notification->service_request_id = $service_request->id;
                            $notification->type = "service_request";
                            $notification->message = Auth::user()->first_name . " " . Auth::user()->last_name . " has updated the service request.";
                            $notification->save();
                        }
                    }
                }

                // Enregistrer la mise à jour de la demande de service
                $service_request->update();

                return Redirect::route('service.index')->with('message', 'Service Request Updated Successfully');

            } else {
                return Redirect::route('home')->with('message', 'Access Denied.');
            }

        } else {
            return Redirect::route('home');
        }
    }





    public function sup_service_request($id)
    {
        if (Auth::check()) {
            $service_request = Service_request::find($id);

            // Vérifiez si request est une chaîne JSON ou déjà un tableau
            if (is_string($service_request->request)) {
                $requestData = json_decode($service_request->request, true);
            } else {
                $requestData = $service_request->request;
            }

            // Si $requestData est nul ou vide, retournez sans erreur
            if (!$requestData) {
                return Redirect::route('/')->with('message', 'Service Request deleted successfully');
            }

            // Récupérer les lab_id comme les clés de $requestData
            $labIds = array_keys($requestData);

            // Convertir les lab_ids en entiers pour éviter d'éventuels problèmes de type
            $labIds = array_map('intval', $labIds);

            // Récupérez les notifications correspondant aux lab_ids valides et de type 'service_request'
            $notifications = Notification::whereIn("lab_id", $labIds)->where("type", "service_request")->where("service_request_id", $id)->get();

            // Vérifiez si l'utilisateur est le propriétaire du service_request
            if (Auth::user()->id == $service_request->user_id) {
                // Supprimer chaque notification
                foreach ($notifications as $item) {
                    $item->delete();
                }

                // Supprimer le service_request lui-même
                $service_request->delete();

                return Redirect::route('service.index')->with('message', 'Service Request and notifications deleted successfully');
            } else {
                return Redirect::route('home')->with('message', 'Access Denied.');
            }

        } else {
            return Redirect::route('home');
        }
    }


    public function exist_service_request_insert(Request $request, $id)
    {
        if (Auth::check()) {

            $service = Service::find($id);


            // Validate the request data
            $data = $request->validate([
                'applicant_type' => ['required', 'string', 'max:255'],
                'applicant_tlp' => ['required', 'numeric', 'regex:/^0[0-9]{9}$/'],
                'applicant_adresse_email' => ['nullable', 'email'], // Ensure it's a valid email address
                'request_date' => ['required', 'date'], // Vérifie que la valeur est une date valide.
                'required_by' => ['required', 'date', 'after_or_equal:request_date'], // Vérifie que la valeur est une date valide et après 'request_date'.
                'comments' => ['nullable', 'string'],
            ]);

            $exist_service_request = new Exist_service_request;

            $exist_service_request->user_id = Auth::user()->id;
            $exist_service_request->service_id = $id;
            $exist_service_request->applicant_type = $data['applicant_type'];
            $exist_service_request->applicant_tlp = $data['applicant_tlp'];
            $exist_service_request->applicant_adresse_email = $data['applicant_adresse_email'];
            $exist_service_request->request_date = $data['request_date'];
            $exist_service_request->required_by = $data['required_by'];
            $exist_service_request->comments = $data['comments'];


            $notification = new Notification();
            $notification->lab_id = $service->lab_id;
            $notification->exist_service_request_id = $exist_service_request->id;
            $notification->type = "exist_service_request";
            $notification->message = "You have received a service request from " . Auth::user()->first_name . " " . Auth::user()->last_name . ". Service: " . $service->title . ".";
            $notification->save();

            $notification = new Notification();
            $notification->user_id = Auth::user()->id;
            $notification->lab_id = $service->lab_id;
            $notification->exist_service_request_id = $exist_service_request->id;
            $notification->type = "exist_service_request_to_user";
            $notification->message = "Dear Mr./Ms. " . Auth::user()->first_name . " " . Auth::user()->last_name . ", your request for the service \"" . $service->title . "\" is currently pending. You will receive a notification once the lab accepts or declines your request. Thank you for your trust.";
            $notification->save();


            // Enregistrer la demande de service
            $exist_service_request->save();

            return Redirect::route('home')->with('message', 'Service Request Saved Successfully');

        } else {
            return Redirect::route('home');
        }
    }



    public function mise_exist_service_request(Request $request, $id)
    {
        if (Auth::check()) {
            $exist_service_request = Exist_service_request::find($id);
            $service = Service::where('id', $exist_service_request->service_id);


            if (Auth::user()->id == $exist_service_request->user_id) {

                // Validate the request data
                $data = $request->validate([
                    'applicant_type' => ['required', 'string', 'max:255'],
                    'applicant_tlp' => ['required', 'numeric', 'regex:/^0[0-9]{9}$/'],
                    'applicant_adresse_email' => ['nullable', 'email'], // Ensure it's a valid email address
                    'request_date' => ['required', 'date'], // Vérifie que la valeur est une date valide.
                    'required_by' => ['required', 'date', 'after_or_equal:request_date'], // Vérifie que la valeur est une date valide et après 'request_date'.
                    'comments' => ['nullable', 'string'],
                ]);

                // Mise à jour des champs de la demande de service
                $exist_service_request->applicant_type = $data['applicant_type'];
                $exist_service_request->applicant_tlp = $data['applicant_tlp'];
                $exist_service_request->applicant_adresse_email = $data['applicant_adresse_email'];
                $exist_service_request->request_date = $data['request_date'];
                $exist_service_request->required_by = $data['required_by'];
                $exist_service_request->comments = $data['comments'];

                $exist_service_request->update();

                return Redirect::route('/')->with('message', 'Service Request Updated Successfully');

            } else {
                return Redirect::route('home')->with('message', 'Access Denied.');
            }

        } else {
            return Redirect::route('home');
        }
    }



    public function sup_exist_service_request($id)
    {
        if (Auth::check()) {

            $exist_service_request = Exist_service_request::find($id);
            $service = Service::where('id', $exist_service_request->service_id);

            if (Auth::user()->id == $exist_service_request->user_id) {

                // Récupérez les notifications correspondant aux lab_ids valides et de type 'service_request'
                $notifications = Notification::where("exist_service_request_id", $exist_service_request->id)->get();

                // Supprimer chaque notification
                foreach ($notifications as $item) {
                    $item->delete();
                }

                // Supprimer le service_request lui-même
                $exist_service_request->delete();

                return Redirect::route('/')->with('message', 'Service Request and notifications deleted successfully');


            } else {
                return Redirect::route('home')->with('message', 'Access Denied.');
            }

        } else {
            return Redirect::route('home');
        }
    }


    public function material_reservation_insert(Request $request, $id)
    {
        if (Auth::check()) {

            $material = Material::find($id);


            // Validate the request data
            $data = $request->validate([
                'reservation_type' => ['required', 'string', 'max:255'],
                'applicant_type' => ['required', 'string', 'max:255'],
                'start_date' => ['required', 'date'], // Vérifie que la valeur est une date valide et après 'request_date'.
                'end_date' => ['required', 'date', 'after_or_equal:start_date'], // Vérifie que la valeur est une date valide et après 'request_date'.
                'quantity' => ['required', 'integer', 'min:1'],
                'reason' => ['required', 'string'],
                'tlp' => ['required', 'numeric', 'regex:/^0[0-9]{9}$/'],
                'adresse_email' => ['nullable', 'email'], // Ensure it's a valid email address

            ]);

            $material_reservation = new Material_reservation;

            $material_reservation->user_id = Auth::user()->id;
            $material_reservation->material_id = $id;
            $material_reservation->reservation_type = $data['reservation_type'];
            $material_reservation->applicant_type = $data['applicant_type'];
            $material_reservation->reservation_date = now();
            $material_reservation->start_date = $data['start_date'];
            $material_reservation->end_date = $data['end_date'];
            $material_reservation->quantity = $data['quantity'];
            $material_reservation->reason = $data['reason'];
            $material_reservation->tlp = $data['tlp'];
            $material_reservation->adresse_email = $data['adresse_email'];
            $material_reservation->save();
            // Calculate total amount
            $amount = $material->reservation_price * $data['quantity'];

            // Create Chargily payment record
            $payment = ChargilyPayment::create([
                'user_id' => Auth::id(),
                'material_reservation_id' => $material_reservation->id,
                'currency' => 'dzd',

                'amount' => (string) $amount,
                'status' => 'pending'
            ]);



            return Redirect::route('chargilypay.redirect', ['payment' => $payment->id]);


            $notification = new Notification();
            $notification->lab_id = $material->lab_id;
            $notification->material_reservation_id = $material_reservation->id;
            $notification->type = "material_reservation";
            $notification->message = "You have received a material reservation request from " . Auth::user()->first_name . " " . Auth::user()->last_name . ". Material: " . $material->name . ".";
            $notification->save();

            $notification = new Notification();
            $notification->user_id = Auth::user()->id;
            $notification->lab_id = $material->lab_id;
            $notification->material_reservation_id = $material_reservation->id;
            $notification->type = "material_reservation_to_user";
            $notification->message = "Dear Mr./Ms. " . Auth::user()->first_name . " " . Auth::user()->last_name . ", your request for the material \"" . $material->name . "\" is currently pending. You will receive a notification once the lab accepts or rejects your request. Thank you for your trust.";
            $notification->save();







        } else {
            return Redirect::route('home');
        }
    }

    protected function createNotifications(Material $material, Material_reservation $reservation)
    {
        // Lab notification
        Notification::create([
            'lab_id' => $material->lab_id,
            'material_reservation_id' => $reservation->id,
            'type' => "material_reservation",
            'message' => "New reservation request from " . Auth::user()->full_name . " for " . $material->name,
        ]);

        // User notification
        Notification::create([
            'user_id' => Auth::id(),
            'lab_id' => $material->lab_id,
            'material_reservation_id' => $reservation->id,
            'type' => "material_reservation_to_user",
            'message' => "Your request for {$material->name} is pending " .
                ($material->reservation_price ? "payment" : "approval"),
        ]);
    }

    protected function createChargilyPayment(Material $material, Material_reservation $reservation)
    {
        $amount = $material->reservation_price * $reservation->quantity;

        $payment = ChargilyPayment::create([
            'user_id' => Auth::id(),
            'status' => 'pending',
            'currency' => 'dzd',
            'amount' => $amount,
            'metadata' => [
                'reservation_id' => $reservation->id,
                'material_id' => $material->id,
            ]
        ]);

        $reservation->update(['chargily_payment_id' => $payment->id]);

        return $payment;
    }


    public function mise_material_reservation(Request $request, $id)
    {
        if (Auth::check()) {
            $material_reservation = Material_reservation::find($id);
            $material = Material::where('id', $material_reservation->material_id);


            if (Auth::user()->id == $material_reservation->user_id) {

                // Validate the request data
                $data = $request->validate([
                    'reservation_type' => ['required', 'string', 'max:255'],
                    'applicant_type' => ['required', 'string', 'max:255'],
                    'start_date' => ['required', 'date'], // Vérifie que la valeur est une date valide et après 'request_date'.
                    'end_date' => ['required', 'date', 'after_or_equal:start_date'], // Vérifie que la valeur est une date valide et après 'request_date'.
                    'quantity' => ['required', 'integer', 'min:1'],
                    'reason' => ['required', 'string'],
                    'tlp' => ['required', 'numeric', 'regex:/^0[0-9]{9}$/'],
                    'adresse_email' => ['nullable', 'email'], // Ensure it's a valid email address
                ]);

                // Mise à jour des champs de la demande de service

                $material_reservation->reservation_type = $data['reservation_type'];
                $material_reservation->applicant_type = $data['applicant_type'];
                $material_reservation->start_date = $data['start_date'];
                $material_reservation->end_date = $data['end_date'];
                $material_reservation->quantity = $data['quantity'];
                $material_reservation->reason = $data['reason'];
                $material_reservation->tlp = $data['tlp'];
                $material_reservation->adresse_email = $data['adresse_email'];

                $material_reservation->update();

                return Redirect::route('/')->with('message', 'Your material reservation request has been updated successfully.');

            } else {
                return Redirect::route('home')->with('message', 'Access Denied.');
            }

        } else {
            return Redirect::route('home');
        }
    }


    public function reservations_index()
    {
        $reservations = ChargilyPayment::where('user_id', auth()->id())
            ->with(['materialReservation.material', 'user']) // Corrected relationship
            ->when(request('search'), function ($query) {
                $query->whereHas('materialReservation.material', function ($q) {
                    $q->where('name', 'like', '%' . request('search') . '%');
                });
            })
            ->when(request('status') && request('status') !== 'all', function ($query) {
                $query->where('status', request('status'));
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Reservations/Index', [
            'reservations' => $reservations->through(fn($reservation) => [
                'id' => (string) $reservation->id,
                'status' => $reservation->status,
                'amount' => $reservation->amount,
                'formatted_amount' => number_format($reservation->amount, 2),
                'currency' => $reservation->currency,
                'created_at' => $reservation->created_at->format('M d, Y h:i A'),
                'material' => [
                    // Access through materialReservation relationship
                    'name' => $reservation->materialReservation->material->name ?? 'N/A',
                    'image' => $reservation->materialReservation->material->picture ?? null,
                ],
                'status_badge' => $this->getStatusBadge($reservation->status),
            ]),
            'filters' => request()->only(['search', 'status']),
        ]);
    }
    protected function getStatusBadge($status)
    {
        return match ($status) {
            'pending' => ['label' => 'Pending', 'color' => 'bg-amber-100/50', 'icon' => 'clock'],
            'confirmed' => ['label' => 'Confirmed', 'color' => 'bg-emerald-100/50', 'icon' => 'check-circle'],
            'cancelled' => ['label' => 'Cancelled', 'color' => 'bg-rose-100/50', 'icon' => 'x-circle'],
            'completed' => ['label' => 'Completed', 'color' => 'bg-blue-100/50', 'icon' => 'check-circle'],
            default => ['label' => 'Unknown', 'color' => 'bg-gray-100', 'icon' => 'help-circle'],
        };
    }

    public function sup_material_reservation($id)
    {
        if (Auth::check()) {

            $material_reservation = Material_reservation::find($id);
            $material = Material::where('id', $material_reservation->material_id);

            if (Auth::user()->id == $material_reservation->user_id) {

                // Récupérez les notifications correspondant aux lab_ids valides et de type 'service_request'
                $notifications = Notification::where("material_reservation_id", $material_reservation->id)->delete();


                // Supprimer le service_request lui-même
                $material_reservation->delete();

                return Redirect::route('/')->with('message', 'Your material reservation request has been deleted successfully.');


            } else {
                return Redirect::route('home')->with('message', 'Access Denied.');
            }

        } else {
            return Redirect::route('home');
        }
    }






}
