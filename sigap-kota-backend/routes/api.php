<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| SigapKota API Routes
|--------------------------------------------------------------------------
*/

// ── Auth (Public) ──────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

// ── Public ─────────────────────────────────────────────────────────────
Route::get('categories', [CategoryController::class, 'index']);

// ── Authenticated ──────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('logout',          [AuthController::class, 'logout']);
        Route::get('me',               [AuthController::class, 'me']);
        Route::post('me',              [AuthController::class, 'updateProfile']);
    });

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'stats']);

    // Laporan
    Route::apiResource('reports', ReportController::class)->only(['index', 'store', 'show']);
    Route::patch('reports/{report}/status',   [ReportController::class, 'updateStatus']);
    Route::post('reports/{report}/feedback',  [ReportController::class, 'submitFeedback']);
    Route::post('reports/{report}/reanalyze', [ReportController::class, 'reanalyze']);

    // Notifikasi
    Route::prefix('notifications')->group(function () {
        Route::get('/',              [NotificationController::class, 'index']);
        Route::get('unread-count',   [NotificationController::class, 'unreadCount']);
        Route::post('read-all',      [NotificationController::class, 'markAllAsRead']);
        Route::post('{id}/read',     [NotificationController::class, 'markAsRead']);
    });

    // Kategori (Admin)
    Route::post('categories',           [CategoryController::class, 'store']);
    Route::put('categories/{category}', [CategoryController::class, 'update']);
    Route::delete('categories/{category}', [CategoryController::class, 'destroy']);

    // Manajemen User (Admin)
    Route::prefix('users')->group(function () {
        Route::get('/',                        [UserController::class, 'index']);
        Route::post('/',                       [UserController::class, 'store']);
        Route::put('{user}',                   [UserController::class, 'update']);
        Route::patch('{user}/toggle-active',   [UserController::class, 'toggleActive']);
    });
});
