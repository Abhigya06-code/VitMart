<?php
use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;
 
Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    $conv = Conversation::find($conversationId);
    return $conv && ($conv->buyer_id === $user->id || $conv->seller_id === $user->id);
});
 