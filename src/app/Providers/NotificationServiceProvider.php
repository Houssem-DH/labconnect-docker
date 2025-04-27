<?php

namespace App\Providers;

use App\Models\Lab_member;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;
use App\Models\Lab;
use App\Models\Chat;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;





class NotificationServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Partage des données avec toutes les vues via Inertia
        Inertia::share([
            'notifications' => function () {
                $notifications = collect([]);
                $notifications_count = 0;
                $chat_user = collect(); // Initialiser la variable
    
                // Log an informational message
                Log::info('This is an info log message.');

                if (Auth::check()) {
                    // Récupérer les chats associés à l'utilisateur connecté
                    $user = Auth::user();
                    $lab = Lab::where('director_id', Auth::user()->id)->first();

                    if ($user->director == 1 && Auth::user()->id == $lab->director_id) {
                        $labId = $lab->id ?? null;

                        $notifications = Notification::where('read', false)
                            ->whereIn('type', [
                                'exist_service_request_to_user',
                                'exist_service_request_accept',
                                'exist_service_request_reject',
                                'service_request_accept',
                                'service_request_accept_update',
                                'service_request',
                                'exist_service_request',
                                'invite_project_collaboration',
                                'invite_phd_thesis_collaboration',
                                'material_reservation',
                                'material_reservation_to_user',
                            ])
                            ->where(function ($query) use ($labId, $user) {
                                $query->where('lab_id', $labId)
                                    ->where('user_id', $user->id)
                                    ->orWhere('phd_student_id', $user->id);
                            })
                            ->get();

                        $notifications_count = $notifications->count();
                    } else {
                        $labId = $lab->id ?? null;

                        $notifications = Notification::where('read', false)
                            ->whereIn('type', [
                                'exist_service_request_to_user',
                                'exist_service_request_accept',
                                'exist_service_request_reject',
                                'service_request_accept',
                                'service_request_accept_update',
                                'invite_phd_thesis_collaboration',
                                'invite_project_collaboration',
                                'material_reservation_to_user',
                            ])
                            ->where(function ($query) use ($user) {
                                $query->where('user_id', $user->id)
                                    ->orWhere('phd_student_id', $user->id);
                            })
                            ->get();

                        $notifications_count = $notifications->count();
                    }
                }

                return [
                    'list' => $notifications->toArray(), // Convertit en tableau JSON
                    'count' => $notifications_count, // Compte des notifications
                    'chat_users' => $chat_user->toArray(), // Partager les utilisateurs du chat
                ];
            },


            'users' => function () {
                // Initialiser les variables
                $chat_users = collect(); // Collection vide par défaut
                $chat_groups = collect(); // Collection vide par défaut
                $users = collect(); // Collection vide par défaut
    
                if (Auth::check()) {
                    $user = Auth::user();

                    // Récupérer les chats associés à l'utilisateur connecté
                    $chat_users = Chat::where(function ($query) use ($user) {
                        $query->where('user_one_id', $user->id)
                            ->orWhere('user_two_id', $user->id)
                            ->orWhereJsonContains('users_id', $user->id);
                    })->get();

                    $chat_groups = Chat::where(function ($query) use ($user) {
                        $query->orWhereJsonContains('users_id', $user->id);
                    })->with('project','phdthesis')->get();

                    // Récupérer tous les utilisateurs associés aux chats (individuels et groupes)
                    $users = User::whereIn('id', function ($query) use ($chat_users) {
                        $query->select('user_one_id')
                            ->from('chats')
                            ->whereIn('id', $chat_users->pluck('id')) // Chats individuels (user_one_id)
                            ->union(
                                DB::table('chats')
                                    ->select('user_two_id')
                                    ->whereIn('id', $chat_users->pluck('id')) // Chats individuels (user_two_id)
                            );
                    })
                        ->where('id', '!=', Auth::user()->id) // Exclure l'utilisateur connecté
                        ->get();
                }

                // Retourner les données au frontend
                return [
                    'chat_users' => $chat_users->toArray(), // Chats associés
                    'chat_groups' => $chat_groups->toArray(), // Chats associés
                    'users' => $users->toArray(), // Utilisateurs associés
                ];
            },



            'labMember' => function () {
                $labMember = null; // Initialize as null
    
                if (Auth::check()) {
                    $user = Auth::user();

                    // Try to find the lab member associated with the current user
                    $labMember = Lab_member::where('user_id', $user->id)->first();
                }

                // Return the labMember data or an empty array if not found
                return [
                    'labMember' => $labMember ? $labMember->toArray() : [], // If labMember is null, return an empty array
                ];
            },

        ]);
    }

}
