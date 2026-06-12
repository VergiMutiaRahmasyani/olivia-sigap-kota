<?php

// app/Models/Instansi.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Instansi extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'jenis',
        'kota',
        'alamat',
        'email',
        'password',
        'penanggung_jawab',
        'no_hp',
        'whatsapp',
        'kategori_jalan_rusak',
        'kategori_bencana',
        'kategori_lalu_lintas',
        'radius',
        'jam_operasional',
        'aktif',
        'ai_routing',
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'kategori_jalan_rusak' => 'boolean',
        'kategori_bencana'     => 'boolean',
        'kategori_lalu_lintas' => 'boolean',
        'aktif'                => 'boolean',
        'ai_routing'           => 'boolean',
        'radius'               => 'integer',
    ];

    // Helper: ambil label jenis + kategori untuk frontend
    public function getKategoriLabelAttribute(): string
    {
        return match ($this->jenis) {
            'PUPR'      => 'Infrastruktur & Jalan',
            'BPBD'      => 'Bencana & Darurat',
            'Dishub'    => 'Lalu Lintas & Parkir',
            'Polisi'    => 'Keamanan & Ketertiban',
            'Kesehatan' => 'Layanan Kesehatan',
            default     => 'Lainnya',
        };
    }
}