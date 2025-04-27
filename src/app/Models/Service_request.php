<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service_request extends Model
{
    use HasFactory;

    protected $table = 'service_requests';
    protected $fillable =
        [
            'user_id',
            'labs_id',
            'applicant_type ',
            'title',
            'description',
            'applicant_tlp',
            'applicant_adresse_email',
            'request_date',
            'required_by',
            'comments',
            'request',
            'lab_answer_title',
            'lab_service_accept_answer',
            'lab_answer_price',
            'lab_answer_duration',
            'lab_answer_requirements',
            'lab_comments',
        ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }


    protected $casts = [
        'labs_id' => 'array',
        'request' => 'array', // Cast JSON to array
        'lab_answer_title' => 'array', // Cast JSON to array
        'lab_service_accept_answer' => 'array', // Cast JSON to array
        'lab_answer_price' => 'array', // Cast JSON to array
        'lab_answer_duration' => 'array', // Cast JSON to array
        'lab_answer_requirements' => 'array', // Cast JSON to array
        'lab_comments' => 'array', // Cast JSON to array
    ];

    public function StatusRequest($labId)
    {
        $request = $this->request ?? [];
        $request[$labId] = 'pending';
        $this->request = $request;

        $this->save();
    }

    public function respondToRequest($labId, $status, $answers)
{
    // Initialiser ou récupérer la structure JSON existante de la colonne request
    $request = $this->request ?? [];

    // Mettre à jour la clé du laboratoire avec le statut approprié
    $request[$labId] = $status;

    // Enregistrer les modifications dans la colonne JSON request
    $this->request = $request;

    if ($status === 'accepted') {
        // Ajouter les réponses dans chaque colonne JSON
        $this->updateJsonColumn('lab_answer_title', $labId, $answers['lab_answer_title']);
        $this->updateJsonColumn('lab_service_accept_answer', $labId, $answers['lab_service_accept_answer']);
        $this->updateJsonColumn('lab_answer_price', $labId, $answers['lab_answer_price']);
        $this->updateJsonColumn('lab_answer_duration', $labId, $answers['lab_answer_duration']);
        $this->updateJsonColumn('lab_answer_requirements', $labId, $answers['lab_answer_requirements']);
        $this->updateJsonColumn('lab_comments', $labId, $answers['lab_comments']);

        // Ajouter le lab_id à labs_id
        $labsIdArray = $this->labs_id ?? [];
        if (!in_array("$labId", $labsIdArray)) {
            $labsIdArray[] = "$labId";
        }
        $this->labs_id = $labsIdArray;
    }

    // Sauvegarder les modifications
    $this->save();
}

/**
 * Fonction pour mettre à jour une colonne JSON
 */
private function updateJsonColumn($column, $labId, $value)
{
    $data = $this->$column ?? [];
    $data[] = [$labId, $value];
    $this->$column = $data;
}




}
