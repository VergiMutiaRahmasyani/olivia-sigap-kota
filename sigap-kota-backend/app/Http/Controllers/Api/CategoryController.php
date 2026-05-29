<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Category::active()->get());
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'name'        => 'required|string|max:100|unique:categories',
            'icon'        => 'nullable|string',
            'description' => 'nullable|string',
            'sort_order'  => 'nullable|integer',
        ]);

        $data['slug'] = \Str::slug($data['name']);
        $category = Category::create($data);

        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'name'        => 'sometimes|string|max:100',
            'icon'        => 'nullable|string',
            'description' => 'nullable|string',
            'is_active'   => 'sometimes|boolean',
            'sort_order'  => 'sometimes|integer',
        ]);

        $category->update($data);
        return response()->json($category);
    }

    public function destroy(Request $request, Category $category): JsonResponse
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($category->reports()->exists()) {
            return response()->json(['message' => 'Kategori memiliki laporan, tidak dapat dihapus.'], 422);
        }

        $category->delete();
        return response()->json(['message' => 'Kategori dihapus.']);
    }
}
