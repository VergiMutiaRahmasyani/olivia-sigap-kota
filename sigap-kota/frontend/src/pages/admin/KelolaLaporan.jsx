import { useState } from 'react'
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useNavigate } from 'react-router-dom'

const REPORTS = [
  { id: '#REP-8821', score: 9.8, level: 'kritis',  title: 'Kebocoran Pipa Utama',   loc: 'Jl. Sudirman No. 45',  time: '2 menit yang lalu',   status: 'terdeteksi' },
  { id: '#REP-8819', score: 7.5, level: 'tinggi',  title: 'Tiang Listrik Miring',    loc: 'Blok M Square',        time: '15 menit yang lalu',  status: 'proses'     },
  { id: '#REP-8815', score: 4.2, level: 'sedang',  title: 'Lubang Jalan Kecil',      loc: 'Jl. Gatot Subroto',   time: '1 jam yang lalu',     status: 'antrean'    },
  { id: '#REP-8801', score: 2.1, level: 'rendah',  title: 'Lampu Taman Mati',        loc: 'Taman Suropati',       time: '3 jam yang lalu',     status: 'selesai'    },
]

const SCORE_STYLE = {
  kritis: { bar: 'bg-red-500',    text: 'text-red-500',    label: 'text-red-400'    },
  tinggi: { bar: 'bg-orange-500', text: 'text-orange-500', label: 'text-orange-400' },
  sedang: { bar: 'bg-yellow-500', text: 'text-yellow-600', label: 'text-yellow-500' },
  rendah: { bar: 'bg-gray-300',   text: 'text-gray-400',   label: 'text-gray-300'   },
}

const STATUS_STYLE = {
  terdeteksi: 'bg-red-50 text-red-600',
  proses:     'bg-primary-50 text-primary',
  antrean:    'bg-gray-100 text-gray-500',
  selesai:    'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200',
}
const STATUS_TEXT = {
  terdeteksi: 'TERDETEKSI',
  proses:     'PROSES',
  antrean:    'ANTREAN',
  selesai:    'SELESAI',
}

export default function KeloleLaporan() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = REPORTS.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.loc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6 page-enter">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-gray-900">Kelola Laporan</h1>
            <p className="text-sm text-gray-500 mt-1">Panel administrasi untuk pemantauan dan tindak lanjut laporan warga.</p>
          </div>
          <div className="flex gap-3">
            <div className="card px-5 py-3 text-right">
              <p className="text-xs text-gray-400 font-display font-semibold">Total Laporan</p>
              <p className="text-2xl font-display font-extrabold text-primary flex items-center gap-1 justify-end">
                1,284
              </p>
            </div>
            <div className="card px-5 py-3 text-right">
              <p className="text-xs text-gray-400 font-display font-semibold">Urgensi Tinggi</p>
              <p className="text-2xl font-display font-extrabold text-red-500 flex items-center gap-1 justify-end">
                12
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="card p-3 flex gap-3 items-center">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari ID, kategori, atau lokasi..."
              className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-display font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <LayoutGrid size={15} /> Semua Kategori
          </button>
          <button className="flex items-center gap-2 text-sm font-display font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <ArrowUpDown size={15} /> Urutkan: Urgensi Tertinggi
          </button>
          <button className="flex items-center gap-2 text-sm font-display font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <SlidersHorizontal size={15} /> Filter Lanjut
          </button>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Skor Urgensi AI', 'ID & Kategori', 'Lokasi & Waktu', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-display font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => {
                  const s = SCORE_STYLE[r.level]
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/laporan/${r.id.replace('#', '')}`)}
                    >
                      {/* Score */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-1 h-9 rounded-full ${s.bar}`} />
                          <div>
                            <p className={`text-base font-display font-extrabold ${s.text}`}>{r.score}/10</p>
                            <p className={`text-[10px] font-display font-bold uppercase tracking-widest ${s.label}`}>{r.level}</p>
                          </div>
                        </div>
                      </td>
                      {/* ID & Title */}
                      <td className="px-5 py-4">
                        <p className="font-display font-bold text-gray-800">{r.id}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{r.title}</p>
                      </td>
                      {/* Lokasi */}
                      <td className="px-5 py-4">
                        <p className="font-display font-semibold text-gray-700">{r.loc}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{r.time}</p>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-block text-[11px] font-display font-bold tracking-wider px-2.5 py-1 rounded-full ${STATUS_STYLE[r.status]}`}>
                          {STATUS_TEXT[r.status]}
                        </span>
                      </td>
                      {/* Aksi */}
                      <td className="px-5 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        {r.status === 'selesai' ? (
                          <button className="text-xs font-display font-semibold border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                            Arsip
                          </button>
                        ) : (
                          <button
                            className="text-xs font-display font-semibold bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary/90 transition-colors"
                            onClick={() => navigate(`/admin/laporan/${r.id.replace('#', '')}`)}
                          >
                            Detail
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-display">Menampilkan 1–10 dari 1,284 laporan</p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft size={14} />
              </button>
              {[1, 2, 3].map(p => (
                <button
                  key={p}
                  className={`w-8 h-8 rounded-lg text-xs font-display font-bold transition-colors ${
                    p === 1 ? 'bg-primary text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}