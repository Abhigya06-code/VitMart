<?php
namespace App\Http\Controllers;
 
use App\Models\{Product, Report};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
 
class ReportController extends Controller
{
    public function store(Request $request, int $productId)
    {
        $product = Product::findOrFail($productId);
 
        $alreadyReported = Report::where('product_id', $productId)
                                  ->where('reported_by', $request->user()->id)
                                  ->exists();
        if ($alreadyReported) {
            return response()->json(['message' => 'You have already reported this listing.'], 409);
        }
 
        $v = Validator::make($request->all(), [
            'reason'      => 'required|in:spam,fake_product,wrong_category,inappropriate_content,already_sold,other',
            'description' => 'nullable|string|max:500',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);
 
        Report::create([
            'product_id'  => $product->id,
            'reported_by' => $request->user()->id,
            'reason'      => $request->reason,
            'description' => $request->description,
        ]);
 
        return response()->json(['message' => 'Report submitted.'], 201);
    }
}
 