import { useState } from 'react'
import { Brain, Clock, MapPin, Download, ZoomIn, ZoomOut, Crosshair, Search } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import MapSurabaya from '../../components/common/MapSurabaya'

const NAV = [
  { to: '/admin/peta',     label: 'Peta Laporan'    },
  { to: '/admin/laporan',  label: 'Kelola Laporan'  },
  { to: '/admin/instansi', label: 'Kelola Instansi' },
]

const WILAYAH = [
  {
    id: 1,
    nama: 'Tanah Abang - Sektor 4',
    skor: 98,
    level: 'kritis',
    desc: 'Kepadatan lalu lintas ekstrem terdeteksi bersamaan dengan kerusakan drainase primer.',
    waktu: 'Baru saja',
    jarak: '0.4 km',
  },
  {
    id: 2,
    nama: 'Sudirman Center',
    skor: 72,
    level: 'tinggi',
    desc: 'Laporan kerusakan trotoar berulang di 5 titik dalam radius 200m.',
    waktu: '15 menit lalu',
    jarak: '1.2 km',
  },
  {
    id: 3,
    nama: 'Pluit Timur',
    skor: 45,
    level: 'sedang',
    desc: 'Pemeliharaan rutin lampu jalan terdeteksi melewati jadwal 3 hari.',
    waktu: '2 jam lalu',
    jarak: '4.8 km',
  },
]

const LEVEL_CONFIG = {
  kritis: {
    bg: 'bg-red-50', border: 'border-l-red-500', badge: 'bg-red-100 text-red-700',
    zone: 'rgba(239,68,68,0.15)', zoneBorder: 'rgba(239,68,68,0.5)',
  },
  tinggi: {
    bg: 'bg-amber-50', border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-700',
    zone: 'rgba(245,158,11,0.12)', zoneBorder: 'rgba(245,158,11,0.5)',
  },
  sedang: {
    bg: 'bg-yellow-50', border: 'border-l-yellow-400', badge: 'bg-yellow-100 text-yellow-700',
    zone: 'rgba(234,179,8,0.1)', zoneBorder: 'rgba(234,179,8,0.45)',
  },
}

const ZONES = [
  { level: 'kritis', top: '18%', left: '36%', width: '32%', height: '38%' },
  { level: 'tinggi', top: '25%', left: '10%', width: '22%', height: '28%' },
  { level: 'sedang', top: '38%', left: '62%', width: '26%', height: '34%' },
]

export default function PetaLaporan() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = WILAYAH.filter(w =>
    w.nama.toLowerCase().includes(search.toLowerCase())
  )

  const linkClass = ({ isActive }) =>
    `text-sm font-display font-semibold px-1 py-0.5 transition-colors relative ${
      isActive
        ? 'text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-full'
        : 'text-gray-600 hover:text-gray-900'
    }`

  return (
    <div className="h-screen flex flex-col bg-[#F5F0E8] overflow-hidden">

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          <span className="text-lg font-display font-extrabold text-primary tracking-tight">SIGAP KOTA</span>
          <nav className="flex items-center gap-8">
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>{label}</NavLink>
            ))}
          </nav>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-bold bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* ── Body: sidebar + map ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Sidebar ── */}
        <aside className="w-80 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden">

          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-lg font-display font-extrabold text-gray-900">Peta Urgensi AI</h1>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain size={16} className="text-primary" />
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Analisis waktu nyata berbasis kecerdasan buatan untuk prioritas penanganan wilayah.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 border-b border-gray-100">
            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
              <p className="text-[10px] font-display font-extrabold text-red-500 uppercase tracking-wider mb-1">Sangat Kritis</p>
              <p className="text-3xl font-display font-extrabold text-red-600">12</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <p className="text-[10px] font-display font-extrabold text-emerald-600 uppercase tracking-wider mb-1">Stabil</p>
              <p className="text-3xl font-display font-extrabold text-emerald-600">84%</p>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari wilayah…"
                className="flex-1 bg-transparent text-sm font-display outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map(w => {
              const cfg = LEVEL_CONFIG[w.level]
              const isActive = selected?.id === w.id
              return (
                <button
                  key={w.id}
                  onClick={() => setSelected(isActive ? null : w)}
                  className={`w-full text-left border-l-4 px-4 py-4 transition-all ${cfg.border} ${isActive ? cfg.bg : 'hover:bg-gray-50'} border-b border-gray-100`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-display font-bold text-sm text-gray-900 leading-tight">{w.nama}</p>
                    <span className={`text-xs font-display font-extrabold px-2 py-0.5 rounded-lg flex-shrink-0 ${cfg.badge}`}>
                      {w.skor}/100
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-2">{w.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={10} /> {w.waktu}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {w.jarak}</span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="p-4 border-t border-gray-100">
            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-display font-bold text-sm py-3 rounded-xl transition-colors">
              <Download size={15} /> Export Laporan Prioritas
            </button>
          </div>
        </aside>

        {/* ── Map Area ── */}
        <div className="flex-1 relative overflow-hidden">

          {/* Peta Leaflet */}
          <MapSurabaya />

          {/* Indikator Urgensi — kanan atas */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-xl shadow-lg p-4 w-56 z-[1000]">
            <p className="text-xs font-display font-extrabold text-gray-700 mb-3">Indikator Urgensi</p>
            <div className="space-y-2">
              {[
                { dot: 'bg-red-500',    label: 'Kritis (Tindakan Segera)' },
                { dot: 'bg-amber-500',  label: 'Tinggi (Pantauan Ketat)'  },
                { dot: 'bg-yellow-400', label: 'Sedang (Terjadwal)'       },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${item.dot}`} />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-display font-semibold">AI Model v4.2</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 font-display font-extrabold px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>
          </div>

          {/* Zona urgensi overlay — di atas peta */}
          {ZONES.map((z, i) => {
            const cfg = LEVEL_CONFIG[z.level]
            return (
              <div key={i} className="absolute rounded-lg pointer-events-none z-[500]"
                style={{ top: z.top, left: z.left, width: z.width, height: z.height, background: cfg.zone, border: `2px solid ${cfg.zoneBorder}` }}
              />
            )
          })}

          {/* Detail card saat wilayah dipilih */}
          {selected && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-4 w-72 border border-gray-100 z-[1000]">
              <div className="flex items-start justify-between mb-2">
                <p className="font-display font-extrabold text-gray-900 text-sm">{selected.nama}</p>
                <span className={`text-xs font-display font-extrabold px-2 py-0.5 rounded-lg ${LEVEL_CONFIG[selected.level].badge}`}>
                  {selected.skor}/100
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{selected.desc}</p>
              <div className="flex gap-2">
                <button className="flex-1 text-xs font-display font-bold bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Tindak Lanjuti
                </button>
                <button onClick={() => setSelected(null)}
                  className="flex-1 text-xs font-display font-semibold border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Tutup
                </button>
              </div>
            </div>
          )}

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[1000]">
            {[
              { icon: <ZoomIn size={16} />,    cls: 'bg-white text-gray-700' },
              { icon: <ZoomOut size={16} />,   cls: 'bg-white text-gray-700' },
              { icon: <Crosshair size={16} />, cls: 'bg-primary text-white'  },
            ].map((z, i) => (
              <button key={i} className={`w-9 h-9 rounded-xl shadow flex items-center justify-center hover:opacity-90 transition-opacity ${z.cls}`}>
                {z.icon}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
