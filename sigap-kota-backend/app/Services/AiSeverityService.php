<?php

namespace App\Services;

use App\Models\Report;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiSeverityService
{
    private string $apiKey;
    private string $model = 'claude-sonnet-4-20250514';
    private string $apiUrl = 'https://api.anthropic.com/v1/messages';

    public function __construct()
    {
        $this->apiKey = config('services.anthropic.api_key');
    }

    /**
     * Analyze report severity using Claude AI.
     * Returns array: ['severity' => 'parah|sedang|ringan', 'score' => 0-100, 'analysis' => '...']
     */
    public function analyze(Report $report, array $photoUrls = []): array
    {
        $prompt = $this->buildPrompt($report, $photoUrls);

        try {
            $response = Http::withHeaders([
                'x-api-key'         => $this->apiKey,
                'anthropic-version' => '2023-06-01',
                'Content-Type'      => 'application/json',
            ])->post($this->apiUrl, [
                'model'      => $this->model,
                'max_tokens' => 1024,
                'messages'   => [
                    ['role' => 'user', 'content' => $prompt],
                ],
                'system' => $this->getSystemPrompt(),
            ]);

            if ($response->failed()) {
                Log::error('AI Analysis failed', ['status' => $response->status(), 'body' => $response->body()]);
                return $this->defaultResult();
            }

            $content = $response->json('content.0.text', '');
            return $this->parseResponse($content);

        } catch (\Exception $e) {
            Log::error('AI Service exception', ['error' => $e->getMessage()]);
            return $this->defaultResult();
        }
    }

    private function getSystemPrompt(): string
    {
        return <<<PROMPT
Kamu adalah sistem AI untuk menganalisis laporan kerusakan infrastruktur kota.
Tugasmu adalah menilai tingkat keparahan kerusakan berdasarkan deskripsi yang diberikan.

KRITERIA PENILAIAN:
- PARAH (skor 70-100): Membahayakan keselamatan jiwa, menghalangi akses vital, membutuhkan penanganan SEGERA.
  Contoh: jalan berlubang besar di tengah jalan utama, tiang listrik roboh, jembatan retak parah.
- SEDANG (skor 35-69): Mengganggu aktivitas warga tapi tidak langsung berbahaya, perlu ditangani dalam beberapa hari.
  Contoh: lampu jalan mati, saluran air tersumbat sebagian, trotoar rusak.
- RINGAN (skor 0-34): Kerusakan kecil, tidak mengganggu fungsi utama, bisa dijadwalkan.
  Contoh: cat marka jalan pudar, pot bunga rusak, papan nama rusak.

Balas HANYA dalam format JSON berikut, tanpa teks lain:
{
  "severity": "parah|sedang|ringan",
  "score": <angka 0-100>,
  "analysis": "<penjelasan singkat 2-3 kalimat dalam Bahasa Indonesia mengapa tingkat keparahan ini>"
}
PROMPT;
    }

    private function buildPrompt(Report $report, array $photoUrls): string
    {
        $prompt = "Analisis laporan kerusakan infrastruktur berikut:\n\n";
        $prompt .= "**Judul:** {$report->title}\n";
        $prompt .= "**Kategori:** {$report->category->name}\n";
        $prompt .= "**Lokasi:** {$report->location_address}";

        if ($report->kecamatan) {
            $prompt .= ", Kec. {$report->kecamatan}";
        }

        $prompt .= "\n**Deskripsi:** {$report->description}\n";

        if (!empty($photoUrls)) {
            $prompt .= "\n(Laporan ini disertai " . count($photoUrls) . " foto dokumentasi kerusakan)";
        }

        return $prompt;
    }

    private function parseResponse(string $content): array
    {
        // Strip markdown code fences if present
        $content = preg_replace('/```json|```/', '', $content);
        $content = trim($content);

        $data = json_decode($content, true);

        if (!$data || !isset($data['severity'])) {
            return $this->defaultResult();
        }

        // Validate severity value
        $validSeverities = ['parah', 'sedang', 'ringan'];
        if (!in_array($data['severity'], $validSeverities)) {
            return $this->defaultResult();
        }

        return [
            'severity' => $data['severity'],
            'score'    => min(100, max(0, (float) ($data['score'] ?? 50))),
            'analysis' => $data['analysis'] ?? 'Analisis tidak tersedia.',
        ];
    }

    private function defaultResult(): array
    {
        return [
            'severity' => 'sedang',
            'score'    => 50.0,
            'analysis' => 'Analisis AI tidak dapat dilakukan saat ini. Mohon petugas melakukan penilaian manual.',
        ];
    }
}
