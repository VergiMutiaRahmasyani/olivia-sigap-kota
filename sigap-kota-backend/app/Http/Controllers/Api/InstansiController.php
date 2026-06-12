<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Instansi;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class InstansiController extends Controller
{
    // ── GET /api/instansi ──────────────────────────────────────────────────
    public function index(): JsonResponse
    {
        try {
            // Mengambil semua data instansi dan memformatnya
            $instansi = Instansi::orderBy('nama')->get()->map(fn($i) => $this->format($i));

            // Stat summary untuk header cards di halaman React
            $stats = [
                'total'           => Instansi::count(),
                'routing_aktif'   => Instansi::where('ai_routing', true)->where('aktif', true)->count(),
                'gagal_kirim'     => 0, // TODO: sambungkan ke log pengiriman WA
                'pesan_terkirim'  => 0, // TODO: sambungkan ke log pengiriman WA
            ];

            return response()->json([
                'data'  => $instansi,
                'stats' => $stats,
            ]);

        } catch (\Exception $e) {
            // Menangkap eror database asli agar tidak memicu eror CORS tiruan di browser
            return response()->json([
                'message' => 'Eror Backend: ' . $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine()
            ], 500);
        }
    }

    // ── POST /api/instansi ─────────────────────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama'                 => 'required|string|max:255',
            'jenis'                => ['required', Rule::in(['PUPR','BPBD','Dishub','Polisi','Kesehatan','Lainnya'])],
            'kota'                 => 'nullable|string|max:255',
            'alamat'               => 'nullable|string|max:500',
            'email'                => 'required|email|unique:instansis,email',
            'penanggung_jawab'     => 'nullable|string|max:255',
            'no_hp'                => 'nullable|string|max:20',
            'whatsapp'             => 'nullable|string|max:20',
            'kategori_jalan_rusak' => 'boolean',
            'kategori_bencana'     => 'boolean',
            'kategori_lalu_lintas' => 'boolean',
            'radius'               => 'integer|min:1|max:50',
            'jam_operasional'      => 'string|max:100',
        ]);

        // Generate password sementara untuk instansi baru
        $tempPassword = Str::random(10);
        $validated['password'] = Hash::make($tempPassword);

        $instansi = Instansi::create($validated);

        // TODO: kirim email berisi $tempPassword ke $instansi->email
        // Mail::to($instansi->email)->send(new InstansiWelcomeMail($instansi, $tempPassword));

        return response()->json([
            'message' => 'Instansi berhasil ditambahkan.',
            'data'    => $this->format($instansi),
        ], 201);
    }

    // ── GET /api/instansi/{id} ─────────────────────────────────────────────
    public function show(Instansi $instansi): JsonResponse
    {
        return response()->json(['data' => $this->format($instansi)]);
    }

    // ── PUT /api/instansi/{id} ─────────────────────────────────────────────
    public function update(Request $request, Instansi $instansi): JsonResponse
    {
        $validated = $request->validate([
            'nama'                 => 'sometimes|string|max:255',
            'jenis'                => ['sometimes', Rule::in(['PUPR','BPBD','Dishub','Polisi','Kesehatan','Lainnya'])],
            'kota'                 => 'nullable|string|max:255',
            'alamat'               => 'nullable|string|max:500',
            'email'                => ['sometimes','email', Rule::unique('instansis','email')->ignore($instansi->id)],
            'penanggung_jawab'     => 'nullable|string|max:255',
            'no_hp'                => 'nullable|string|max:20',
            'whatsapp'             => 'nullable|string|max:20',
            'kategori_jalan_rusak' => 'boolean',
            'kategori_bencana'     => 'boolean',
            'kategori_lalu_lintas' => 'boolean',
            'radius'               => 'integer|min:1|max:50',
            'jam_operasional'      => 'string|max:100',
            'aktif'                => 'boolean',
            'ai_routing'           => 'boolean',
        ]);

        $instansi->update($validated);

        return response()->json([
            'message' => 'Instansi berhasil diperbarui.',
            'data'    => $this->format($instansi->fresh()),
        ]);
    }

    // ── PATCH /api/instansi/{id}/toggle-aktif ─────────────────────────────
    public function toggleAktif(Instansi $instansi): JsonResponse
    {
        $instansi->update(['aktif' => !$instansi->aktif]);

        return response()->json([
            'message' => 'Status instansi diperbarui.',
            'aktif'   => $instansi->aktif,
        ]);
    }

    // ── DELETE /api/instansi/{id} ──────────────────────────────────────────
    public function destroy(Instansi $instansi): JsonResponse
    {
        $instansi->delete();

        return response()->json(['message' => 'Instansi berhasil dihapus.']);
    }

    // ── Private helper: format response ───────────────────────────────────
    private function format(Instansi $i): array
    {
        return [
            'id'                   => $i->id,
            'nama'                 => $i->nama,
            'jenis'                => $i->jenis,
            // Menggunakan properti bawaan jika kategori_label adalah accessor/attribute di model
            'kategori_label'       => $i->kategori_label ?? null, 
            'kota'                 => $i->kota,
            'alamat'               => $i->alamat,
            'email'                => $i->email,
            'penanggung_jawab'     => $i->penanggung_jawab,
            'no_hp'                => $i->no_hp,
            'whatsapp'             => $i->whatsapp,
            'kategori_jalan_rusak' => (bool)$i->kategori_jalan_rusak,
            'kategori_bencana'     => (bool)$i->kategori_bencana,
            'kategori_lalu_lintas' => (bool)$i->kategori_lalu_lintas,
            'radius'               => $i->radius,
            'jam_operasional'      => $i->jam_operasional,
            'aktif'                => (bool)$i->aktif,
            'ai_routing'           => (bool)$i->ai_routing,
            'created_at'           => $i->created_at?->diffForHumans(),
            'updated_at'           => $i->updated_at?->diffForHumans(),
        ];
    }
}