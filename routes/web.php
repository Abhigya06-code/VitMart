<?php

use App\Http\Controllers\{
    AuthController, ProfileController, ProductController,
    FavouriteController, ConversationController, ReportController,
    CategoryController, AdminController
};
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;
 
// ── Public ──────────────────────────────────────────────────
Route::post('/auth/register',    [AuthController::class, 'register']);
Route::post('/auth/verify-otp',  [AuthController::class, 'verifyOtp']);
Route::post('/auth/login',       [AuthController::class, 'login']);
Route::get('/categories',        [CategoryController::class, 'index']);
Route::get('/products',          [ProductController::class, 'index']);
Route::get('/products/{id}',     [ProductController::class, 'show']);
 
// ── Authenticated ────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
 
    // Profile
    Route::get('/profile',         [ProfileController::class, 'show']);
    Route::put('/profile',         [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
 
    // Products
    Route::post('/products',                        [ProductController::class, 'store']);
    Route::put('/products/{id}',                    [ProductController::class, 'update']);
    Route::delete('/products/{id}',                 [ProductController::class, 'destroy']);
    Route::patch('/products/{id}/sold',             [ProductController::class, 'markSold']);
    Route::patch('/products/{id}/available',        [ProductController::class, 'markAvailable']);
    Route::get('/my-listings',                      [ProductController::class, 'myListings']);
 
    // Favourites
    Route::get('/favourites',               [FavouriteController::class, 'index']);
    Route::post('/favourites/{product}',    [FavouriteController::class, 'add']);
    Route::delete('/favourites/{product}',  [FavouriteController::class, 'remove']);
 
    // Chat
    Route::get('/conversations',                        [ConversationController::class, 'index']);
    Route::post('/conversations',                       [ConversationController::class, 'store']);
    Route::get('/conversations/{id}/messages',          [ConversationController::class, 'messages']);
    Route::post('/conversations/{id}/messages',         [ConversationController::class, 'sendMessage']);
 
    // Reports
    Route::post('/products/{id}/report', [ReportController::class, 'store']);
});
 
// ── Admin ────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', AdminMiddleware::class])->prefix('admin')->group(function () {
    Route::get('/stats',            [AdminController::class, 'stats']);
    Route::get('/users',            [AdminController::class, 'users']);
    Route::get('/products',         [AdminController::class, 'products']);
    Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']);
    Route::get('/reports',          [AdminController::class, 'reports']);
    Route::patch('/reports/{id}/ignore',         [AdminController::class, 'ignoreReport']);
    Route::patch('/reports/{id}/delete-listing', [AdminController::class, 'deleteViaReport']);
    Route::get('/categories',           [AdminController::class, 'listCategories']);
    Route::post('/categories',          [AdminController::class, 'addCategory']);
    Route::put('/categories/{id}',      [AdminController::class, 'editCategory']);
    Route::delete('/categories/{id}',   [AdminController::class, 'deleteCategory']);
});
 