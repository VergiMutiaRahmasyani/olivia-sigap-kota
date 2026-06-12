import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, BarChart2, AlertCircle } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { reports as reportsApi } from '../../services/api'
import { useDashboardStats, useCategories } from '../../hooks/useApi'

const getNormalizedScore = (r) => {
  const rawScore = r.severity_score ?? r.urgency_score ?? r.score ?? 0;
  // Jika dari DB berupa 0-100, bagi 10. Jika sudah 0-10, biarkan.
  return rawScore > 10 ? rawScore / 10 : rawScore;
}

const LEVEL_COLOR = {
  kritis: 'text-red-500', critical: 'text-red-500',
  tinggi: 'text-orange-500', high: 'text-orange-500',
  sedang: 'text-green-500', medium: 'text-green-500',
  rendah: 'text-gray-400', low: 'text-gray-400',
}

const LEVEL_BAR = {
  kritis: 'bg-red-500', critical: 'bg-red-500',
  tinggi: 'bg-orange-400', high: 'bg-orange-400',
  sedang: 'bg-green-500', medium: 'bg-green-500',
  rendah: 'bg-gray-300', low: 'bg-gray-300',
}

const LEVEL_HEIGHT = {
  kritis: '100%', critical: '100%',
  tinggi: '75%', high: '75%',
  sedang: '45%', medium: '45%',
  rendah: '22%', low: '22%',
}

const STATUS_STYLE = {
  terdeteksi: 'bg-red-100 text-red-600',
  proses: 'bg-orange-100 text-orange-600', in_progress: 'bg-orange-100 text-orange-600',
  antrean: 'bg-gray-100 text-gray-600', pending: 'bg-gray-100 text-gray-600', verified: 'bg-blue-100 text-blue-600',
  selesai: 'bg-green-100 text-green-700', resolved: 'bg-green-100 text-green-700',
  critical: 'bg-red-100 text-red-600',
}

const STATUS_LABEL = {
  terdeteksi: 'TERDETEKSI', critical: 'KRITIS',
  proses: 'PROSES', in_progress: 'PROSES',
  antrean: 'ANTREAN', pending: 'ANTREAN', verified: 'TERVALIDASI',
  selesai: 'SELESAI', resolved: 'SELESAI',
}

function getStatusStyle(s) { return STATUS_STYLE[s] ?? 'bg-gray-100 text-gray-600' }
function getStatusLabel(s) { return STATUS_LABEL[s] ?? s?.toUpperCase() ?? '-' }

function getLevelColor(r) {
  const score = getNormalizedScore(r);
  if (score >= 8)  return 'text-red-500'
  if (score >= 5)  return 'text-orange-500'
  if (score >= 3)  return 'text-green-500'
  return 'text-gray-400'
}

function getBarColor(r) {
  const score = getNormalizedScore(r);
  if (score >= 8)  return 'bg-red-500'
  if (score >= 5)  return 'bg-orange-400'
  if (score >= 3)  return 'bg-green-500'
  return 'bg-gray-300'
}

function getBarHeight(r) {
  const score = getNormalizedScore(r);
  return `${Math.max(10, Math.min(100, score * 10))}%`;
}

function getLevelLabel(r) {
  const score = getNormalizedScore(r);
  if (score >= 8) return 'KRITIS';
  if (score >= 5) return 'TINGGI';
  if (score >= 3) return 'SEDANG';
  return 'RENDAH';
}

function ScoreBar({ report }) {
  return (
    <div className="w-1 h-10 rounded-full bg-gray-100 overflow-hidden self-center">
      <div
        className={`w-full rounded-full ${getBarColor(report)}`}
        style={{ height: getBarHeight(report) }}
      />
    </div>
  )
}

function RowSkeleton() {
  return (
    <div className="grid grid-cols-[180px_1fr_1fr_130px_100px] gap-4 px-6 py-4 border-b border-gray-100 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-1 h-10 bg-gray-200 rounded" />
        <div className="space-y-1.5">
          <div className="h-5 w-10 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="space-y-1.5 self-center">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-100 rounded" />
      </div>
      <div className="space-y-1.5 self-center">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-100 rounded" />
      </div>
      <div className="self-center"><div className="h-5 w-20 bg-gray-200 rounded-full" /></div>
      <div className="self-center"><div className="h-8 w-16 bg-gray-200 rounded-lg" /></div>
    </div>
  )
}

const PER_PAGE = 10

