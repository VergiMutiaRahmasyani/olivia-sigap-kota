<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $query = User::query()->latest();

        if ($request->filled('role'))   $query->where('role', $request->role);
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(fn($q2) => $q2->where('name', 'like', "%$q%")->orWhere('email', 'like', "%$q%"));
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'phone'    => 'required|string',
            'role'     => 'required|in:warga,petugas,admin',
            'password' => ['required', Password::min(8)],
        ]);

        // Hanya superadmin yang boleh buat admin
        if ($data['role'] === 'admin' && !$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Hanya superadmin yang dapat membuat akun admin.'], 403);
        }

        $user = User::create($data);
        return response()->json($user, 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'name'      => 'sometimes|string|max:255',
            'phone'     => 'sometimes|string',
            'role'      => 'sometimes|in:warga,petugas,admin',
            'is_active' => 'sometimes|boolean',
        ]);

        $user->update($data);
        return response()->json($user);
    }

    public function toggleActive(Request $request, User $user): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $user->update(['is_active' => !$user->is_active]);
        $status = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return response()->json(['message' => "Akun berhasil $status.", 'user' => $user]);
    }
}
