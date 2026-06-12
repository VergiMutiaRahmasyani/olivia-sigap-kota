import { useState, useEffect } from 'react'
import { Brain, Clock, MapPin, Download, ZoomIn, ZoomOut, Crosshair, Search, AlertCircle } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import MapSurabaya from '../../components/common/MapSurabaya'
import { wilayah as wilayahApi, adminReports } from '../../services/api'

const NAV = [
  { to: '/admin/peta',    label: 'Peta Laporan'    },
  { to: '/admin/laporan',  label: 'Kelola Laporan'  },
  { to: '/admin/instansi', label: 'Kelola Instansi' },
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

function WilayahSkeleton() {
  return (
    <div className="px-4 py-4 border-b border-gray-100 animate-pulse">
      <div className="flex justify-between mb-2">
        <div className="h-4 w-32 bg-gray-100 rounded" />
        <div className="h-4 w-12 bg-gray-100 rounded" />
      </div>
      <div className="h-3 w-full bg-gray-100 rounded mb-1" />
      <div className="h-3 w-2/3 bg-gray-100 rounded" />
    </div>
  )
}

export default function PetaLaporan() {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  const [selected,   setSelected]   = useState(null)
  const [search,     setSearch]     = useState('')
  const [wilayahList, setWilayahList] = useState([])
  const [stats,      setStats]      = useState(null)
  const [zones,      setZones]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [reportList, setReportList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [urgensiRes, statsRes, reportsRes] = await Promise.all([
          wilayahApi.urgensi(),
          adminReports.stats(),
          adminReports.index(),
        ])

        const list = Array.isArray(urgensiRes) ? urgensiRes : (urgensiRes?.data ?? [])
        const zonesData = urgensiRes?.zones ?? []
        setWilayahList(list)

        let reports = []
        if (Array.isArray(reportsRes)) reports = reportsRes
        else if (Array.isArray(reportsRes?.data)) reports = reportsRes.data
        else if (Array.isArray(reportsRes?.data?.data)) reports = reportsRes.data.data
        else if (Array.isArray(reportsRes?.reports)) reports = reportsRes.reports

        setReportList(reports)
        setZones(zonesData)
        setStats(statsRes?.data ?? statsRes ?? null)
      } catch (err) {
        setError(err.message ?? 'Gagal memuat data peta.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  // Perbaikan: Filter berdasarkan judul dan urutkan berdasarkan urgensi
  const filtered = reportList
    .filter(report => 
      search === '' ? true : report.title?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const priority = { kritis: 1, tinggi: 2, sedang: 3 };
      return (priority[a.level] || 3) - (priority[b.level] || 3);
    });

  const linkClass = ({ isActive }) =>
    `text-sm font-display font-semibold px-1 py-0.5 transition-colors relative ${
      isActive ? 'text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-full' : 'text-gray-600 hover:text-gray-900'
    }`

  return (
    <div className="h-screen flex flex-col bg-[#F5F0E8] overflow-hidden">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          <span className="text-lg font-display font-extrabold text-primary tracking-tight">SIGAP KOTA</span>
          <nav className="flex items-center gap-8">
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>{label}</NavLink>
            ))}
          </nav>
          <button onClick={() => { logout(); navigate('/') }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-bold bg-primary text-white hover:bg-primary/90 transition-colors">
            Keluar
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
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

          {/* Stats dihapus sesuai permintaan */}

          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari judul laporan…"
                className="flex-1 bg-transparent text-sm font-display outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? [...Array(3)].map((_, i) => <WilayahSkeleton key={i} />) : 
             filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">Tidak ada laporan ditemukan.</p>
            ) : (
              filtered.map(report => (
                <div key={report.id} className="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
    <div className="flex justify-between items-start gap-2 mb-1">
      <h3 className="font-bold text-sm text-gray-900">{report.title}</h3>
      {/* Badge Urgensi - Sesuaikan dengan 'parah' */}
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
        report.severity === 'parah' ? 'bg-red-100 text-red-600' :
        'bg-yellow-100 text-yellow-600'
      }`}>
        {report.severity === 'parah' ? 'Kritis' : (report.severity || 'Sedang')}
      </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{report.description}</p>
                  <p className="text-[10px] text-primary mt-2 flex items-center gap-1">
                    <MapPin size={10} /> {report.location_address}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-display font-bold text-sm py-3 rounded-xl transition-colors">
              <Download size={15} /> Export Laporan Prioritas
            </button>
          </div>
        </aside>

        <div className="flex-1 relative overflow-hidden">
          <MapSurabaya reports={reportList} />
          {/* Komponen lain dibiarkan sesuai permintaan */}
        </div>
      </div>
    </div>
  )
}