export default function KelolaLaporan() {
  const navigate = useNavigate()
  const [search, setSearch]       = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory]   = useState('')
  const [sort, setSort]           = useState('urgency')
  const [page, setPage]           = useState(1)
  const [reportList, setReportList]   = useState([])
  const [meta, setMeta]               = useState(null)
  const [loadingReports, setLoading]  = useState(true)
  const [errorReports, setError]      = useState(null)

  const { data: statsData } = useDashboardStats()
  const { data: categoriesData } = useCategories()

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchReports = useCallback(() => {
    setLoading(true)
    setError(null)
    const params = { page, per_page: PER_PAGE, sort }
    if (debouncedSearch) params.search = debouncedSearch
    if (category)        params.category_id = category

    reportsApi.index(params)
  .then(res => {
    // res.data adalah tempat Laravel meletakkan body response JSON
    const responseData = res.data;
        setReportList(responseData?.data ?? responseData ?? []);
        setMeta(responseData?.meta ?? null);
      })
    .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [page, debouncedSearch, category, sort]);
useEffect(() => { 
    fetchReports(); 
  }, [fetchReports]);

  const totalLaporan = meta?.total ?? reportList.length ?? 0;
  const highUrgency = reportList.filter(r => r.severity === 'parah' || r.severity === 'critical').length;
  const totalPages     = meta?.last_page ?? meta?.total_pages ?? 1
  const totalShowing   = meta?.total ?? reportList.length

  const catList = categoriesData
    ? [{ id: '', name: 'Semua Kategori' }, ...(Array.isArray(categoriesData) ? categoriesData : categoriesData?.data ?? [])]
    : [{ id: '', name: 'Semua Kategori' }]

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header row */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-gray-900">Kelola Laporan</h1>
            <p className="text-sm text-gray-500 mt-1">Panel administrasi untuk pemantauan dan tindak lanjut laporan warga.</p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex items-center gap-3 min-w-[140px]">
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                <BarChart2 size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-display font-semibold">Total Laporan</p>
                <p className="text-2xl font-display font-extrabold text-gray-900 leading-tight">{totalLaporan}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex items-center gap-3 min-w-[130px]">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle size={16} className="text-red-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-display font-semibold">Urgensi Tinggi</p>
                <p className="text-2xl font-display font-extrabold text-red-500 leading-tight">{highUrgency}</p>
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
            onChange={e => { setCategory(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-display font-semibold text-gray-700 bg-white outline-none focus:border-primary transition-colors cursor-pointer"
          >
            {catList.map(c => (
              <option key={c.id} value={c.id}>{c.name ?? c.nama}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-display font-semibold text-gray-700 bg-white outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="urgency">Urutkan: Urgensi Tertinggi</option>
            <option value="latest">Urutkan: Terbaru</option>
            <option value="oldest">Urutkan: Terlama</option>
          </select>

          <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm font-display font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal size={15} /> Filter Lanjut
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[180px_1fr_1fr_130px_100px] gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50">
            {['SKOR URGENSI AI', 'ID & KATEGORI', 'LOKASI & WAKTU', 'STATUS', 'AKSI'].map(h => (
              <p key={h} className="text-[10px] font-display font-extrabold text-gray-400 uppercase tracking-widest">
                {h}
              </p>
            ))}
          </div>

          {/* Loading */}
          {loadingReports && <><RowSkeleton /><RowSkeleton /><RowSkeleton /><RowSkeleton /></>}

          {/* Error */}
          {!loadingReports && errorReports && (
            <div className="px-6 py-8 text-center text-sm text-red-500">{errorReports}</div>
          )}

          {/* Empty */}
          {!loadingReports && !errorReports && reportList.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-gray-400">Tidak ada laporan ditemukan.</div>
          )}

          {/* Rows */}
          {!loadingReports && reportList.map((r, i) => {
            console.log("Struktur Lengkap Laporan:", JSON.stringify(r, null, 2));
            const reportId  = r.report_number ?? r.id
            const catName   = r.category?.name ?? r.kategori ?? r.category_name ?? '-'
            const location  = r.location_address ?? 'Lokasi tidak tersedia'
            const time      = r.created_at 
    ? new Date(r.created_at).toLocaleString('id-ID', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      }) 
    : '-'
            const score     = r.urgency_score ?? r.score ?? '-'
            const status    = r.status ?? 'pending'
            const isDone    = status === 'selesai' || status === 'resolved'

            return (
              <div
                key={r.id}
                className={`grid grid-cols-[180px_1fr_1fr_130px_100px] gap-4 px-6 py-4 items-center ${
                  i < reportList.length - 1 ? 'border-b border-gray-100' : ''
                } hover:bg-gray-50/50 transition-colors`}
              >
                {/* Score */}
                <div className="flex items-center gap-3">
                  <ScoreBar report={r} />
                  <div>
                    {/* <p className={`text-lg font-display font-extrabold leading-none ${getLevelColor(r)}`}>
                      {score}<span className="text-xs text-gray-400 font-normal">/10</span>
                    </p> */}
                    <p className={`text-[10px] font-display font-bold uppercase tracking-wider mt-0.5 ${getLevelColor(r)}`}>
                      {getLevelLabel(r)}
                    </p>
                  </div>
                </div>

                {/* ID & Category */}
                <div>
                  <p className="text-sm font-display font-bold text-gray-900">#{reportId}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{catName}</p>
                </div>

                {/* Location & time */}
                <div>
                  <p className="text-sm font-display font-semibold text-gray-800">{location}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                </div>

                {/* Status */}
                <div>
                  <span className={`text-[10px] font-display font-extrabold px-2.5 py-1 rounded-full tracking-wider ${getStatusStyle(status)}`}>
                    {getStatusLabel(status)}
                  </span>
                </div>

                {/* Action */}
                <div>
                  <button
                    onClick={() => navigate(`/admin/laporan/${r.id}`)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-display font-semibold transition-colors ${
                      isDone
                        ? 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {isDone ? 'Arsip' : 'Detail'}
                  </button>
                </div>
              </div>
            )
          })}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-display">
              Menampilkan {reportList.length} dari {totalShowing} laporan
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-400 disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const n = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
                return (
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
                )
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-400 disabled:opacity-40"
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