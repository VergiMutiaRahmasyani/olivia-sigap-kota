import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Share2, TrendingUp, ThumbsUp, CheckCircle,
  Award, Eye, Users, Medal, ChevronRight,
  User, MapPin, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

const BADGE_DEFS = [
  { id: 1, icon: Award,  label: 'Pionir Kota',   sub: '10 Laporan Awal',   check: (u) => (u?.total_reports  ?? 0) >= 10 },
  { id: 2, icon: Users,  label: 'Warga Aktif',   sub: 'Login 30 Hari',     check: (u) => (u?.login_days     ?? 0) >= 30 },
  { id: 3, icon: Eye,    label: 'Mata Elang',     sub: 'Deteksi Kerusakan', check: (u) => (u?.total_reports  ?? 0) >= 5  },
  { id: 4, icon: Medal,  label: 'Pahlawan Kota', sub: 'Locked',            check: ()  => false                          },
]

function ToggleSwitch({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${on ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm ring-1 ring-gray-300 transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function UnsavedPopup({ onSave, onDiscard }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-display font-bold text-gray-900">Ada perubahan yang belum disimpan</h3>
          <button onClick={onDiscard} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Pengaturan notifikasi kamu berubah. Simpan sebelum meninggalkan halaman?
        </p>
        <div className="flex gap-3">
          <button onClick={onDiscard} className="btn-secondary flex-1 justify-center">Buang</button>
          <button onClick={onSave}    className="btn-primary flex-1 justify-center">Simpan</button>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const DEFAULT_SETTINGS = { notifikasi: false, emailMingguan: false }
  const [settings,   setSettings]   = useState(DEFAULT_SETTINGS)
  const [saved,      setSaved]       = useState(DEFAULT_SETTINGS)
  const [showPopup,  setShowPopup]   = useState(false)
  const [pendingNav, setPendingNav]  = useState(null)

  const isDirty = JSON.stringify(settings) !== JSON.stringify(saved)

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleReset   = () => setSettings(DEFAULT_SETTINGS)
  const handleSave    = () => {
    setSaved({ ...settings })
    setShowPopup(false)
    if (pendingNav) { navigate(pendingNav); setPendingNav(null) }
  }
  const handleDiscard = () => {
    setSettings({ ...saved })
    setShowPopup(false)
    if (pendingNav) { navigate(pendingNav); setPendingNav(null) }
  }
  const safeNavigate  = (to) => {
    if (isDirty) { setPendingNav(to); setShowPopup(true) }
    else navigate(to)
  }

  const badges = BADGE_DEFS
    .map(b => ({ ...b, unlocked: b.check(user) }))
    .sort((a, b) => b.unlocked - a.unlocked)

  // ── Data dari user context (sudah di-merge di me()) ──
  const displayName = user?.name       ?? 'Nama Pengguna'
  const kecamatan   = user?.kecamatan  ?? ''
  const kelurahan   = user?.kelurahan  ?? ''
  const bio         = user?.bio        ?? 'Belum ada bio. Edit profil untuk menambahkan.'

  const totalReports     = user?.total_reports     ?? 0
  const totalVotes       = user?.total_votes       ?? 0
  const completedReports = user?.completed_reports ?? 0
  const completionRate   = totalReports > 0
    ? Math.round((completedReports / totalReports) * 100)
    : 0

  const xp            = user?.xp            ?? 0
  const level         = user?.level         ?? 1
  const xpProgress    = user?.xp_progress   ?? 0
  const xpToNextLevel = user?.xp_to_next_level ?? 500

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-1 space-y-6">

        {/* ── Profile header ── */}
        <div className="card p-6 flex flex-col sm:flex-row items-start gap-5">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center">
              <User size={36} className="text-primary" />
            </div>
            <button
              onClick={() => safeNavigate('/profil/edit')}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
            >
              <span className="text-white text-xs">✏</span>
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-display font-extrabold text-gray-900">{displayName}</h1>
              <span className="badge bg-primary-50 text-primary border border-primary-100 text-xs">
                ✓ Relawan Terverifikasi
              </span>
            </div>

            {(kecamatan || kelurahan) && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <MapPin size={11} />
                {[kelurahan, kecamatan, 'Surabaya'].filter(Boolean).join(', ')}
              </p>
            )}

            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{bio}</p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              icon:  TrendingUp,
              value: totalReports,
              label: 'Total Laporan',
              sub:   'Laporan dibuat',
            },
            {
              icon:  ThumbsUp,
              value: totalVotes,
              label: 'Dukungan Diterima',
              sub:   'Dari warga sekitar',
            },
            {
              icon:  CheckCircle,
              value: completedReports,
              label: 'Laporan Selesai',
              sub:   `${completionRate}% penyelesaian`,
            },
          ].map(({ icon: Icon, value, label, sub }) => (
            <div key={label} className="card p-4 sm:p-5">
              <Icon size={18} className="text-gray-400 mb-2" />
              <p className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">{value}</p>
              <p className="text-xs font-display font-semibold text-gray-500 mt-0.5">{label}</p>
              <p className="text-xs text-primary mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* ── Badges ── */}
          <div className="md:col-span-2 card p-6">
            <h3 className="text-base font-display font-bold text-gray-900 mb-4">Lencana Pencapaian</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {badges.map(({ id, icon: Icon, label, sub, unlocked }) => (
                <div
                  key={id}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all ${
                    unlocked ? 'bg-primary-50 ring-1 ring-primary-100' : 'bg-gray-50 opacity-60'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    unlocked ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    <Icon size={20} className={unlocked ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <p className={`text-xs font-display font-bold ${unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── XP card — data dari API ── */}
          <div className="card p-6 bg-primary text-white">
            <h3 className="text-sm font-display font-bold mb-4">Status Kontribusi</h3>
            <div className="flex items-center justify-between text-xs mb-2">
              <span>Level {level}</span>
              <span>{xp.toLocaleString('id-ID')} XP</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-white/70 mt-3 italic">
              {xpToNextLevel > 0
                ? `Tinggal ${xpToNextLevel.toLocaleString('id-ID')} XP lagi untuk level ${level + 1}.`
                : 'Level maksimal tercapai!'}
            </p>
          </div>
        </div>

        {/* ── Account settings ── */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-display font-bold text-gray-900">Pengaturan Akun</h3>
            {isDirty && (
              <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Ada perubahan belum disimpan
              </span>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between py-4 gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-semibold text-gray-800">Notifikasi Laporan</p>
                <p className="text-xs text-gray-500 mt-0.5">Terima pemberitahuan saat status laporan Anda berubah.</p>
              </div>
              <ToggleSwitch
                on={settings.notifikasi}
                onChange={() => setSettings(s => ({ ...s, notifikasi: !s.notifikasi }))}
              />
            </div>

            <div className="flex items-center justify-between py-4 gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-semibold text-gray-800">Email Mingguan</p>
                <p className="text-xs text-gray-500 mt-0.5">Rangkuman aktivitas pembangunan di wilayah Anda.</p>
              </div>
              <ToggleSwitch
                on={settings.emailMingguan}
                onChange={() => setSettings(s => ({ ...s, emailMingguan: !s.emailMingguan }))}
              />
            </div>

            <div className="flex items-center justify-between py-4 gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-semibold text-gray-800">Keamanan Akun</p>
                <p className="text-xs text-gray-500 mt-0.5">Ubah kata sandi atau aktifkan otentikasi dua faktor.</p>
              </div>
              <button className="text-xs font-display font-semibold text-primary flex items-center gap-1 shrink-0">
                Kelola <ChevronRight size={12} />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button onClick={handleReset} className="btn-secondary">Reset</button>
            <button onClick={handleSave}  className="btn-primary" disabled={!isDirty}>
              Simpan Perubahan
            </button>
          </div>
        </div>

      </main>

      <Footer />

      {showPopup && (
        <UnsavedPopup onSave={handleSave} onDiscard={handleDiscard} />
      )}
    </div>
  )
}