<?php

namespace App\Http\Controllers;
 
use App\Models\{Category, Product, Report, User};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Storage, Validator};
use Illuminate\Support\Str;
 
class AdminController extends Controller
{
    // Dashboard stats
    public function stats()
    {
        return response()->json([
            'total_users'       => User::count(),
            'total_products'    => Product::count(),
            'available_products'=> Product::available()->count(),
            'sold_products'     => Product::sold()->count(),
            'reported_listings' => Report::where('status', 'pending')->count(),
        ]);
    }
 
    // All users
    public function users(Request $request)
    {
        $users = User::withCount('products')->latest()->paginate(20);
        return response()->json($users);
    }
 
    // All products (reports highlighted)
    public function products(Request $request)
    {
        $query = Product::with(['user', 'category', 'images'])
                        ->withCount(['reports' => fn($q) => $q->where('status', 'pending')]);
 
        if ($request->query('reported')) {
            $query->having('reports_count', '>', 0);
        }
 
        $query->orderByDesc('reports_count')->latest();
 
        return response()->json($query->paginate(20));
    }
 
    // Delete product
    public function deleteProduct(int $id)
    {
        $product = Product::findOrFail($id);
        foreach ($product->images as $img) {
            Storage::disk('public')->delete($img->image_path);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted by admin.']);
    }
 
    // Reported listings (pending, prioritized)
    public function reports()
    {
        $reports = Report::with(['product.images', 'reporter'])
                         ->where('status', 'pending')
                         ->latest()
                         ->paginate(20);
        return response()->json($reports);
    }
 
    // Ignore report
    public function ignoreReport(int $reportId)
    {
        $report = Report::findOrFail($reportId);
        $report->update(['status' => 'ignored']);
        return response()->json(['message' => 'Report ignored.']);
    }
 
    // Delete listing via report
    public function deleteViaReport(int $reportId)
    {
        $report  = Report::with('product.images')->findOrFail($reportId);
        $product = $report->product;
 
        if ($product) {
            foreach ($product->images as $img) {
                Storage::disk('public')->delete($img->image_path);
            }
            $product->delete();
        }
 
        $report->update(['status' => 'resolved']);
        return response()->json(['message' => 'Listing deleted and report resolved.']);
    }
 
    // ── Category Management ──
 
    public function listCategories()
    {
        return response()->json(Category::withCount('products')->get());
    }
 
    public function addCategory(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:categories,name',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);
 
        $cat = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);
        return response()->json($cat, 201);
    }
 
    public function editCategory(Request $request, int $id)
    {
        $cat = Category::findOrFail($id);
        $v   = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:categories,name,' . $id,
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);
 
        $cat->update(['name' => $request->name, 'slug' => Str::slug($request->name)]);
        return response()->json($cat);
    }
 
    public function deleteCategory(int $id)
    {
        $cat = Category::withCount('products')->findOrFail($id);
        if ($cat->products_count > 0) {
            return response()->json(['message' => 'Cannot delete category with active products.'], 409);
        }
        $cat->delete();
        return response()->json(['message' => 'Category deleted.']);
    }
}
 