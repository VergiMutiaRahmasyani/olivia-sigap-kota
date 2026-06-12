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
        'avatar', 'is_active', 'bio', 'xp', 'level',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'is_active'         => 'boolean',
    ];

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function assignedReports()
    {
        return $this->hasMany(Report::class, 'assigned_to');
    }

    public function isWarga(): bool      { return $this->role === 'warga'; }
    public function isPetugas(): bool    { return $this->role === 'petugas'; }
    public function isAdmin(): bool      { return in_array($this->role, ['admin', 'superadmin']); }
    public function isSuperAdmin(): bool { return $this->role === 'superadmin'; }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function votes()
    {
        return $this->hasMany(ReportVote::class);
    }

    const XP_PER_LEVEL   = 500;
    const XP_BUAT        = 10;
    const XP_SELESAI     = 25;
    const XP_VOTE        = 2;

    public function addXp(int $amount): void
    {
        $this->xp   += $amount;
        $this->level = (int) floor($this->xp / self::XP_PER_LEVEL) + 1;
        $this->save();
    }

    public function xpToNextLevel(): int
    {
        return (self::XP_PER_LEVEL * $this->level) - $this->xp;
    }

    public function xpProgress(): int 
    {
        $start = self::XP_PER_LEVEL * ($this->level - 1);
        $end   = self::XP_PER_LEVEL * $this->level;
        return (int) round((($this->xp - $start) / ($end - $start)) * 100);
    }
}