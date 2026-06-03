// pages/admin/KelolaLaporan.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, BarChart2, AlertCircle } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'

// ── Dummy data ──────────────────────────────────────────────────────────────
const REPORTS = [
  {
    id: 'REP-8821',
    score: 9.8,
    level: 'kritis',
    category: 'Kebocoran Pipa Utama',
    location: 'Jl. Sudirman No. 45',
    time: '2 menit yang lalu',
    status: 'terdeteksi',
  },
  {
    id: 'REP-8819',
    score: 7.5,
    level: 'tinggi',
    category: 'Tiang Listrik Miring',
    location: 'Blok M Square',
    time: '15 menit yang lalu',
    status: 'proses',
  },
  {
    id: 'REP-8815',
    score: 4.2,
    level: 'sedang',
    category: 'Lubang Jalan Kecil',
    location: 'Jl. Gatot Subroto',
    time: '1 jam yang lalu',
    status: 'antrean',
  },
  {
    id: 'REP-8801',
    score: 2.1,
    level: 'rendah',
    category: 'Lampu Taman Mati',
    location: 'Taman Suropati',
    time: '3 jam yang lalu',
    status: 'selesai',
  },
]

const LEVEL_COLOR = {
  kritis: 'text-red-500',
  tinggi: 'text-orange-500',
  sedang: 'text-green-500',
  rendah: 'text-gray-400',
}

const LEVEL_BAR = {
  kritis: 'bg-red-500',
  tinggi: 'bg-orange-400',
  sedang: 'bg-green-500',
  rendah: 'bg-gray-300',
}

const STATUS_STYLE = {
  terdeteksi: 'bg-red-100 text-red-600',
  proses:     'bg-orange-100 text-orange-600',
  antrean:    'bg-gray-100 text-gray-600',
  selesai:    'bg-green-100 text-green-700',
}

const STATUS_LABEL = {
  terdeteksi: 'TERDETEKSI',
  proses:     'PROSES',
  antrean:    'ANTREAN',
  selesai:    'SELESAI',
}

function ScoreBar({ level }) {
  return (
    <div className="w-1 h-10 rounded-full bg-gray-100 overflow-hidden self-center">
      <div className={`w-full rounded-full ${LEVEL_BAR[level]}`}
        style={{ height: level === 'kritis' ? '100%' : level === 'tinggi' ? '75%' : level === 'sedang' ? '45%' : '22%' }}
      />
    </div>
  )
}

export default function KelolaLaporan() {
  const navigate = useNavigate()
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('Semua Kategori')
  const [sort, setSort]         = useState('Urgensi Tertinggi')
  const [page, setPage]         = useState(1)

  const filtered = REPORTS.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase()) ||
    r.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header row */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-gray-900">Kelola Laporan</h1>
            <p className="text-sm text-gray-500 mt-1">Panel administrasi untuk pemantauan dan tindak lanjut laporan warga.</p>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex items-center gap-3 min-w-[140px]">
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                <BarChart2 size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-display font-semibold">Total Laporan</p>
                <p className="text-2xl font-display font-extrabold text-gray-900 leading-tight">1,284</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex items-center gap-3 min-w-[130px]">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle size={16} className="text-red-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-display font-semibold">Urgensi Tinggi</p>
                <p className="text-2xl font-display font-extrabold text-red-500 leading-tight">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari ID, kategori, atau lokasi..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm font-display outline-none focus:border-primary transition-colors bg-gray-50"
            />
          </div>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-display font-semibold text-gray-700 bg-white outline-none focus:border-primary transition-colors cursor-pointer"
          >
            {['Semua Kategori', 'Jalan Rusak', 'Kebocoran', 'Listrik', 'Taman'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-display font-semibold text-gray-700 bg-white outline-none focus:border-primary transition-colors cursor-pointer"
          >
            {['Urutkan: Urgensi Tertinggi', 'Urutkan: Terbaru', 'Urutkan: Terlama'].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm font-display font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal size={15} /> Filter Lanjut
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[180px_1fr_1fr_130px_100px] gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50">
            {['SKOR URGENSI AI', 'ID & KATEGORI', 'LOKASI & WAKTU', 'STATUS', 'AKSI'].map(h => (
              <p key={h} className="text-[10px] font-display font-extrabold text-gray-400 uppercase tracking-widest">
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((r, i) => (
            <div
              key={r.id}
              className={`grid grid-cols-[180px_1fr_1fr_130px_100px] gap-4 px-6 py-4 items-center ${
                i < filtered.length - 1 ? 'border-b border-gray-100' : ''
              } hover:bg-gray-50/50 transition-colors`}
            >
              {/* Score */}
              <div className="flex items-center gap-3">
                <ScoreBar level={r.level} />
                <div>
                  <p className={`text-lg font-display font-extrabold leading-none ${LEVEL_COLOR[r.level]}`}>
                    {r.score}<span className="text-xs text-gray-400 font-normal">/10</span>
                  </p>
                  <p className={`text-[10px] font-display font-bold uppercase tracking-wider mt-0.5 ${LEVEL_COLOR[r.level]}`}>
                    {r.level.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* ID & Category */}
              <div>
                <p className="text-sm font-display font-bold text-gray-900">#{r.id}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.category}</p>
              </div>

              {/* Location & time */}
              <div>
                <p className="text-sm font-display font-semibold text-gray-800">{r.location}</p>
                <p className="text-xs text-gray-400 mt-0.5">{r.time}</p>
              </div>

              {/* Status */}
              <div>
                <span className={`text-[10px] font-display font-extrabold px-2.5 py-1 rounded-full tracking-wider ${STATUS_STYLE[r.status]}`}>
                  {STATUS_LABEL[r.status]}
                </span>
              </div>

              {/* Action */}
              <div>
                {r.status === 'selesai' ? (
                  <button
                    onClick={() => navigate(`/admin/laporan/${r.id}`)}
                    className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm font-display font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Arsip
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/admin/laporan/${r.id}`)}
                    className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-display font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Detail
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-display">Menampilkan 1-10 dari 1,284 laporan</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-400"
              >
                <ChevronLeft size={14} />
              </button>
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-display font-bold transition-colors ${
                    page === n
                      ? 'bg-primary text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(3, p + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-400"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}