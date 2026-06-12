<?php

namespace App\Jobs;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AnalyzeReportImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Report $report) {}

    public function handle(): void
    {
        $photo = $this->report->photos()->first();
        if (!$photo) return;

        $path = storage_path('app/public/' . $photo->path);

        try {
            $response = Http::timeout(30)->attach(
                'image', file_get_contents($path), basename($path)
            )->post('http://127.0.0.1:5000/predict');

            if ($response->successful()) {
                $data = $response->json();
                $this->report->update([
                    'severity'       => $data['severity'],
                    'severity_score' => $data['score'],
                    'ai_analyzed'    => true,
                ]);
            }
        } catch (\Exception $e) {
            Log::error("AI Job Error: " . $e->getMessage());
        }
    }
}