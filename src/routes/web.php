<?php

use App\Http\Controllers\ChargilyPayController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

/*
Route::get('migrate', function () {
// Run the migration command
Artisan::call('migrate:fresh');
return Artisan::output();
});

 */

/*
Route::get('storage', function () {
   // Run the storage command
   Artisan::call('storage:link');
   return Artisan::output();
});
*/


Route::get('/', [\App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('/search-results', [\App\Http\Controllers\HomeController::class, 'showResults'])->name('search.results');

Route::get('/labs', [\App\Http\Controllers\HomeController::class, 'labs'])->name('labs');
Route::get('/labs/{id}', [\App\Http\Controllers\HomeController::class, 'lab_index'])->name('labs.index');

Route::get('/about', [\App\Http\Controllers\HomeController::class, 'about'])->name('about');

Route::get('/location-test', [\App\Http\Controllers\HomeController::class, 'location'])->name('location');

Route::get('/location-insert', [\App\Http\Controllers\HomeController::class, 'location_insert'])->name('location.insert');

Route::get('/chat/{userId1}/{userId2}', [\App\Http\Controllers\HomeController::class, 'chat'])->name('chat');
Route::get('/chat-session/{userId}', [\App\Http\Controllers\ChatController::class, 'getOrCreateChatSession']);

Route::get('/pop-up-chat-session/', [\App\Http\Controllers\ChatController::class, 'getChatSession']);

Route::get('/pop-up-group-chat-session/{projectId}/{phdThesisId}', [\App\Http\Controllers\ChatController::class, 'getGroupChatSession']);

Route::get('/group-project-chat-session/{projectId}', [\App\Http\Controllers\ChatController::class, 'getOrCreateGroupChatProjectSession']);

Route::get('/group-phd-thesis-chat-session/{phThesisId}', [\App\Http\Controllers\ChatController::class, 'getOrCreateGroupChatPhdThesisSession']);

Route::get('/chats/{chatId}', [\App\Http\Controllers\MessageController::class, 'index']);
Route::post('/messages', [\App\Http\Controllers\MessageController::class, 'store']);

Route::middleware(['auth', 'isAdmin'])->group(function () {

    Route::get('/dashboard/admin', [\App\Http\Controllers\AdminF\DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/dashboard/admin/directors', [\App\Http\Controllers\AdminF\DirectorController::class, 'index'])->name('admin.dashboard.directors');
    Route::post('/dashboard/admin/directors/create-director', [\App\Http\Controllers\Admin\Lab\LabsController::class, 'lab_insert'])->name('admin.dashboard.register.director');
    Route::delete('/dashboard/admin/directors/delete/{id}', [\App\Http\Controllers\Admin\Users\UserController::class, 'delete_user'])->name('admin.dashboard.directors.delete');

});

Route::middleware(['auth', 'isSuperAdmin'])->group(function () {

    Route::get('down', function () {
        // Run the Down command with a secret
        Artisan::call('down', [
            '--secret' => 'BDBB8A5CB95AB4D51323385AEAA66',
        ]);

        // Return the output
        return response("<pre>" . Artisan::output() . "</pre>");
    });

    Route::get('up', function () {
        // Run the Up command
        Artisan::call('up');

        // Return the output
        return response("<pre>" . Artisan::output() . "</pre>");
    });

    Route::get('clear-all', function () {
        // Run Artisan commands to clear and reset caches and configurations
        Artisan::call('config:clear');     // Clears the configuration cache
        Artisan::call('cache:clear');      // Clears the application cache
        Artisan::call('route:clear');      // Clears the route cache
        Artisan::call('view:clear');       // Clears the view cache
        Artisan::call('config:cache');     // Rebuilds the config cache
        Artisan::call('route:cache');      // Rebuilds the route cache
        Artisan::call('optimize');         // Optimize the application (routes, config, etc.)

        return response("<pre>" . Artisan::output() . "</pre>");
    });

    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/dashboard/users', [\App\Http\Controllers\Admin\Users\UserController::class, 'index'])->name('dashboard.users');
    Route::put('/dashboard/users/edit/{id}', [\App\Http\Controllers\Admin\Users\UserController::class, 'role'])->name('dashboard.users.edit');

    Route::post('/dashboard/users/create-admin', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'store_admin'])->name('register.admin');

    Route::post('/dashboard/users/delete/{id}', [\App\Http\Controllers\Admin\Users\UserController::class, 'delete_user'])->name('dashboard.users.delete');
    Route::post('/dashboard/users/ban/{id}', [\App\Http\Controllers\Admin\Users\UserController::class, 'ban_user'])->name('dashboard.users.ban');

    Route::get('/dashboard/banned-users', [\App\Http\Controllers\Admin\BannedUsers\BannedUsersController::class, 'index'])->name('dashboard.banned-users');
    Route::put('/dashboard/banned-users/revoke-ban/{id}', [\App\Http\Controllers\Admin\BannedUsers\BannedUsersController::class, 'revoke_ban'])->name('dashboard.revoke-banned-users');

    Route::get('/dashboard/establishments', [\App\Http\Controllers\Admin\Establishment\EstablishmentController::class, 'index'])->name('dashboard.establishments');
    Route::post('/dashboard/establishments/add', [\App\Http\Controllers\Admin\Establishment\EstablishmentController::class, 'establishment_insert'])->name('dashboard.establishment.add');
    Route::put('/dashboard/establishments/edit/{id}', [\App\Http\Controllers\Admin\Establishment\EstablishmentController::class, 'mise_establishment'])->name('dashboard.establishment.edit');
    Route::delete('/dashboard/establishments/delete/{id}', [\App\Http\Controllers\Admin\Establishment\EstablishmentController::class, 'sup_establishment'])->name('dashboard.establishment.delete');

    Route::get('/dashboard/faculty', [\App\Http\Controllers\Admin\Faculty\FacultyController::class, 'index'])->name('dashboard.faculty');
    Route::post('/dashboard/faculty/add', [\App\Http\Controllers\Admin\Faculty\FacultyController::class, 'faculty_insert'])->name('dashboard.faculty.add');
    Route::put('/dashboard/faculty/edit/{id}', [\App\Http\Controllers\Admin\Faculty\FacultyController::class, 'mise_faculty'])->name('dashboard.faculty.edit');
    Route::delete('/dashboard/faculty/delete/{id}', [\App\Http\Controllers\Admin\Faculty\FacultyController::class, 'sup_faculty'])->name('dashboard.faculty.delete');

    Route::get('/dashboard/domains', [\App\Http\Controllers\Admin\Domain\DomainController::class, 'index'])->name('dashboard.domains');
    Route::post('/dashboard/domain/add', [\App\Http\Controllers\Admin\Domain\DomainController::class, 'domain_insert'])->name('dashboard.domain.add');
    Route::put('/dashboard/domain/edit/{id}', [\App\Http\Controllers\Admin\Domain\DomainController::class, 'mise_domain'])->name('dashboard.domain.edit');
    Route::delete('/dashboard/domain/delete/{id}', [\App\Http\Controllers\Admin\Domain\DomainController::class, 'sup_domain'])->name('dashboard.domain.delete');

    Route::get('/dashboard/specialities', [\App\Http\Controllers\Admin\Speciality\SpecialityController::class, 'index'])->name('dashboard.specialities');
    Route::post('/dashboard/speciality/add', [\App\Http\Controllers\Admin\Speciality\SpecialityController::class, 'speciality_insert'])->name('dashboard.speciality.add');
    Route::put('/dashboard/speciality/edit/{id}', [\App\Http\Controllers\Admin\Speciality\SpecialityController::class, 'mise_speciality'])->name('dashboard.speciality.edit');
    Route::delete('/dashboard/speciality/delete/{id}', [\App\Http\Controllers\Admin\Speciality\SpecialityController::class, 'sup_speciality'])->name('dashboard.speciality.delete');

});

//
Route::get('/profile/{id}', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');

Route::middleware('auth')->group(function () {

    Route::post('/profile-update/{id}', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');

    Route::post('/profile/update-background-photo/{id}', [\App\Http\Controllers\ProfileController::class, 'update_background_photo'])->name('profile.update.profile.background');
    Route::post('/profile/update-avatar/{id}', [\App\Http\Controllers\ProfileController::class, 'update_avatar'])->name('profile.update.profile.avatar');

    Route::post('/profile-update/add-teaching/{id}', [\App\Http\Controllers\ProfileController::class, 'teaching_insert'])->name('teaching.insert');
    Route::put('/profile-update/edit-teaching/{id}', [\App\Http\Controllers\ProfileController::class, 'teaching_update'])->name('teaching.update');
    Route::delete('/profile-update/delete-teaching/{id}', [\App\Http\Controllers\ProfileController::class, 'teaching_delete'])->name('teaching.delete');

    Route::post('/profile-update/add-master-thesis/{id}', [\App\Http\Controllers\ProfileController::class, 'master_thesis_insert'])->name('master.thesis.insert');
    Route::put('/profile-update/edit-master-thesis/{id}', [\App\Http\Controllers\ProfileController::class, 'master_thesis_update'])->name('master.thesis.update');
    Route::delete('/profile-update/delete-master-thesis/{id}', [\App\Http\Controllers\ProfileController::class, 'master_thesis_delete'])->name('master.thesis.delete');

    Route::post('/profile-update/add-event/{id}', [\App\Http\Controllers\ProfileController::class, 'event_insert'])->name('event.insert');
    Route::put('/profile-update/edit-event/{id}', [\App\Http\Controllers\ProfileController::class, 'event_update'])->name('event.update');
    Route::delete('/profile-update/delete-event/{id}', [\App\Http\Controllers\ProfileController::class, 'event_delete'])->name('event.delete');
    Route::delete('/profile', [\App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/service-request/{serviceId}', [\App\Http\Controllers\HomeController::class, 'service_request'])->name('service.request');
    Route::post('/exist-services/request/{id}', [\App\Http\Controllers\Guest\GuestController::class, 'exist_service_request_insert'])->name('exist.service.request.insert');
    Route::put('/exist-services/request/edit/{id}', [\App\Http\Controllers\Guest\GuestController::class, 'mise_exist_service_request'])->name('exist.service.request.edit');
    Route::delete('/exist-services/request/delete/{id}', [\App\Http\Controllers\Guest\GuestController::class, 'sup_exist_service_request'])->name('exist.service.request.delete');

    Route::get('/services', [\App\Http\Controllers\Guest\GuestController::class, 'services'])->name('service.index');
    Route::post('/services/request/{id}', [\App\Http\Controllers\Guest\GuestController::class, 'service_request_insert'])->name('service.request.insert');
    Route::put('/services/request/edit/{id}', [\App\Http\Controllers\Guest\GuestController::class, 'mise_service_request'])->name('service.request.edit');
    Route::delete('/services/request/delete/{id}', [\App\Http\Controllers\Guest\GuestController::class, 'sup_service_request'])->name('service.request.delete');

    Route::get('/services/my-requests', [\App\Http\Controllers\Guest\GuestController::class, 'my_requests_index'])->name('my.requests.index');



    Route::post('material/reservation/{id}', [\App\Http\Controllers\Guest\GuestController::class, 'material_reservation_insert'])->name('material.reserve');
    // routes/web.php
    Route::get('chargilypay/redirect/{payment}', [ChargilyPayController::class, "redirect"])->name("chargilypay.redirect");
    Route::get('chargilypay/back', [ChargilyPayController::class, "back"])->name("chargilypay.back");
   
    Route::post('chargilypay/webhook', [ChargilyPayController::class, "webhook"])->name("chargilypay.webhook_endpoint");

    Route::get('/reservations', [\App\Http\Controllers\Guest\GuestController::class, 'reservations_index'])->name('reservations.index');


    // Director Routes
});

Route::middleware(['auth', 'isDirector'])->group(function () {

    // Director Routes
    Route::get('/director-space/home', [\App\Http\Controllers\Director\DirectorController::class, 'home'])->name('director.space.home');

    // Director Routes
    Route::get('/director-space/members', [\App\Http\Controllers\Director\DirectorController::class, 'members'])->name('director.space.members');
    // Director Routes
    Route::get('/director-space/teams', [\App\Http\Controllers\Director\DirectorController::class, 'teams'])->name('director.space.teams');
    // Director Routes
    Route::get('/director-space/projects', [\App\Http\Controllers\Director\DirectorController::class, 'projects'])->name('director.space.projects');
    // Director Routes
    Route::get('/director-space/materials', [\App\Http\Controllers\Director\DirectorController::class, 'materials'])->name('director.space.materials');
    // Director Routes
    Route::get('/director-space/scientific-activities', [\App\Http\Controllers\Director\DirectorController::class, 'scientific_activities'])->name('director.spacescientific.activities');
    // Director Routes
    Route::get('/director-space/scientific-productions', [\App\Http\Controllers\Director\DirectorController::class, 'scientific_productions'])->name('director.space.scientific.productions');

    Route::get('/director-space/services', [\App\Http\Controllers\Director\DirectorController::class, 'services'])->name('director.space.services');

    Route::get('/director-space/reservations', [\App\Http\Controllers\Director\DirectorController::class, 'reservations'])->name('director.space.reservations');
    // Director Routes
    Route::put('/director-space/manage-lab/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'mise_lab'])->name('manage-lab');
    // Director Routes
    Route::post('/director-space/manage-lab/manage-lab-picture/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'mise_lab_pic'])->name('manage-lab-picture');

    // Director Routes
    Route::post('/director-space/manage-lab/add-lab-member/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'lab_member_insert'])->name('lab.member.insert');
    // Director Routes
    Route::delete('/director-space/manage-lab/delete-lab-member/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'sup_lab_member'])->name('lab.member.delete');
    // Director Routes
    Route::put('/director-space/manage-lab/edit-lab-member/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'lab_member_edit'])->name('lab.member.edit');

    // Director Routes
    Route::post('/director-space/manage-lab/add-team/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'team_insert'])->name('lab.team.insert');
    Route::put('/director-space/manage-lab/edit-team/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'mise_team'])->name('lab.team.edit');

    Route::post('/director-space/manage-lab/add-team-member-in/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'team_member_insert_in_lab'])->name('lab.team.member.insert.in');

    Route::delete('/director-space/manage-lab/delete-team/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'sup_team'])->name('lab.team.delete');
    Route::delete('/director-space/manage-lab/delete-team-member/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'sup_team_member'])->name('lab.team.member.delete');
    Route::get('/director-space/manage-lab/manage-team/manage-scientific-production/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'index2'])->name('lab.team.scientific.production.manage');

    Route::post('/director-space/manage-lab/manage-team/add-scientific-production/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'scientific_production_insert'])->name('lab.team.scientific.production.insert');
    Route::delete('/director-space/manage-lab/manage-team/delete-scientific-production/{id}/{id2}', [\App\Http\Controllers\Director\DirectorController::class, 'sup_scientific_production'])->name('lab.team.scientific.production.delete');

    Route::post('/director-space/scientific-productions/insert/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'scientific_production_insert'])->name('director.space.scientific.productions.insert');
    Route::put('/director-space/scientific-productions/edit/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'mise_scientific_production'])->name('director.space.scientific.productions.edit');
    Route::delete('/director-space/scientific-productions/delete/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'sup_scientific_production'])->name('director.space.scientific.productions.delete');

    Route::post('/director-space/manage-lab/manage-team/manage-scientific-production/add-scientific-production-author/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'scientific_production_member_insert'])->name('lab.scientific.production.author.insert');
    Route::delete('/director-space/manage-lab/manage-team/manage-scientific-production/delete-scientific-production-author/{id}/{member_id}', [\App\Http\Controllers\Director\DirectorController::class, 'scientific_production_member_delete'])->name('lab.scientific.production.author.delete');
    Route::delete('/director-space/manage-lab/manage-team/manage-scientific-production/delete-scientific-production-external-author/{id}/{author}', [\App\Http\Controllers\Director\DirectorController::class, 'scientific_production_external_author_delete'])->name('lab.scientific.production.external.author.delete');

    Route::post('/director-space/manage-lab/manage-project/add-project-member/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'project_member_insert_in_lab'])->name('lab.project.member.insert');

    Route::delete('/director-space/manage-lab/delete-project-member/{id}/{projectId}/{isExternal}', [\App\Http\Controllers\Director\DirectorController::class, 'sup_project_member'])->name('lab.project.member.delete');

    Route::delete('/director-space/manage-lab/delete-no-project-member/{id}/{projectId}', [\App\Http\Controllers\Director\DirectorController::class, 'sup_no_project_member'])->name('lab.no.project.member.delete');

    Route::get('/director-space/manage-lab/add-project', [\App\Http\Controllers\Director\DirectorController::class, 'add_project_index'])->name('lab.add.project.index');
    Route::post('/director-space/manage-lab/add-project/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'project_insert'])->name('lab.projects.insert');
    Route::get('/director-space/manage-lab/edit-project/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'edit_project_index'])->name('lab.edit.project.index');
    Route::post('/director-space/manage-lab/edit-project/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'mise_project'])->name('lab.projects.edit');
    Route::delete('/director-space/manage-lab/delete-project/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'sup_project'])->name('lab.projects.delete');

    Route::get('/director-space/projects/manage-lab/manage-project/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'index'])->name('lab.project.manage');

    Route::post('/director-space/manage-project/add-global-report/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'project_global_report_insert'])->name('director.project.global.report.insert');

    Route::post('/director-space/manage-project/add-personal-report/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'project_personal_report_insert'])->name('director.project.personal.report.insert');
    Route::post('/director-space/manage-project/edit-global-report/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'mise_project_global_report'])->name('director.project.global.report.edit');

    Route::post('/director-space/manage-project/edit-personal-report/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'mise_project_personal_report'])->name('director.project.personal.report.edit');

    Route::get('/director-space/manage-lab/add-material', [\App\Http\Controllers\Director\DirectorController::class, 'add_material_index'])->name('lab.add.material.index');
    Route::post('/director-space/manage-lab/add-material/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'material_insert'])->name('lab.material.insert');
    Route::post('/director-space/manage-lab/edit-material/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'mise_material'])->name('lab.material.edit');
    Route::delete('/director-space/manage-lab/delete-material/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'sup_material'])->name('lab.material.delete');

    Route::get('/director-space/manage-lab/add-activity', [\App\Http\Controllers\Director\DirectorController::class, 'add_activity_index'])->name('lab.add.activity.index');
    Route::post('/director-space/manage-lab/add-activity/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'scientific_activity_insert'])->name('lab.activity.insert');
    Route::post('/director-space/manage-lab/edit-activity/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'mise_scientific_activity'])->name('lab.activity.edit');
    Route::delete('/director-space/manage-lab/delete-activity/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'sup_scientific_activity'])->name('lab.activity.delete');

    Route::post('/director-space/manage-lab/add-service/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'service_insert'])->name('lab.service.insert');
    Route::post('/director-space/manage-lab/edit-service/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'mise_service'])->name('lab.service.edit');
    Route::delete('/director-space/manage-lab/delete-service/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'sup_service'])->name('lab.service.delete');

    Route::get('/director-space/collaboration', [\App\Http\Controllers\Director\DirectorController::class, 'collaboration_index'])->name('director.space.collaboration');
    Route::post('/director-space/collaboration/add-project-collab-request/{id}', [\App\Http\Controllers\ProjectCollabRequest\ProjectCollabRequestController::class, 'project_collab_request_insert'])->name('lab.project.collab.request.insert');
    Route::post('/director-space/collaboration/add-collab-space/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'collaboration_space_create'])->name('lab.collab.space.insert');

    Route::get('/services/requests', [\App\Http\Controllers\Director\DirectorController::class, 'service_requests_index'])->name('service.requests.index');

    Route::post('/services/requests/exist/respond/accept/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'accept_exist_service_request'])->name('exist.service.requests.respond.accept');
    Route::post('/services/requests/exist/respond/reject/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'reject_exist_service_request'])->name('exist.service.requests.respond.reject');

    Route::post('/services/requests/respond/accept/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'accept_service_request'])->name('service.requests.respond.accept');
    Route::post('/services/requests/respond/reject/{id}', [\App\Http\Controllers\Director\DirectorController::class, 'reject_service_request'])->name('service.requests.respond.reject');

});

Route::middleware(['auth', 'isMember'])->group(function () {

    Route::get('/member-space/home', [\App\Http\Controllers\Member\MemberController::class, 'home'])->name('member.space.home');
    Route::get('/member-space/members', [\App\Http\Controllers\Member\MemberController::class, 'members'])->name('member.space.members');
    Route::get('/member-space/teams', [\App\Http\Controllers\Member\MemberController::class, 'teams'])->name('member.space.teams');
    Route::get('/member-space/materials', [\App\Http\Controllers\Member\MemberController::class, 'materials'])->name('member.space.materials');

    Route::get('/member-space/scientific-productions', [\App\Http\Controllers\Member\MemberController::class, 'scientific_productions'])->name('member.space.scientific.productions');

    Route::get('/member-space/teams/view/{id}', [\App\Http\Controllers\Member\MemberController::class, 'team_view'])->name('lab.team.view');

    Route::get('/member-space/manage-lab/manage-team/manage-scientific-production/{id}', [\App\Http\Controllers\Member\MemberController::class, 'index2'])->name('member.team.scientific.production.manage');

    Route::post('/member-space/scientific-productions/insert/{id}', [\App\Http\Controllers\Member\MemberController::class, 'scientific_production_insert'])->name('member.space.scientific.productions.insert');
    Route::put('/member-space/scientific-productions/edit/{id}', [\App\Http\Controllers\Member\MemberController::class, 'mise_scientific_production'])->name('member.space.scientific.productions.edit');
    Route::delete('/member-space/scientific-productions/delete/{id}', [\App\Http\Controllers\Member\MemberController::class, 'sup_scientific_production'])->name('member.space.scientific.productions.delete');

    Route::post('/member-space/manage-lab/manage-team/manage-scientific-production/add-scientific-production-author/{id}', [\App\Http\Controllers\Member\MemberController::class, 'scientific_production_member_insert'])->name('member.scientific.production.author.insert');
    Route::delete('/member-space/manage-lab/manage-team/manage-scientific-production/delete-scientific-production-author/{id}/{member_id}', [\App\Http\Controllers\Member\MemberController::class, 'scientific_production_member_delete'])->name('member.scientific.production.author.delete');
    Route::delete('/member-space/manage-lab/manage-team/manage-scientific-production/delete-scientific-production-external-author/{id}/{author}', [\App\Http\Controllers\Member\MemberController::class, 'scientific_production_external_author_delete'])->name('member.scientific.production.external.author.delete');

});

Route::middleware(['auth', 'isPhdstudent'])->group(function () {
    Route::get('/phd-student-space/home', [\App\Http\Controllers\Phd_student\Phd_studentController::class, 'home'])->name('phd.student.space.home');
    Route::get('/phd-student-space/members', [\App\Http\Controllers\Phd_student\Phd_studentController::class, 'members'])->name('phd.student.space.members');
    Route::get('/phd-student-space/teams', [\App\Http\Controllers\Phd_student\Phd_studentController::class, 'teams'])->name('phd.student.space.teams');
    Route::get('/phd-student-space/materials', [\App\Http\Controllers\Phd_student\Phd_studentController::class, 'materials'])->name('phd.student.space.materials');
    Route::get('/phd-student-space/phd-thesis', [\App\Http\Controllers\Phd_student\Phd_studentController::class, 'phd_thesis'])->name('phd.student.space.phd.thesis');
    Route::put('/phd-student-space/phd-thesis/update/{id}', [\App\Http\Controllers\Phd_student\Phd_studentController::class, 'phd_thesis_update'])->name('phd.student.space.phd.thesis.edit');

});

Route::middleware(['auth', 'isProjectleader'])->group(function () {

    Route::get('/project-leader-space/home', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'home'])->name('project.leader.space.home');

    Route::get('/project-leader-space/members', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'members'])->name('project.leader.space.members');
    Route::get('/project-leader-space/teams', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'teams'])->name('project.leader.space.teams');
    Route::get('/project-leader-space/materials', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'materials'])->name('project.leader.space.materials');
    Route::get('/project-leader-space/projects', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'projects'])->name('project.leader.space.projects');
    Route::get('/project-leader-space/projects/manage-lab/manage-project/{id}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'project_index'])->name('project.leader.project.manage');

    Route::get('/project-leader-space/manage-lab/edit-project/{id}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'edit_project_index'])->name('project.leader.edit.project.index');
    Route::post('/project-leader-space/manage-lab/edit-project/{id}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'mise_project'])->name('project.leader.projects.edit');

    Route::post('/project-leader-space/manage-lab/manage-project/add-project-member/{id}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'project_member_insert_in_lab'])->name('project.leader.project.member.insert');
    Route::delete('/project-leader-space/manage-lab/delete-project-member/{id}/{projectId}/{isExternal}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'project_member_delete'])->name('project.leader.project.member.delete');
    Route::delete('/project-leader-space/manage-lab/delete-no-project-member/{id}/{projectId}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'sup_no_project_member'])->name('project.leader.no.project.member.delete');

    Route::post('/project-leader-space/manage-project/add-global-report/{id}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'project_global_report_insert'])->name('project.leader.project.global.report.insert');

    Route::post('/project-leader-space/manage-project/add-personal-report/{id}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'project_personal_report_insert'])->name('project.leader.project.personal.report.insert');

    Route::post('/project-leader-space/manage-project/edit-global-report/{id}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'mise_project_global_report'])->name('project.leader.project.global.report.edit');

    Route::post('/project-leader-space/manage-project/edit-personal-report/{id}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'mise_project_personal_report'])->name('project.leader.project.personal.report.edit');

});

Route::middleware(['auth', 'isTeamleader'])->group(function () {

    // Director Routes
    Route::get('/team-leader-space/home', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'home'])->name('team.leader.space.home');

    // team-leader Routes
    Route::get('/team-leader-space/members', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'members'])->name('team.leader.space.members');
    // team-leader Routes
    Route::get('/team-leader-space/teams', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'teams'])->name('team.leader.space.teams');
    // team-leader Routes
    Route::get('/team-leader-space/projects', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'projects'])->name('team.leader.space.projects');
    // team-leader Routes
    Route::get('/team-leader-space/materials', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'materials'])->name('team.leader.space.materials');

    // team-leader Routes
    Route::get('/team-leader-space/scientific-productions', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'scientific_productions'])->name('team.leader.space.scientific.productions');

    Route::put('/team-leader/manage-lab/edit-team/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'mise_team'])->name('team.leader.team.edit');
    Route::delete('/team-leader/manage-lab/delete-team-member/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'sup_team_member'])->name('team.leader.team.member.delete');

    //Manage Project
    Route::get('/team-leader-space/projects/manage-lab/manage-project/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'project_index'])->name('team.leader.project.manage');

    Route::post('/team-leader-space/manage-project/add-global-report/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'project_global_report_insert'])->name('team.leader.project.global.report.insert');

    Route::post('/team-leader-space/manage-project/add-personal-report/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'project_personal_report_insert'])->name('team.leader.project.personal.report.insert');

    Route::post('/team-leader-space/manage-project/edit-global-report/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'mise_project_global_report'])->name('team.leader.project.global.report.edit');

    Route::post('/team-leader-space/manage-project/edit-personal-report/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'mise_project_personal_report'])->name('team.leader.project.personal.report.edit');

    Route::get('/team-leader-space/phd-thesis', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'thesis_index'])->name('team.leader.space.phd.thesis');

    Route::post('/team-leader-space/add-phd-thesis/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'phd_thesis_insert'])->name('team.leader.phd.thesis.insert');

    Route::post('/team-leader-space/add-team-member-in/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'team_member_insert_in_lab'])->name('team.leader.team.member.insert.in');

    Route::get('/team-leader-space/manage-lab/manage-team/manage-scientific-production/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'index2'])->name('team.leader.team.scientific.production.manage');

    Route::post('/team-leader-space/scientific-productions/insert/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'scientific_production_insert'])->name('team.leader.space.scientific.productions.insert');
    Route::put('/team-leader-space/scientific-productions/edit/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'mise_scientific_production'])->name('team.leader.space.scientific.productions.edit');
    Route::delete('/team-leader-space/scientific-productions/delete/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'sup_scientific_production'])->name('team.leader.space.scientific.productions.delete');

    Route::post('/team-leader-space/manage-lab/manage-team/manage-scientific-production/add-scientific-production-author/{id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'scientific_production_member_insert'])->name('team.leader.scientific.production.author.insert');
    Route::delete('/team-leader-space/manage-lab/manage-team/manage-scientific-production/delete-scientific-production-author/{id}/{member_id}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'scientific_production_member_delete'])->name('team.leader.scientific.production.author.delete');
    Route::delete('/team-leader-space/manage-lab/manage-team/manage-scientific-production/delete-scientific-production-external-author/{id}/{author}', [\App\Http\Controllers\Team_leader\Team_leaderController::class, 'scientific_production_external_author_delete'])->name('team-leader.scientific.production.external.author.delete');
});

Route::middleware(['auth', 'is_project_member'])->group(function () {

    Route::get('/project_member-space/home', [\App\Http\Controllers\Project_member\Project_memberController::class, 'home'])->name('project.member.space.projects');
    Route::get('/project_member-space/projects/manage-lab/manage-project/{id}', [\App\Http\Controllers\Project_member\Project_memberController::class, 'project_index'])->name('project.member.project.manage');

    Route::post('/project_member-space/manage-project/add-personal-report/{id}', [\App\Http\Controllers\Project_member\Project_memberController::class, 'project_personal_report_insert'])->name('project.member.project.personal.report.insert');
    Route::post('/project-member-space/manage-project/edit-personal-report/{id}', [\App\Http\Controllers\Project_member\Project_memberController::class, 'mise_project_personal_report'])->name('project.member.project.personal.report.edit');

});

Route::middleware(['auth', 'is_supervisor'])->group(function () {
    Route::get('/supervisor-space/home', [\App\Http\Controllers\Supervisor_Cosupervisor\Supervisor_CosupervisorController::class, 'phd_thesis'])->name('supervisor.space.home');
    Route::put('/supervisor-space/phd-thesis/update/{id}', [\App\Http\Controllers\Supervisor_Cosupervisor\Supervisor_CosupervisorController::class, 'phd_thesis_update'])->name('supervisor.space.phd.thesis.edit');
    Route::put('/supervisor-space/phd-thesis/supervisor-remark/update/{id}', [\App\Http\Controllers\Supervisor_Cosupervisor\Supervisor_CosupervisorController::class, 'phd_thesis_remarks_update'])->name('supervisor.space.supervisor.remark.edit');
});

Route::middleware(['auth', 'is_co_supervisor'])->group(function () {

    Route::get('/co_supervisor-space/home', [\App\Http\Controllers\Supervisor_Cosupervisor\Supervisor_CosupervisorController::class, 'co_phd_thesis'])->name('co.supervisor.space.home');
    Route::put('/co_supervisor-space/phd-thesis/update/{id}', [\App\Http\Controllers\Supervisor_Cosupervisor\Supervisor_CosupervisorController::class, 'co_phd_thesis_update'])->name('co.supervisor.space.phd.thesis.edit');
    Route::put('/co_supervisor-space/phd-thesis/co-supervisor-remark/update/{id}', [\App\Http\Controllers\Supervisor_Cosupervisor\Supervisor_CosupervisorController::class, 'phd_thesis_remarks_update'])->name('co.supervisor.space.supervisor.remark.edit');
});

Route::middleware(['auth', 'collab_space'])->group(function () {

    Route::get('/collaboration-space/home', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'collaboration_space_home_index'])->name('collaboration.space.home');

    Route::get('/collaboration-space/projects', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'collaboration_space_projects_index'])->name('collaboration.space.projects');

    Route::post('/collaboration-space/add-project/{id}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'director_create_project_invite_Labs'])->name('collaboration.space.project.insert');
    Route::put('/collaboration-space/edit-project/{id}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'director_mise_project_collab'])->name('collaboration.space.project.edit');
    Route::delete('/collaboration-space/manage-lab/delete-project/{id}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'sup_project'])->name('collaboration.space.projects.delete');

    Route::post('/collaboration-space/manage-project/add-global-report/{id}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'project_global_report_insert'])->name('collaboration.project.global.report.insert');

    Route::post('/collaboration-space/manage-project/add-personal-report/{id}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'project_personal_report_insert'])->name('collaboration.project.personal.report.insert');

    Route::post('/collaboration-space/manage-project/edit-global-report/{id}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'mise_project_global_report'])->name('collaboration.project.global.report.edit');

    Route::post('/collaboration-space/manage-project/edit-personal-report/{id}', [\App\Http\Controllers\Project_leader\Project_leaderController::class, 'mise_project_personal_report'])->name('collaboration.project.personal.report.edit');

    Route::get('/collaboration-space/projects/view/{id}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'collaboration_space_projects_view_index'])->name('collaboration.space.project.view');
    Route::post('/collaboration-space/projects/add-member/{id}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'director_collab_project_member_insert'])->name('collaboration.space.project.member.insert');

    Route::post('/collaboration-space/projects/invite-labs/{id}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'director_invite_Labs'])->name('collaboration.space.projects.invite.labs');
    Route::delete('/collaboration-space/projects/delete-labs/{id}/{id2}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'director_removeLabsFromProject'])->name('collaboration.space.projects.delete.labs');

    Route::get('/collaboration-space/invitations', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'collaboration_space_invitations_index'])->name('collaboration.space.invitations');
    Route::put('/collaboration-space/invitations/accept/{id}/{id1}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'director_accept_project_Invitation'])->name('collaboration.space.invitations.accept');
    Route::delete('/collaboration-space/invitations/refuse/{id}/{id1}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'director_reject_project_Invitation'])->name('collaboration.space.invitations.refuse');

    Route::get('/collaboration-space/phd-thesis', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'collaboration_space_phd_thesis_index'])->name('collaboration.space.phd.thesis');
    Route::get('/collaboration-space/phd-thesis/view/{id}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'collaboration_space_phd_thesis_view_index'])->name('collaboration.space.phd.thesis.view');
    Route::post('/collaboration-space/phd-thesis/add-member/{id}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'supervisor_invite_member_phd_thesis_collab'])->name('collaboration.space.phd.thesis.member.insert');
    Route::put('/collaboration-space/invitations/phd/accept/{id}/{id1}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'member_accept_phd_thesis_Invitation'])->name('collaboration.space.invitations.phd.accept');
    Route::delete('/collaboration-space/invitations/phd/refuse/{id}/{id1}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'member_reject_phd_thesis_Invitation'])->name('collaboration.space.invitations.phd.refuse');

    Route::delete('/collaboration-space/projects/delete-thesis-member/{id}/{id2}', [\App\Http\Controllers\Collaboration\CollaborationController::class, 'supervisor_removePhdStudentsFromThesis'])->name('collaboration.space.projects.delete.thesis.member');

});

require __DIR__ . '/auth.php';
