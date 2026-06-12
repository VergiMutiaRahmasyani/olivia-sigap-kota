// pages/admin/KelolaInstansi.jsx
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Phone, Building2, Zap, AlertTriangle, Settings,
  ChevronRight, Shield, Truck, AlertCircle, Loader2
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { instansi as apiInstansi } from '../../services/api'

// ── Mapping jenis → ikon & warna ──────────────────────────────────────────
const JENIS_META = {
  PUPR:      { icon: Building2,   color: 'bg-amber-100', iconColor: 'text-amber-700' },
  BPBD:      { icon: AlertCircle, color: 'bg-red-100',   iconColor: 'text-red-600'   },
  Dishub:    { icon: Truck,       color: 'bg-blue-100',  iconColor: 'text-blue-600'  },
  Polisi:    { icon: Shield,      color: 'bg-slate-100', iconColor: 'text-slate-600' },
  Kesehatan: { icon: AlertCircle, color: 'bg-green-100', iconColor: 'text-green-600' },
  Lainnya:   { icon: Building2,   color: 'bg-gray-100',  iconColor: 'text-gray-600'  },
}

// ── Toggle component ───────────────────────────────────────────────────────
function Toggle({ value, onChange, loading }) {
  return (
    <button
      onClick={onChange}
      disabled={loading}
      className={`relative w-10 h-5 rounded-full transition-colors ${
        loading ? 'opacity-50 cursor-wait' : ''
      } ${value ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          value ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function KelolaInstansi() {
  const navigate = useNavigate()

  const [instansi, setInstansi]         = useState([])
  const [stats, setStats]               = useState({ total: 0, routing_aktif: 0, pesan_terkirim: 0, gagal_kirim: 0 })
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [togglingId, setTogglingId]     = useState(null) // id yg sedang di-toggle

  // ── Fetch data ─────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiInstansi.index()
      setInstansi(res.data)
      setStats(res.stats)
    } catch (err) {
      setError('Gagal memuat data instansi. Coba muat ulang halaman.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Toggle aktif ───────────────────────────────────────────────────────
  async function handleToggleAktif(ins) {
    setTogglingId(ins.id)
    try {
      const { data } = await api.patch(`/instansi/${ins.id}/toggle-aktif`)
      setInstansi(prev =>
        prev.map(i => i.id === ins.id ? { ...i, aktif: data.aktif } : i)
      )
    } catch {
      alert('Gagal mengubah status instansi.')
    } finally {
      setTogglingId(null)
    }
  }

  // ── Stat cards config ──────────────────────────────────────────────────
  const STAT_CARDS = [
    { icon: Building2,     label: 'Total Instansi',       value: stats.total,          cls: 'bg-white',  iconCls: 'bg-gray-100 text-gray-600',  valCls: 'text-gray-900' },
    { icon: Zap,           label: 'Routing Aktif',        value: stats.routing_aktif,  cls: 'bg-white',  iconCls: 'bg-primary text-white',      valCls: 'text-gray-900' },
    { icon: Phone,         label: 'Pesan Terkirim (24j)', value: stats.pesan_terkirim, cls: 'bg-white',  iconCls: 'bg-gray-100 text-gray-600',  valCls: 'text-gray-900' },
    { icon: AlertTriangle, label: 'Gagal Kirim',          value: stats.gagal_kirim,    cls: stats.gagal_kirim > 0 ? 'bg-red-50' : 'bg-white', iconCls: stats.gagal_kirim > 0 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600', valCls: stats.gagal_kirim > 0 ? 'text-red-600' : 'text-gray-900' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-gray-900">Kelola Kontak Instansi</h1>
            <p className="text-sm text-gray-500 mt-1">
              Konfigurasi nomor WhatsApp dan perutean otomatis peringatan AI untuk setiap dinas kota.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/instansi/tambah')}
            className="flex items-center gap-2 bg-primary text-white text-sm font-display font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> Tambah Instansi Baru
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {STAT_CARDS.map(({ icon: Icon, label, value, cls, iconCls, valCls }) => (
            <div key={label} className={`${cls} rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconCls}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-display font-semibold">{label}</p>
                <p className={`text-2xl font-display font-extrabold leading-tight ${valCls}`}>
                  {loading ? '—' : value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3">
            <AlertTriangle size={16} />
            {error}
            <button onClick={fetchData} className="ml-auto underline font-semibold">Coba lagi</button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl border border-gray-100 p-5 h-48 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-28 bg-gray-100 rounded" />
                    <div className="h-2.5 w-20 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-2.5 w-36 bg-gray-100 rounded mb-3" />
                <div className="h-2.5 w-24 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Instansi grid */}
        {!loading && !error && (
          <>
            {instansi.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                <Building2 size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-display font-semibold">Belum ada instansi terdaftar.</p>
                <button
                  onClick={() => navigate('/admin/instansi/tambah')}
                  className="mt-4 text-sm text-primary font-display font-bold hover:underline"
                >
                  + Tambah instansi pertama
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {instansi.map(ins => {
                  const meta = JENIS_META[ins.jenis] ?? JENIS_META['Lainnya']
                  const Icon = meta.icon
                  return (
                    <div
                      key={ins.id}
                      className={`bg-white rounded-2xl border-t-2 ${ins.aktif ? 'border-t-primary' : 'border-t-gray-200'} border border-gray-100 p-5 flex flex-col gap-3`}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.color}`}>
                            <Icon size={18} className={meta.iconColor} />
                          </div>
                          <div>
                            <p className="text-sm font-display font-extrabold text-gray-900">{ins.nama}</p>
                            <p className="text-xs text-gray-400">{ins.kategori_label}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-display font-bold ${ins.aktif ? 'text-primary' : 'text-gray-400'}`}>
                            {ins.aktif ? 'Aktif' : 'Nonaktif'}
                          </span>
                          <Toggle
                            value={ins.aktif}
                            loading={togglingId === ins.id}
                            onChange={() => handleToggleAktif(ins)}
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone size={12} className="text-gray-400" />
                        {ins.whatsapp || ins.no_hp || <span className="text-gray-300 italic">Belum diisi</span>}
                      </div>

                      {/* Routing status */}
                      <div className="flex items-center gap-2 text-xs">
                        <Building2 size={12} className={ins.ai_routing ? 'text-primary' : 'text-gray-300'} />
                        {ins.ai_routing
                          ? <span className="bg-primary/10 text-primary font-display font-bold px-2 py-0.5 rounded-full">AI Routing Enabled</span>
                          : <span className="text-gray-400">AI Routing Disabled</span>
                        }
                      </div>

                      {/* Update info */}
                      {ins.updated_at && (
                        <p className="text-xs text-gray-400">Update: {ins.updated_at}</p>
                      )}

                      {/* Edit */}
                      <div className="flex items-center justify-end pt-1 border-t border-gray-100 mt-auto">
                        <button
                          onClick={() => navigate(`/admin/instansi/${ins.id}/edit`)}
                          className="text-xs font-display font-semibold text-primary hover:underline flex items-center gap-0.5"
                        >
                          Edit Profil <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Routing table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap size={15} className="text-primary" />
                  </div>
                  <p className="text-sm font-display font-bold text-gray-900">Logika Perutean AI (Auto-Routing)</p>
                </div>
                <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-xs font-display font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  <Settings size={13} /> Konfigurasi Global
                </button>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
                {['Instansi', 'Kategori Aktif', 'Radius', 'Status'].map(h => (
                  <p key={h} className="text-[10px] font-display font-extrabold text-gray-400 uppercase tracking-widest">{h}</p>
                ))}
              </div>

              {instansi.filter(i => i.ai_routing).length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-gray-400">Tidak ada routing aktif.</div>
              ) : (
                instansi.filter(i => i.ai_routing).map((ins, idx, arr) => {
                  const aktifKategori = [
                    ins.kategori_jalan_rusak  && 'Jalan Rusak',
                    ins.kategori_bencana      && 'Bencana',
                    ins.kategori_lalu_lintas  && 'Lalu Lintas',
                  ].filter(Boolean)

                  return (
                    <div
                      key={ins.id}
                      className={`grid grid-cols-4 gap-4 px-6 py-4 items-center ${idx < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <p className="text-sm font-display font-semibold text-gray-800">{ins.nama}</p>
                      <p className="text-sm text-gray-600">
                        {aktifKategori.length > 0 ? aktifKategori.join(', ') : <span className="text-gray-300 italic">—</span>}
                      </p>
                      <p className="text-sm text-gray-600">{ins.radius} km</p>
                      <span className={`text-sm font-display font-semibold flex items-center gap-1.5 ${ins.aktif ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${ins.aktif ? 'bg-green-500' : 'bg-gray-300'}`} />
                        {ins.aktif ? 'Aktif' : 'Jeda'}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}

      </div>
    </AdminLayout>
  )
}