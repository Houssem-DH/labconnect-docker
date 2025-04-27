<?php

// App/Events/MessageSent.php
namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageSent implements ShouldBroadcast
{
    

    public $message;
    

    public function __construct(Message $message)
    {
        $this->message = $message;
     
    }

    public function broadcastOn()
    {
        return new Channel('chat.' . $this->message->chat_id);
    }

    public function broadcastWith()
    {
        return [
            'chat_id' => $this->message->chat_id,
            'message' => $this->message,
            'sender' => $this->message->sender, // Adjust as needed
        ];
    }
}