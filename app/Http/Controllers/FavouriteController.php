<?php
namespace App\Http\Controllers;
 
use App\Models\Product;
use Illuminate\Http\Request;
 
class FavouriteController extends Controller
{
    public function index(Request $request)
    {
        $favs = $request->user()->favourites()->with(['category', 'images', 'user'])->get();
        return response()->json($favs);
    }
 
    public function add(Request $request, int $productId)
    {
        $product = Product::findOrFail($productId);
        $request->user()->favourites()->syncWithoutDetaching([$product->id]);
        return response()->json(['message' => 'Added to favourites.']);
    }
 
    public function remove(Request $request, int $productId)
    {
        $request->user()->favourites()->detach($productId);
        return response()->json(['message' => 'Removed from favourites.']);
    }
}