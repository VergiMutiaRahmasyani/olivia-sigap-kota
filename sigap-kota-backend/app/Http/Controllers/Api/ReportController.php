<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportPhoto;
use App\Models\ReportStatusHistory;
use App\Notifications\ReportStatusUpdated;
use App\Services\AiSeverityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    public function __construct(private AiSeverityService $aiService) {}

    // ─── GET /reports ────────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $user  = $request->user();
        $query = Report::with(['user:id,name,phone', 'category', 'primaryPhoto'])
                       ->latest();

        // Warga hanya melihat laporannya sendiri
        if ($user->isWarga()) {
            $query->forWarga($user->id);
        }

        // Filter opsional
        if ($request->filled('status'))    $query->byStatus($request->status);
        if ($request->filled('severity'))  $query->bySeverity($request->severity);
        if ($request->filled('category'))  $query->where('category_id', $request->category);
        if ($request->filled('kecamatan')) $query->where('kecamatan', $request->kecamatan);
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(fn($q2) => $q2->where('title', 'like', "%$q%")
                                        ->orWhere('report_number', 'like', "%$q%")
                                        ->orWhere('location_address', 'like', "%$q%"));
        }

        $reports = $query->paginate($request->get('per_page', 15));

        return response()->json($reports);
    }

    // ─── POST /reports ───────────────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category_id'      => 'required|exists:categories,id',
            'title'            => 'required|string|max:255',
            'description'      => 'required|string|min:20',
            'location_address' => 'required|string',
            'kelurahan'        => 'nullable|string',
            'kecamatan'        => 'nullable|string',
            'latitude'         => 'nullable|numeric|between:-90,90',
            'longitude'        => 'nullable|numeric|between:-180,180',
            'photos'           => 'required|array|min:1|max:5',
            'photos.*'         => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        DB::beginTransaction();
        try {
            $report = Report::create([
                ...$data,
                'user_id'       => $request->user()->id,
                'report_number' => Report::generateReportNumber(),
                'status'        => 'menunggu',
            ]);

            // Simpan foto
            $photoUrls = [];
            foreach ($request->file('photos') as $i => $photo) {
                $path = $photo->store("reports/{$report->id}", 'public');
                ReportPhoto::create([
                    'report_id'  => $report->id,
                    'path'       => $path,
                    'is_primary' => $i === 0,
                ]);
                $photoUrls[] = Storage::disk('public')->url($path);
            }

            DB::commit();

            // Jalankan analisis AI (async-friendly: bisa diganti dengan Job/Queue)
            $this->runAiAnalysis($report, $photoUrls);

            return response()->json([
                'message' => 'Laporan berhasil dikirim.',
                'report'  => $report->load(['category', 'photos']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal menyimpan laporan.', 'error' => $e->getMessage()], 500);
        }
    }

    // ─── GET /reports/{id} ───────────────────────────────────────
    public function show(Request $request, Report $report): JsonResponse
    {
        $user = $request->user();

        if ($user->isWarga() && $report->user_id !== $user->id) {
            return response()->json(['message' => 'Laporan tidak ditemukan.'], 404);
        }

        return response()->json(
            $report->load(['user:id,name,phone', 'category', 'photos', 'statusHistories.changedBy:id,name,role', 'assignedTo:id,name'])
        );
    }

    // ─── PATCH /reports/{id}/status (Admin/Petugas) ──────────────
    public function updateStatus(Request $request, Report $report): JsonResponse
    {
        $user = $request->user();
        if (!$user->isAdmin() && !$user->isPetugas()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'status'      => 'required|in:diverifikasi,diproses,selesai,ditolak',
            'notes'       => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $oldStatus = $report->status;

        $report->update([
            'status'      => $data['status'],
            'assigned_to' => $data['assigned_to'] ?? $report->assigned_to,
            'admin_notes' => $data['notes'] ?? $report->admin_notes,
            'verified_at'  => $data['status'] === 'diverifikasi' ? now() : $report->verified_at,
            'completed_at' => $data['status'] === 'selesai'      ? now() : $report->completed_at,
        ]);

        // Catat riwayat status
        ReportStatusHistory::create([
            'report_id'  => $report->id,
            'changed_by' => $user->id,
            'old_status' => $oldStatus,
            'new_status' => $data['status'],
            'notes'      => $data['notes'] ?? null,
        ]);

        // Kirim notifikasi ke pelapor
        $report->user->notify(new ReportStatusUpdated($report));

        return response()->json([
            'message' => 'Status laporan diperbarui.',
            'report'  => $report->fresh(['category', 'statusHistories.changedBy:id,name']),
        ]);
    }

    // ─── POST /reports/{id}/feedback (Warga) ────────────────────
    public function submitFeedback(Request $request, Report $report): JsonResponse
    {
        $user = $request->user();

        if ($report->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($report->status !== 'selesai') {
            return response()->json(['message' => 'Feedback hanya bisa diberikan pada laporan selesai.'], 422);
        }

        $data = $request->validate([
            'rating'   => 'required|integer|between:1,5',
            'feedback' => 'nullable|string|max:500',
        ]);

        $report->update($data);

        return response()->json(['message' => 'Terima kasih atas feedback Anda!']);
    }

    // ─── POST /reports/{id}/analyze (Admin - re-trigger AI) ──────
    public function reanalyze(Request $request, Report $report): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $photoUrls = $report->photos->map(fn($p) => $p->url)->toArray();
        $this->runAiAnalysis($report, $photoUrls);

        return response()->json([
            'message' => 'Analisis AI berhasil dijalankan ulang.',
            'report'  => $report->fresh(),
        ]);
    }

    // ─── Private Helpers ─────────────────────────────────────────
    private function runAiAnalysis(Report $report, array $photoUrls): void
    {
        try {
            $result = $this->aiService->analyze($report->load('category'), $photoUrls);
            $report->update([
                'severity'       => $result['severity'],
                'severity_score' => $result['score'],
                'ai_analysis'    => $result['analysis'],
                'ai_analyzed'    => true,
            ]);
        } catch (\Exception $e) {
            \Log::warning("AI analysis failed for report #{$report->id}: " . $e->getMessage());
        }
    }
}
