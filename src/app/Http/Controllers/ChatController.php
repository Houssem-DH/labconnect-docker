<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Chat;
use App\Models\Project;
use App\Models\Project_Member;
use App\Models\Phd_Thesis;

use App\Events\MessageSent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{


    public function getOrCreateChatSession($userId)
    {


        $currentUserId = Auth::user()->id;

        // Find existing chat or create a new one if it doesn't exist
        $chat = Chat::where(function ($query) use ($currentUserId, $userId) {
            $query->where('user_one_id', $currentUserId)
                ->where('user_two_id', $userId);
        })->orWhere(function ($query) use ($currentUserId, $userId) {
            $query->where('user_one_id', $userId)
                ->where('user_two_id', $currentUserId);
        })->first();





        if (!$chat) {
            $chat = Chat::create([
                'user_one_id' => $currentUserId,
                'user_two_id' => $userId,
            ]);
        }

        return response()->json(['chatId' => $chat->id]);
    }



    public function getChatSession()
    {
        $currentUserId = Auth::user()->id;

        // Find existing chat or create a new one if it doesn't exist
        $chat = Chat::where('user_one_id', $currentUserId)
            ->orWhere('user_two_id', $currentUserId)
            ->first();

        if ($chat) {
            // Get the timestamp of the latest message in the chat
            $latestMessage = Message::where('chat_id', $chat->id)
                ->latest('created_at')
                ->first();

            // If there is a latest message, get its timestamp
            $lastMessageTimestamp = $latestMessage ? $latestMessage->created_at : null;

            // Get the new messages since the last timestamp
            $newMessages = Message::where('chat_id', $chat->id)
                ->where('created_at', '>', $lastMessageTimestamp)
                ->get();

            // Return the chat ID if new messages exist
            if ($newMessages->count() > 0) {
                return response()->json(['chatId' => $chat->id]);
            }

            // Return the chat ID if no new messages are found
            return response()->json(['chatId' => $chat->id]);
        }

        // Handle the case where no chat is found (create a new one if needed)
        return response()->json(['error' => 'No chat session found'], 404);
    }



    public function getGroupChatSession($projectId = null, $phdThesisId = null)
{
    $currentUserId = Auth::user()->id;

    // Check if user is part of a group chat based on project or PhD thesis
    $chat = Chat::where(function($query) use ($currentUserId) {
            $query->whereJsonContains('users_id', $currentUserId);
        })
        ->when($projectId, function ($query, $projectId) {
            $query->orWhere('project_id', $projectId);
        })
        ->when($phdThesisId, function ($query, $phdThesisId) {
            $query->orWhere('phd_thesis_id', $phdThesisId);
        })
        ->first();

    if ($chat) {
        // Get the timestamp of the latest message in the chat
        $latestMessage = Message::where('chat_id', $chat->id)
            ->latest('created_at')
            ->first();

        // If there is a latest message, get its timestamp
        $lastMessageTimestamp = $latestMessage ? $latestMessage->created_at : null;

        // Get new messages since the last timestamp
        $newMessages = Message::where('chat_id', $chat->id)
            ->where('created_at', '>', $lastMessageTimestamp)
            ->get();

        // Return the chat ID if new messages exist
        if ($newMessages->count() > 0) {
            return response()->json(['chatId' => $chat->id]);
        }

        // Return the chat ID if no new messages are found
        return response()->json(['chatId' => $chat->id]);
    }

    // Handle the case where no chat is found (create a new one if needed)
    return response()->json(['error' => 'No chat session found'], 404);
}







    public function getOrCreateGroupChatProjectSession($projectId)
    {



        $userIds = [];

        if ($projectId) {
            $project = Project::find($projectId);
            if (!$project) {
                return response()->json(['error' => 'Project not found'], 404);
            }

            $projectMembers = Project_Member::where("project_id", $project->id)->get();
            $projectUserIds = $projectMembers->pluck('user_id')->toArray();

            if (empty($projectUserIds)) {
                return response()->json(['error' => 'No project members found'], 404);
            }

            $userIds = array_merge($userIds, $projectUserIds);
        }

        sort($userIds);
        $userIdsJson = json_encode($userIds);

        Log::info("User IDs JSON: " . $userIdsJson);

        // Check if the chat exists
        $chat = Chat::whereRaw('users_id::jsonb @> ?', [$userIdsJson])->first();

        if (!$chat) {
            // Insert new chat record
            $chat = Chat::create([
                'users_id' => $userIdsJson,
                'project_id' => $projectId,
            ]);

            Log::info("New Chat Created: ", ['chat' => $chat]);
        } else {
            Log::info("Existing Chat Found: ", ['chat' => $chat]);
        }

        return response()->json(['chatId' => $chat->id]);
    }






    public function getOrCreateGroupChatPhdThesisSession($phdThesisId)
    {
        $currentUserId = Auth::user()->id;



        // Fetch PhD thesis details to get student IDs
        $phdThesis = Phd_Thesis::find($phdThesisId);





        // Fetch PhD thesis details to get student IDs
        $phdThesis = Phd_Thesis::find($phdThesisId);


        $phdStudentIds = array_map('intval', $phdThesis->phd_students_id);

        $userIds = $phdStudentIds;



        // Ensure the PhD thesis exists before querying student IDs
        if ($phdThesis) {
            // Initialize user IDs with the current user
            $userIds2 = [$phdThesis->supervisor_id, $phdThesis->co_supervisor_id];
            // Extract student IDs from PhD thesis data
            $userIds = array_merge($userIds, $userIds2);

        }

        // Sort user IDs to ensure a consistent order
        sort($userIds);

        $userIdsJson = json_encode($userIds);

        Log::info("User IDs JSON: " . $userIdsJson);


        // Check if the chat exists

        $chat = Chat::whereRaw('users_id::jsonb @> ?', [$userIdsJson])->first();

        if (!$chat) {
            $chat = Chat::create([
                'users_id' => json_encode($userIds),
                'phd_thesis_id' => $phdThesisId, // Attach PhD thesis if applicable
            ]);
        }

        return response()->json(['chatId' => $chat->id]);
    }




}