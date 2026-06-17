<?php

namespace App\Http\Controllers;
 
use App\Models\{Product, ProductImage};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Storage, Validator};
 
class ProductController extends Controller
{
    // Browse all available products with search + filter
    public function index(Request $request)
    {
        $query = Product::with(['user', 'category', 'images'])
                        ->available();
 
        // Search
        if ($s = $request->query('search')) {
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%$s%")
                  ->orWhere('description', 'like', "%$s%")
                  ->orWhereHas('category', fn($c) => $c->where('name', 'like', "%$s%"));
            });
        }
 
        // Category filter
        if ($cat = $request->query('category')) {
            $query->whereHas('category', fn($c) => $c->where('slug', $cat));
        }
 
        // Price filter
        if ($min = $request->query('min_price')) $query->where('price', '>=', $min);
        if ($max = $request->query('max_price')) $query->where('price', '<=', $max);
 
        // Condition filter
        if ($cond = $request->query('condition')) $query->where('condition', $cond);
 
        // Sorting
        $sort = $request->query('sort', 'newest');
        match ($sort) {
            'oldest'       => $query->oldest(),
            'price_low'    => $query->orderBy('price'),
            'price_high'   => $query->orderBy('price', 'desc'),
            default        => $query->latest(),
        };
 
        return response()->json($query->paginate(15));
    }
 
    // View single product (increment views)
    public function show(int $id)
    {
        $product = Product::with(['user', 'category', 'images'])->findOrFail($id);
        $product->incrementViews();
 
        // Hide phone if user disabled it
        if (!$product->user->show_phone) {
            $product->user->makeHidden('phone');
        }
 
        return response()->json($product);
    }
 
    // Create listing
    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|integer|min:0',
            'condition'   => 'required|in:new,like_new,good,fair',
            'negotiable'  => 'nullable|boolean',
            'images'      => 'required|array|min:1|max:6',
            'images.*'    => 'image|max:3072',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);
 
        $product = $request->user()->products()->create([
            'category_id' => $request->category_id,
            'title'       => $request->title,
            'description' => $request->description,
            'price'       => $request->price,
            'condition'   => $request->condition,
            'negotiable'  => $request->boolean('negotiable'),
        ]);
 
        foreach ($request->file('images') as $img) {
            $path = $img->store('products', 'public');
            $product->images()->create(['image_path' => $path]);
        }
 
        return response()->json($product->load(['category', 'images']), 201);
    }
 
    // Edit listing (owner only)
    public function update(Request $request, int $id)
    {
        $product = Product::findOrFail($id);
        if ($product->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }
 
        $v = Validator::make($request->all(), [
            'category_id' => 'sometimes|exists:categories,id',
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price'       => 'sometimes|integer|min:0',
            'condition'   => 'sometimes|in:new,like_new,good,fair',
            'negotiable'  => 'nullable|boolean',
            'new_images'  => 'nullable|array|max:6',
            'new_images.*'=> 'image|max:3072',
            'remove_image_ids' => 'nullable|array',
            'remove_image_ids.*' => 'integer',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);
 
        $product->update($v->safe()->except(['new_images', 'remove_image_ids']));
 
        // Remove selected images
        if ($request->remove_image_ids) {
            $toDelete = $product->images()->whereIn('id', $request->remove_image_ids)->get();
            foreach ($toDelete as $img) {
                Storage::disk('public')->delete($img->image_path);
                $img->delete();
            }
        }
 
        // Add new images (respect 6-image cap)
        if ($request->hasFile('new_images')) {
            $currentCount = $product->images()->count();
            foreach ($request->file('new_images') as $img) {
                if ($currentCount >= 6) break;
                $path = $img->store('products', 'public');
                $product->images()->create(['image_path' => $path]);
                $currentCount++;
            }
        }
 
        return response()->json($product->load(['category', 'images']));
    }
 
    // Delete listing (owner only)
    public function destroy(Request $request, int $id)
    {
        $product = Product::findOrFail($id);
        if ($product->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }
 
        // Delete images from storage
        foreach ($product->images as $img) {
            Storage::disk('public')->delete($img->image_path);
        }
 
        $product->delete();
        return response()->json(['message' => 'Listing deleted.']);
    }
 
    // Mark as sold
    public function markSold(Request $request, int $id)
    {
        $product = Product::findOrFail($id);
        if ($product->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }
        $product->update(['status' => 'sold']);
        return response()->json(['message' => 'Marked as sold.']);
    }
 
    // Mark as available again
    public function markAvailable(Request $request, int $id)
    {
        $product = Product::findOrFail($id);
        if ($product->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }
        $product->update(['status' => 'available']);
        return response()->json(['message' => 'Marked as available.']);
    }
 
    // Own listings
    public function myListings(Request $request)
    {
        $listings = $request->user()->products()->with(['category', 'images'])->latest()->get();
        return response()->json($listings);
    }
}
 