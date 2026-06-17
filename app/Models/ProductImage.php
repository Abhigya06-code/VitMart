<?php
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class ProductImage extends Model
{
    protected $fillable = ['product_id', 'image_path'];
 
    public function product() { return $this->belongsTo(Product::class); }
 
    // Full URL accessor
    public function getImageUrlAttribute(): string
    {
        return asset('storage/' . $this->image_path);
    }
}