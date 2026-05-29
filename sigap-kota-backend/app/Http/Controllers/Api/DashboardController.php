<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isWarga()) {
            return $this->wargaStats($user->id);
        }

        return $this->adminStats();
    }

    private function adminStats(): JsonResponse
    {
        // Ringkasan status
        $byStatus = Report::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        // Ringkasan severity
        $bySeverity = Report::whereNotNull('severity')
            ->select('severity', DB::raw('count(*) as total'))
            ->groupBy('severity')
            ->pluck('total', 'severity');

        // Laporan per kecamatan
        $byKecamatan = Report::whereNotNull('kecamatan')
            ->select('kecamatan', DB::raw('count(*) as total'))
            ->groupBy('kecamatan')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        // Tren 30 hari terakhir
        $dailyTrend = Report::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as total')
            )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Laporan terbaru & parah
        $urgentReports = Report::with(['category', 'primaryPhoto'])
            ->where('severity', 'parah')
            ->whereIn('status', ['menunggu', 'diverifikasi'])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'summary' => [
                'total'         => Report::count(),
                'menunggu'      => $byStatus->get('menunggu', 0),
                'diproses'      => $byStatus->get('diproses', 0),
                'selesai'       => $byStatus->get('selesai', 0),
                'parah'         => $bySeverity->get('parah', 0),
                'total_warga'   => User::where('role', 'warga')->count(),
                'total_petugas' => User::where('role', 'petugas')->count(),
            ],
            'by_status'      => $byStatus,
            'by_severity'    => $bySeverity,
            'by_kecamatan'   => $byKecamatan,
            'daily_trend'    => $dailyTrend,
            'urgent_reports' => $urgentReports,
        ]);
    }

    private function wargaStats(int $userId): JsonResponse
    {
        $reports = Report::forWarga($userId);

        return response()->json([
            'summary' => [
                'total'    => $reports->count(),
                'menunggu' => (clone $reports)->byStatus('menunggu')->count(),
                'diproses' => (clone $reports)->byStatus('diproses')->count(),
                'selesai'  => (clone $reports)->byStatus('selesai')->count(),
                'ditolak'  => (clone $reports)->byStatus('ditolak')->count(),
            ],
            'recent_reports' => Report::forWarga($userId)
                ->with(['category', 'primaryPhoto'])
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
