<?php

namespace App\Notifications;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReportStatusUpdated extends Notification
{
    use Queueable;

    public function __construct(private Report $report) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'report_id'     => $this->report->id,
            'report_number' => $this->report->report_number,
            'title'         => $this->report->title,
            'new_status'    => $this->report->status,
            'status_label'  => $this->report->status_label,
            'message'       => "Laporan #{$this->report->report_number} Anda diperbarui menjadi: {$this->report->status_label}.",
        ];
    }
}
