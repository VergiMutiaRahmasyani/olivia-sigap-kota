<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'phone', 'nik', 'address',
        'kelurahan', 'kecamatan', 'role', 'password',
        'avatar', 'is_active',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'is_active'         => 'boolean',
    ];

    // ─── Relationships ───────────────────────────────────────────
    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function assignedReports()
    {
        return $this->hasMany(Report::class, 'assigned_to');
    }

    // ─── Role Helpers ────────────────────────────────────────────
    public function isWarga(): bool    { return $this->role === 'warga'; }
    public function isPetugas(): bool  { return $this->role === 'petugas'; }
    public function isAdmin(): bool    { return in_array($this->role, ['admin', 'superadmin']); }
    public function isSuperAdmin(): bool { return $this->role === 'superadmin'; }

    // ─── Scopes ──────────────────────────────────────────────────
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
