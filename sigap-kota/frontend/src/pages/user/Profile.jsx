import { Link } from 'react-router-dom'
import { Share2, TrendingUp, ThumbsUp, CheckCircle, Award, Eye, Users, Medal, Bell, Mail, ChevronRight, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

const BADGES = [
  { id: 1, icon: Award,  label: 'Pionir Kota',   sub: '10 Laporan Awal', unlocked: true  },
  { id: 2, icon: Users,  label: 'Warga Aktif',   sub: 'Login 30 Hari',   unlocked: true  },
  { id: 3, icon: Eye,    label: 'Mata Elang',     sub: 'Deteksi Kerusakan', unlocked: true },
  { id: 4, icon: Medal,  label: 'Pahlawan Kota', sub: 'Locked',          unlocked: false },
]

export default function Profile() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-1 space-y-6">

        {/* ── Profile header ── */}
        <div className="card p-6 flex flex-col sm:flex-row items-start gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center">
              <User size={36} className="text-primary" />
            </div>
            <Link to="/profil/edit"
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✏</span>
            </Link>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-display font-extrabold text-gray-900">
                {user?.name ?? 'Nama Pengguna'}
              </h1>
              <span className="badge bg-primary-50 text-primary border border-primary-100">
                ✓ Relawan Terverifikasi
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Berkontribusi untuk Jakarta yang lebih baik sejak Maret 2026. Fokus pada isu infrastruktur jalan dan fasilitas umum.
            </p>
          </div>

          <button className="btn-secondary flex-shrink-0">
            <Share2 size={14} />
            Bagikan
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: TrendingUp,   value: '42',  label: 'Total Laporan',    sub: '↑ +5 bulan ini' },
            { icon: ThumbsUp,     value: '158', label: 'Dukungan Diterima', sub: 'Dari warga sekitar' },
            { icon: CheckCircle,  value: '36',  label: 'Laporan Selesai',  sub: '85% penyelesaian' },
          ].map(({ icon: Icon, value, label, sub }) => (
            <div key={label} className="card p-5">
              <Icon size={18} className="text-gray-400 mb-2" />
              <p className="text-3xl font-display font-extrabold text-gray-900">{value}</p>
              <p className="text-xs font-display font-semibold text-gray-500 mt-0.5">{label}</p>
              <p className="text-xs text-primary mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* ── Badges ── */}
          <div className="md:col-span-2 card p-6">
            <h3 className="text-base font-display font-bold text-gray-900 mb-4">Lencana Pencapaian</h3>
            <div className="grid grid-cols-4 gap-3">
              {BADGES.map(({ id, icon: Icon, label, sub, unlocked }) => (
                <div key={id} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center ${
                  unlocked ? 'bg-primary-50' : 'bg-gray-50'
                }`}>
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

          {/* ── XP card ── */}
          <div className="card p-6 bg-primary text-white">
            <h3 className="text-sm font-display font-bold mb-4">Status Kontribusi</h3>
            <div className="flex items-center justify-between text-xs mb-2">
              <span>Level 12</span>
              <span>2,450 / 3,000 XP</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '82%' }} />
            </div>
            <p className="text-xs text-white/70 mt-3 italic">
              "Tinggal 550 XP lagi untuk menjadi Pahlawan Kota."
            </p>
          </div>
        </div>

        {/* ── Account settings ── */}
        <div className="card p-6">
          <h3 className="text-base font-display font-bold text-gray-900 mb-4">Pengaturan Akun</h3>
          <div className="divide-y divide-gray-100">
            {[
              {
                title: 'Notifikasi Laporan',
                desc: 'Terima pemberitahuan saat status laporan Anda berubah (Diproses, Selesai).',
                icon: Bell,
                type: 'toggle',
                defaultOn: true,
              },
              {
                title: 'Email Mingguan',
                desc: 'Rangkuman aktivitas pembangunan dan perbaikan di wilayah Anda.',
                icon: Mail,
                type: 'toggle',
                defaultOn: false,
              },
              {
                title: 'Keamanan Akun',
                desc: 'Ubah kata sandi atau aktifkan otentikasi dua faktor.',
                icon: ChevronRight,
                type: 'link',
              },
            ].map(item => (
              <div key={item.title} className="flex items-center justify-between py-4 gap-4">
                <div className="flex-1">
                  <p className="text-sm font-display font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                {item.type === 'toggle' ? (
                  <ToggleSwitch defaultOn={item.defaultOn} />
                ) : (
                  <button className="text-xs font-display font-semibold text-primary flex items-center gap-1">
                    Kelola <ChevronRight size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button className="btn-secondary">Reset</button>
            <button className="btn-primary">Simpan Perubahan</button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}

function ToggleSwitch({ defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn(v => !v)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${on ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

// useState is used inside ToggleSwitch — need import
import { useState } from 'react'