<?php
namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
 
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
 
    protected $fillable = [
        'name', 'email', 'password',
        'phone', 'block', 'show_phone', 'avatar', 'role',
    ];
 
    protected $hidden = ['password', 'remember_token'];
 
    protected $casts = [
        'email_verified_at' => 'datetime',
        'show_phone'        => 'boolean',
        'password'          => 'hashed',
    ];
 
    public function products()       { return $this->hasMany(Product::class); }
    public function favourites()     { return $this->belongsToMany(Product::class, 'favourites')->withTimestamps(); }
    public function sentMessages()   { return $this->hasMany(Message::class, 'sender_id'); }
    public function buyConversations() { return $this->hasMany(Conversation::class, 'buyer_id'); }
    public function sellConversations(){ return $this->hasMany(Conversation::class, 'seller_id'); }
    public function reports()        { return $this->hasMany(Report::class, 'reported_by'); }
 
    public function isAdmin(): bool  { return $this->role === 'admin'; }
}
 