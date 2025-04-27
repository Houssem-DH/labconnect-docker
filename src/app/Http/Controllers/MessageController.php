<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\MessageSent;
use App\Models\Chat;
use App\Models\Message;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function index($chatId)
    {
        $chat = Chat::with('messages.sender')->findOrFail($chatId);
        return response()->json($chat);
    }

    public function store(Request $request)
{
    // Validate the request with optional message, file, and image
    $validated = $request->validate([
        'chat_id' => 'required|exists:chats,id',
        'sender_id' => 'required|exists:users,id',
        'message' => 'nullable|string|max:1000', // Message is optional if a file or image is uploaded
        'file' => 'nullable|file|max:10240', // Allow file upload, max size 10MB
        'image' => 'nullable|image|max:5120', // Allow image upload, max size 5MB
    ]);

    $fileUrl = null;
    $imageUrl = null;

    // Handle file upload if provided
    if ($request->hasFile('file')) {
        // Store the file in "message_files/{chat_id}" folder in public storage
        $fileUrl = $request->file('file')->store("message_files/{$validated['chat_id']}", 'public');
    }

    // Handle image upload if provided
    if ($request->hasFile('image')) {
        // Store the image in "message_images/{chat_id}" folder in public storage
        $imageUrl = $request->file('image')->store("message_images/{$validated['chat_id']}", 'public');
    }

    // Create the message
    $message = Message::create([
        'chat_id' => $validated['chat_id'],
        'sender_id' => $validated['sender_id'],
        'message' => $validated['message'] ?? '', // If no message, default to empty string
        'file' => $fileUrl,
        'image' => $imageUrl,
    ]);

    // Load sender details for broadcasting
    $message->load('sender');

    // Broadcast the message to others in real-time
    broadcast(new MessageSent($message))->toOthers();

    // Return the new message, including the file and image URLs
    return response()->json($message, 200);
}






}