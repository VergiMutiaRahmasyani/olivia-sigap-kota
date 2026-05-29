import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Minus, Navigation, ChevronDown, ChevronUp } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

const MOCK_REPORTS = [
  {
    id: 1, status: 'kritikal', title: 'Lubang Jalan Besar (Jalur TransJ)',
    desc: 'Lubang sedalam 15cm di Jl. Gatot Subroto arah Semanggi membahayakan pengendara motor.',
    location: 'Jakarta Selatan', distance: '0.8 km', time: '2 jam yang lalu',
  },
  {
    id: 2, status: 'divalidasi', title: 'Saluran Air Tersumbat',
    desc: 'Penumpukan sampah di gorong-gorong menyebabkan genangan saat hujan sedang.',
    location: 'Jakarta Timur', distance: '3.2 km', time: '1 hari yang lalu',
  },
  {
    id: 3, status: 'proses', title: 'Penerangan Jalan Mati',
    desc: 'Sepanjang 50 meter area taman tidak memiliki penerangan aktif di malam hari.',
    location: 'Jakarta Pusat', distance: '1.5 km', time: '5 jam yang lalu',
  },
]

const STATUS_LABEL = {
  kritikal:   { label: 'Kritikal',        class: 'badge-kritikal'   },
  divalidasi: { label: 'Divalidasi',      class: 'badge-divalidasi' },
  proses:     { label: 'Sedang Diproses', class: 'badge-proses'     },
  selesai:    { label: 'Selesai',         class: 'badge-selesai'    },
}

const CATEGORIES = ['Semua', 'Jalan Rusak', 'Drainase', 'Lampu Jalan']

function ReportCard({ report }) {
  const s = STATUS_LABEL[report.status]
  return (
    <Link to={`/laporan/${report.id}`} className="block card-hover p-4 border-l-4 border-l-transparent hover:border-l-primary">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`badge ${s.class}`}>{s.label}</span>
        <span className="text-xs text-gray-400 flex-shrink-0">{report.time}</span>
      </div>
      <h4 className="text-sm font-bold text-gray-800 mb-1">{report.title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{report.desc}</p>
      <p className="text-xs text-primary font-semibold mt-2 flex items-center gap-1">
        📍 {report.location} · {report.distance}
      </p>
    </Link>
  )
}

export default function PetaLaporan() {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = MOCK_REPORTS.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                        r.location.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Main layout ── */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>

        {/* ── Mobile toggle button ── */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700">Daftar Laporan</span>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            {sidebarOpen ? <><ChevronUp size={14} /> Sembunyikan</> : <><ChevronDown size={14} /> Tampilkan</>}
          </button>
        </div>

        {/* ── Sidebar ── */}
        <aside className={`
          bg-white border-r border-gray-100 flex flex-col overflow-hidden
          md:w-80 md:flex-shrink-0
          ${sidebarOpen ? 'h-[60vh]' : 'h-0 overflow-hidden'}
          md:h-auto
          transition-all duration-300
        `}>
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-extrabold text-gray-900">Visualisasi Infrastruktur</h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Peta publik real-time untuk memantau status perbaikan infrastruktur kota.
            </p>

            {/* Search */}
            <div className="relative mt-3">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari lokasi atau jenis kendala..."
                className="input-field pl-9 text-xs"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Urgency bar */}
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">Tingkat Urgensi</p>
              <div className="h-2 rounded-full bg-gradient-to-r from-primary-300 via-yellow-300 to-red-500" />
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    activeCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stat mini bar */}
          <div className="flex border-b border-gray-100 divide-x divide-gray-100">
            <div className="flex-1 p-3 text-center">
              <p className="text-lg font-extrabold text-primary">1,284</p>
              <p className="text-xs text-gray-400">Laporan Aktif</p>
            </div>
            <div className="flex-1 p-3 text-center">
              <p className="text-lg font-extrabold text-primary">42</p>
              <p className="text-xs text-gray-400">Selesai (24j)</p>
            </div>
          </div>

          {/* Report list */}
          <div className="flex-1 overflow-y-auto custom-scroll p-3 space-y-2">
            {filtered.map(r => <ReportCard key={r.id} report={r} />)}
          </div>
        </aside>

        {/* ── Map area ── */}
        <div className="flex-1 relative bg-gray-800 min-h-[300px]">
          {/* Placeholder map */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapIcon className="mx-auto mb-2 opacity-30" size={48} />
              <p className="text-sm">Integrasikan Leaflet atau Mapbox di sini</p>
              <p className="text-xs mt-1 opacity-60">npm install leaflet react-leaflet</p>
            </div>
          </div>

          {/* Map controls */}
          <div className="absolute bottom-6 right-4 flex flex-col gap-1">
            <button className="w-9 h-9 bg-white rounded-xl shadow flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Plus size={16} className="text-gray-600" />
            </button>
            <button className="w-9 h-9 bg-white rounded-xl shadow flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Minus size={16} className="text-gray-600" />
            </button>
            <button className="w-9 h-9 bg-primary rounded-xl shadow flex items-center justify-center hover:bg-primary-600 transition-colors">
              <Navigation size={16} className="text-white" />
            </button>
          </div>

          {/* Stat overlay */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl px-4 py-2.5 shadow border border-gray-100">
            <div className="flex items-center gap-3 text-xs">
              <div>
                <p className="text-gray-400">Laporan Aktif</p>
                <p className="font-extrabold text-primary text-base">1,284</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-gray-400">Selesai (24j)</p>
                <p className="font-extrabold text-primary text-base">42</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}

function MapIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}