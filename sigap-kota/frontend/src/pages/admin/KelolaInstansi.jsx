// pages/admin/KelolaInstansi.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Phone, Building2, Zap, AlertTriangle, Settings, ChevronRight, Shield, Truck, AlertCircle } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'

// ── Dummy data ──────────────────────────────────────────────────────────────
const INSTANSI_INIT = [
  {
    id: 1,
    nama: 'Dinas PUPR',
    kategori: 'Infrastruktur & Jalan',
    phone: '+62 812-3456-7890',
    aktif: true,
    routing: true,
    info: null,
    update: null,
    initials: ['JD', 'AS'],
    color: 'bg-amber-100',
    icon: Building2,
    iconColor: 'text-amber-700',
    note: null,
  },
  {
    id: 2,
    nama: 'BPBD',
    kategori: 'Bencana & Darurat',
    phone: '+62 811-0000-1234',
    aktif: true,
    routing: true,
    info: 'Critical Only',
    update: null,
    initials: [],
    color: 'bg-red-100',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    note: 'Siaga 24 Jam',
  },
  {
    id: 3,
    nama: 'Dishub',
    kategori: 'Lalu Lintas & Parkir',
    phone: '+62 813-9988-7766',
    aktif: false,
    routing: false,
    info: null,
    update: '2 hari lalu',
    initials: [],
    color: 'bg-blue-100',
    icon: Truck,
    iconColor: 'text-blue-600',
    note: null,
  },
  {
    id: 4,
    nama: 'Polsek Kota',
    kategori: 'Keamanan & Ketertiban',
    phone: '+62 812-2222-3333',
    aktif: true,
    routing: true,
    info: null,
    update: null,
    initials: [],
    color: 'bg-slate-100',
    icon: Shield,
    iconColor: 'text-slate-600',
    note: 'Cakupan: Seluruh Kota',
  },
]

const ROUTING_ROWS = [
  { kategori: 'Lubang di Jalan Raya',    tujuan: 'Dinas PUPR', prioritas: 'MEDIUM', prioritasCls: 'bg-green-100 text-green-700',  status: 'Aktif',  statusCls: 'text-green-600' },
  { kategori: 'Pohon Tumbang / Banjir',  tujuan: 'BPBD',       prioritas: 'HIGH',   prioritasCls: 'bg-red-100 text-red-600',     status: 'Aktif',  statusCls: 'text-green-600' },
  { kategori: 'Lampu Lalu Lintas Padam', tujuan: 'Dishub',      prioritas: 'MEDIUM', prioritasCls: 'bg-green-100 text-green-700',  status: 'Jeda',   statusCls: 'text-gray-400'  },
]

// ── Toggle component ────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function KelolaInstansi() {
  const navigate = useNavigate()
  const [instansi, setInstansi] = useState(INSTANSI_INIT)

  function toggleAktif(id) {
    setInstansi(prev => prev.map(i => i.id === id ? { ...i, aktif: !i.aktif } : i))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-gray-900">Kelola Kontak Instansi</h1>
            <p className="text-sm text-gray-500 mt-1">Konfigurasi nomor WhatsApp dan perutean otomatis peringatan AI untuk setiap dinas kota.</p>
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
          {[
            { icon: Building2,    label: 'Total Instansi',      value: '12',  cls: 'bg-white',    iconCls: 'bg-gray-100 text-gray-600',    valCls: 'text-gray-900' },
            { icon: Zap,          label: 'Routing Aktif',       value: '8',   cls: 'bg-white',    iconCls: 'bg-primary text-white',        valCls: 'text-gray-900' },
            { icon: Phone,        label: 'Pesan Terkirim (24j)', value: '142', cls: 'bg-white',    iconCls: 'bg-gray-100 text-gray-600',    valCls: 'text-gray-900' },
            { icon: AlertTriangle,label: 'Gagal Kirim',         value: '3',   cls: 'bg-red-50',   iconCls: 'bg-red-500 text-white',        valCls: 'text-red-600'  },
          ].map(({ icon: Icon, label, value, cls, iconCls, valCls }) => (
            <div key={label} className={`${cls} rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconCls}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-display font-semibold">{label}</p>
                <p className={`text-2xl font-display font-extrabold leading-tight ${valCls}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Instansi grid */}
        <div className="grid grid-cols-3 gap-4">
          {instansi.map(ins => {
            const Icon = ins.icon
            return (
              <div
                key={ins.id}
                className={`bg-white rounded-2xl border-t-2 ${ins.aktif ? 'border-t-primary' : 'border-t-gray-200'} border border-gray-100 p-5 flex flex-col gap-3`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ins.color}`}>
                      <Icon size={18} className={ins.iconColor} />
                    </div>
                    <div>
                      <p className="text-sm font-display font-extrabold text-gray-900">{ins.nama}</p>
                      <p className="text-xs text-gray-400">{ins.kategori}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-display font-bold ${ins.aktif ? 'text-primary' : 'text-gray-400'}`}>
                      {ins.aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <Toggle value={ins.aktif} onChange={() => toggleAktif(ins.id)} />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone size={12} className="text-gray-400" />
                  {ins.phone}
                </div>

                {/* Routing status */}
                <div className="flex items-center gap-2 text-xs">
                  <Building2 size={12} className={ins.routing ? 'text-primary' : 'text-gray-300'} />
                  {ins.routing
                    ? <span className="bg-primary/10 text-primary font-display font-bold px-2 py-0.5 rounded-full">AI Routing Enabled</span>
                    : <span className="text-gray-400">AI Routing Disabled</span>
                  }
                </div>

                {/* Info / note */}
                {ins.info && (
                  <div className="flex items-center gap-1 text-xs text-red-500 font-display font-bold">
                    <AlertTriangle size={11} /> {ins.info}
                  </div>
                )}
                {ins.note && (
                  <p className="text-xs text-gray-400">{ins.note}</p>
                )}
                {ins.update && (
                  <p className="text-xs text-gray-400">Update: {ins.update}</p>
                )}

                {/* Initials + edit */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-1">
                    {ins.initials.map(ini => (
                      <span key={ini} className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-[10px] font-display font-bold flex items-center justify-center">
                        {ini}
                      </span>
                    ))}
                  </div>
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
            {['Kategori Laporan', 'Tujuan Utama', 'Prioritas AI', 'Status'].map(h => (
              <p key={h} className="text-[10px] font-display font-extrabold text-gray-400 uppercase tracking-widest">{h}</p>
            ))}
          </div>

          {ROUTING_ROWS.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-4 gap-4 px-6 py-4 items-center ${i < ROUTING_ROWS.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <p className="text-sm font-display font-semibold text-gray-800">{row.kategori}</p>
              <p className="text-sm text-gray-600">{row.tujuan}</p>
              <span className={`text-[10px] font-display font-extrabold px-2.5 py-1 rounded-full w-fit tracking-wider ${row.prioritasCls}`}>
                {row.prioritas}
              </span>
              <span className={`text-sm font-display font-semibold flex items-center gap-1.5 ${row.statusCls}`}>
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${row.statusCls.includes('green') ? 'bg-green-500' : 'bg-gray-300'}`} />
                {row.status}
              </span>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  )
}