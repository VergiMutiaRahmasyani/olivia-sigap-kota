<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users',
            'phone'     => 'required|string|max:15',
            'nik'       => 'nullable|string|size:16|unique:users',
            'address'   => 'nullable|string',
            'kelurahan' => 'nullable|string',
            'kecamatan' => 'nullable|string',
            'password'  => ['required', 'confirmed', Password::min(8)],
        ]);

        $user  = User::create($data);
        $token = $user->createToken('sigapkota')->plainTextToken;

        return response()->json([
            'message' => 'Registrasi berhasil.',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'Email atau password salah.',
            ]);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Akun Anda dinonaktifkan. Hubungi admin.'], 403);
        }

        $token = $user->createToken('sigapkota')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout berhasil.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        $totalReports    = $user->reports()->count();
        $completedReports = $user->reports()->where('status', 'selesai')->count();
        $totalVotes      = ReportVote::whereIn(
                            'report_id',
                            $user->reports()->pluck('id')
                        )->count();

        return response()->json([
            'user' => array_merge($user->toArray(), [
                'total_reports'     => $totalReports,
                'completed_reports' => $completedReports,
                'total_votes'       => $totalVotes,
                'xp_to_next_level'  => $user->xpToNextLevel(),
                'xp_progress'       => $user->xpProgress(),
            ]),
        ]);
    }
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name'      => 'sometimes|string|max:255',
            'email'     => 'sometimes|email|unique:users,email,' . $user->id,
            'phone'     => 'sometimes|nullable|string|max:15',
            'kelurahan' => 'sometimes|nullable|string',
            'kecamatan' => 'sometimes|nullable|string',
            'bio'       => 'sometimes|nullable|string|max:160',
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Profil diperbarui.',
            'user'    => $this->me($request)->getData()->user,
        ]);
    }
}