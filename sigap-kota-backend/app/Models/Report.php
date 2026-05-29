<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'report_number', 'user_id', 'category_id', 'assigned_to',
        'title', 'description', 'location_address',
        'kelurahan', 'kecamatan', 'latitude', 'longitude',
        'status', 'severity', 'severity_score', 'ai_analysis', 'ai_analyzed',
        'rating', 'feedback', 'admin_notes',
        'verified_at', 'completed_at',
    ];

    protected $casts = [
        'latitude'       => 'decimal:8',
        'longitude'      => 'decimal:8',
        'severity_score' => 'decimal:2',
        'ai_analyzed'    => 'boolean',
        'verified_at'    => 'datetime',
        'completed_at'   => 'datetime',
    ];

    // ─── Relationships ───────────────────────────────────────────
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function photos()
    {
        return $this->hasMany(ReportPhoto::class);
    }

    public function primaryPhoto()
    {
        return $this->hasOne(ReportPhoto::class)->where('is_primary', true);
    }

    public function statusHistories()
    {
        return $this->hasMany(ReportStatusHistory::class)->latest();
    }

    // ─── Scopes ──────────────────────────────────────────────────
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeBySeverity($query, string $severity)
    {
        return $query->where('severity', $severity);
    }

    public function scopeForWarga($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ─── Accessors ───────────────────────────────────────────────
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'menunggu'     => 'Menunggu',
            'diverifikasi' => 'Diverifikasi',
            'diproses'     => 'Sedang Diproses',
            'selesai'      => 'Selesai',
            'ditolak'      => 'Ditolak',
            default        => ucfirst($this->status),
        };
    }

    public function getSeverityLabelAttribute(): string
    {
        return match($this->severity) {
            'parah'  => '🔴 Parah',
            'sedang' => '🟡 Sedang',
            'ringan' => '🟢 Ringan',
            default  => '-',
        };
    }

    // ─── Helpers ─────────────────────────────────────────────────
    public static function generateReportNumber(): string
    {
        $year  = now()->format('Y');
        $count = self::whereYear('created_at', $year)->count() + 1;
        return 'SGK-' . $year . '-' . str_pad($count, 6, '0', STR_PAD_LEFT);
    }
}
