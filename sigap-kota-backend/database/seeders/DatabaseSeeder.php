<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Super Admin ──────────────────────────────────────────
        User::create([
            'name'     => 'Super Admin SigapKota',
            'email'    => 'superadmin@sigapkota.id',
            'phone'    => '08100000001',
            'role'     => 'superadmin',
            'password' => Hash::make('superadmin123'),
        ]);

        // ── Admin ────────────────────────────────────────────────
        User::create([
            'name'     => 'Admin SigapKota',
            'email'    => 'admin@sigapkota.id',
            'phone'    => '08100000002',
            'role'     => 'admin',
            'password' => Hash::make('admin1234'),
        ]);

        // ── Petugas ──────────────────────────────────────────────
        User::create([
            'name'      => 'Budi Santoso',
            'email'     => 'petugas@sigapkota.id',
            'phone'     => '08100000003',
            'role'      => 'petugas',
            'kecamatan' => 'Sukamaju',
            'password'  => Hash::make('petugas1234'),
        ]);

        // ── Warga (demo) ─────────────────────────────────────────
        User::create([
            'name'      => 'Andi Warga',
            'email'     => 'warga@sigapkota.id',
            'phone'     => '08100000004',
            'role'      => 'warga',
            'kecamatan' => 'Sukamaju',
            'password'  => Hash::make('warga1234'),
        ]);

        // ── Kategori Infrastruktur ───────────────────────────────
        $categories = [
            ['name' => 'Jalan Berlubang',       'icon' => 'road',        'sort_order' => 1],
            ['name' => 'Lampu Jalan Mati',       'icon' => 'lightbulb',   'sort_order' => 2],
            ['name' => 'Saluran Air Tersumbat',  'icon' => 'water',       'sort_order' => 3],
            ['name' => 'Trotoar Rusak',          'icon' => 'footpath',    'sort_order' => 4],
            ['name' => 'Jembatan Rusak',         'icon' => 'bridge',      'sort_order' => 5],
            ['name' => 'Pohon Tumbang',          'icon' => 'tree',        'sort_order' => 6],
            ['name' => 'Tiang Listrik Rusak',    'icon' => 'electricity', 'sort_order' => 7],
            ['name' => 'Fasilitas Taman Rusak',  'icon' => 'park',        'sort_order' => 8],
            ['name' => 'Rambu Lalu Lintas',      'icon' => 'sign',        'sort_order' => 9],
            ['name' => 'Lainnya',                'icon' => 'other',       'sort_order' => 99],
        ];

        foreach ($categories as $cat) {
            Category::create([
                'name'       => $cat['name'],
                'slug'       => \Str::slug($cat['name']),
                'icon'       => $cat['icon'],
                'sort_order' => $cat['sort_order'],
            ]);
        }
    }
}
