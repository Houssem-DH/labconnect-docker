<?php
namespace App\Services;

use App\Models\Chat;
use Illuminate\Support\Facades\Auth;

class ChatService
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

        return $chat;
    }
}


