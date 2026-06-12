<?php

use Illuminate\Support\Facades\Route;

// Route untuk landing page atau view utama Anda
Route::get('/', function () {
    return view('welcome');
});

// TAMBAHKAN INI: Catch-all route untuk mendukung Client-Side Routing (React)
// Semua request yang tidak cocok dengan route di atas akan dilempar ke view 'welcome'
Route::get('{any}', function () {
    return view('welcome');
})->where('any', '.*');