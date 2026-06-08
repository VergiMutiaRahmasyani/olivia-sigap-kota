import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Minus, Navigation, ChevronDown, ChevronUp } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { reports as reportsApi } from '../../services/api'
import { useCategories } from '../../hooks/useApi'
import MapSurabaya from '../../components/common/MapSurabaya'

const STATUS_LABEL = {
  kritikal:   { label: 'Kritikal',        class: 'badge-kritikal'   },
  divalidasi: { label: 'Divalidasi',      class: 'badge-divalidasi' },
  proses:     { label: 'Sedang Diproses', class: 'badge-proses'     },
  selesai:    { label: 'Selesai',         class: 'badge-selesai'    },
  // Fallback untuk status lain dari backend
  pending:    { label: 'Menunggu',        class: 'badge-divalidasi' },
  verified:   { label: 'Divalidasi',      class: 'badge-divalidasi' },
  in_progress:{ label: 'Sedang Diproses', class: 'badge-proses'     },
  resolved:   { label: 'Selesai',         class: 'badge-selesai'    },
  critical:   { label: 'Kritikal',        class: 'badge-kritikal'   },
}

function getStatusMeta(status) {
  return STATUS_LABEL[status] ?? { label: status, class: 'badge-divalidasi' }
}

function ReportCard({ report }) {
  const s = getStatusMeta(report.status)
  // Normalisasi field — backend mungkin pakai snake_case berbeda
  const title    = report.title     ?? report.judul       ?? '(Tanpa judul)'
  const desc     = report.description ?? report.deskripsi ?? ''
  const location = report.location  ?? report.lokasi      ?? '-'
  const time     = report.created_at_human ?? report.time ?? report.created_at ?? ''

  return (
    <Link
      to={`/laporan/${report.id}`}
      className="block card-hover p-4 border-l-4 border-l-transparent hover:border-l-primary"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`badge ${s.class}`}>{s.label}</span>
        <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
      </div>
      <h4 className="text-sm font-bold text-gray-800 mb-1">{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{desc}</p>
      <p className="text-xs text-primary font-semibold mt-2 flex items-center gap-1">
        📍 {location}
      </p>
    </Link>
  )
}

function ReportCardSkeleton() {
  return (
    <div className="p-4 space-y-2 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-20 bg-gray-100 rounded-full" />
        <div className="h-4 w-16 bg-gray-100 rounded" />
      </div>
      <div className="h-4 w-3/4 bg-gray-100 rounded" />
      <div className="h-3 w-full bg-gray-100 rounded" />
      <div className="h-3 w-24 bg-gray-100 rounded" />
    </div>
  )
}

export default function PetaLaporan() {
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch]       = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reportList, setReportList]   = useState([])
  const [statsData, setStatsData]     = useState(null)
  const [loadingReports, setLoadingReports] = useState(true)
  const [errorReports, setErrorReports]     = useState(null)

  const { data: categoriesData } = useCategories()

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // Fetch reports ketika filter berubah
  useEffect(() => {
    setLoadingReports(true)
    setErrorReports(null)

    const params = {}
    if (debouncedSearch)  params.search      = debouncedSearch
    if (activeCategory)   params.category_id = activeCategory

    reportsApi.index(params)
      .then(res => {
        // Backend bisa kembalikan array langsung atau { data, meta, stats }
        const list  = Array.isArray(res) ? res : (res?.data ?? [])
        const stats = res?.stats ?? res?.meta ?? null
        setReportList(list)
        setStatsData(stats)
      })
      .catch(err => setErrorReports(err.message))
      .finally(() => setLoadingReports(false))
  }, [debouncedSearch, activeCategory])

  const categoryList = categoriesData
    ? [{ id: '', name: 'Semua' }, ...(Array.isArray(categoriesData) ? categoriesData : categoriesData?.data ?? [])]
    : [{ id: '', name: 'Semua' }]

  const activeLaporan = statsData?.active_reports ?? statsData?.laporan_aktif ?? reportList.length
  const resolvedToday = statsData?.resolved_today  ?? statsData?.selesai_24j  ?? '-'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>

        {/* ── Mobile toggle ── */}
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
              {categoryList.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name ?? cat.nama}
                </button>
              ))}
            </div>
          </div>

          {/* Stat mini bar */}
          <div className="flex border-b border-gray-100 divide-x divide-gray-100">
            <div className="flex-1 p-3 text-center">
              <p className="text-lg font-extrabold text-primary">{activeLaporan}</p>
              <p className="text-xs text-gray-400">Laporan Aktif</p>
            </div>
            <div className="flex-1 p-3 text-center">
              <p className="text-lg font-extrabold text-primary">{resolvedToday}</p>
              <p className="text-xs text-gray-400">Selesai (24j)</p>
            </div>
          </div>

          {/* Report list */}
          <div className="flex-1 overflow-y-auto custom-scroll p-3 space-y-2">
            {loadingReports && (
              <>
                <ReportCardSkeleton />
                <ReportCardSkeleton />
                <ReportCardSkeleton />
              </>
            )}
            {!loadingReports && errorReports && (
              <p className="text-xs text-red-500 text-center py-4 px-2">{errorReports}</p>
            )}
            {!loadingReports && !errorReports && reportList.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">Tidak ada laporan ditemukan.</p>
            )}
            {!loadingReports && reportList.map(r => <ReportCard key={r.id} report={r} />)}
          </div>
        </aside>

        {/* ── Map area ── */}
        <div className="flex-1 relative min-h-[300px]">

          {/* Peta Leaflet */}
          <MapSurabaya />

          {/* Map controls — tetap di atas peta */}
          <div className="absolute bottom-6 right-4 flex flex-col gap-1 z-[1000]">
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

          {/* Stat overlay — tetap di atas peta */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl px-4 py-2.5 shadow border border-gray-100 z-[1000]">
            <div className="flex items-center gap-3 text-xs">
              <div>
                <p className="text-gray-400">Laporan Aktif</p>
                <p className="font-extrabold text-primary text-base">{activeLaporan}</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-gray-400">Selesai (24j)</p>
                <p className="font-extrabold text-primary text-base">{resolvedToday}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}
