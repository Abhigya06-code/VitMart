<?php
namespace App\Http\Controllers;
 
use App\Models\{Conversation, Message, Product};
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
 
class ConversationController extends Controller
{
    // All conversations for the authenticated user
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $conversations = Conversation::with(['product.images', 'buyer', 'seller', 'latestMessage'])
            ->where('buyer_id', $userId)
            ->orWhere('seller_id', $userId)
            ->latest('updated_at')
            ->get()
            ->map(function ($conv) use ($userId) {
                $conv->unread = $conv->unreadCount($userId);
                return $conv;
            });
 
        return response()->json($conversations);
    }
 
    // Start or retrieve conversation
    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);
 
        $product = Product::findOrFail($request->product_id);
        $buyer   = $request->user();
 
        if ($product->user_id === $buyer->id) {
            return response()->json(['message' => 'Cannot chat with yourself.'], 400);
        }
 
        $conversation = Conversation::firstOrCreate(
            ['product_id' => $product->id, 'buyer_id' => $buyer->id],
            ['seller_id'  => $product->user_id]
        );
 
        return response()->json($conversation->load(['product', 'buyer', 'seller']), 201);
    }
 
    // Get messages in conversation
    public function messages(Request $request, int $convId)
    {
        $conv = Conversation::findOrFail($convId);
        $this->authorizeConversation($conv, $request->user()->id);
 
        // Mark all incoming messages as read
        $conv->messages()
             ->where('sender_id', '!=', $request->user()->id)
             ->where('is_read', false)
             ->update(['is_read' => true]);
 
        return response()->json($conv->messages()->with('sender')->get());
    }
 
    // Send message
    public function sendMessage(Request $request, int $convId)
    {
        $conv = Conversation::findOrFail($convId);
        $this->authorizeConversation($conv, $request->user()->id);
 
        $v = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);
 
        $msg = Message::create([
            'conversation_id' => $conv->id,
            'sender_id'       => $request->user()->id,
            'message'         => $request->message,
        ]);
 
        $conv->touch(); // update updated_at for ordering
 
        // Broadcast (Reverb)
        broadcast(new MessageSent($msg->load('sender')))->toOthers();
 
        return response()->json($msg->load('sender'), 201);
    }
 
    private function authorizeConversation(Conversation $conv, int $userId): void
    {
        if ($conv->buyer_id !== $userId && $conv->seller_id !== $userId) {
            abort(403, 'Unauthorized.');
        }
    }
}
 