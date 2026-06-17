<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reported_by')->constrained('users')->cascadeOnDelete();
            $table->enum('reason', [
                'spam', 'fake_product', 'wrong_category',
                'inappropriate_content', 'already_sold', 'other'
            ]);
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'ignored', 'resolved'])->default('pending');
            $table->timestamps();
            // user can report a product only once
            $table->unique(['product_id', 'reported_by']);
        });
    }
    public function down(): void { Schema::dropIfExists('reports'); }
};