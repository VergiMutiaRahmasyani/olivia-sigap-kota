import { useState } from 'react'
import { Search, ChevronDown, Eye, Ban, CheckCircle, User } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'

const MOCK_WARGA = [
  { id: 1, name: 'Aditya Pratama',  email: 'aditya@email.com',  city: 'Jakarta Selatan', laporan: 42, level: 12, status: 'aktif',    joined: 'Mar 2026' },
  { id: 2, name: 'Siti Rahayu',     email: 'siti@email.com',    city: 'Jakarta Timur',   laporan: 18, level: 7,  status: 'aktif',    joined: 'Apr 2026' },
  { id: 3, name: 'Budi Santoso',    email: 'budi@email.com',    city: 'Jakarta Pusat',   laporan: 31, level: 10, status: 'aktif',    joined: 'Feb 2026' },
  { id: 4, name: 'Maya Kusuma',     email: 'maya@email.com',    city: 'Jakarta Pusat',   laporan: 9,  level: 4,  status: 'aktif',    joined: 'Mei 2026' },
  { id: 5, name: 'Rudi Hartono',    email: 'rudi@email.com',    city: 'Jakarta Barat',   laporan: 55, level: 15, status: 'aktif',    joined: 'Jan 2026' },
  { id: 6, name: 'Dewi Anggraini',  email: 'dewi@email.com',    city: 'Jakarta Utara',   laporan: 3,  level: 2,  status: 'suspend',  joined: 'Mei 2026' },
  { id: 7, name: 'Hendra Wijaya',   email: 'hendra@email.com',  city: 'Depok',           laporan: 27, level: 9,  status: 'aktif',    joined: 'Mar 2026' },
  { id: 8, name: 'Rina Marlina',    email: 'rina@email.com',    city: 'Bekasi',          laporan: 14, level: 6,  status: 'aktif',    joined: 'Apr 2026' },
]

const STATUS_OPTIONS = ['Semua', 'aktif', 'suspend']

export default function AdminWarga() {
  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState('Semua')
  const [detail, setDetail]   = useState(null)
  const [warga, setWarga]     = useState(MOCK_WARGA)

  const filtered = warga.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
                        w.email.toLowerCase().includes(search.toLowerCase()) ||
                        w.city.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'Semua' || w.status === status
    return matchSearch && matchStatus
  })

  const toggleSuspend = id => {
    setWarga(prev => prev.map(w =>
      w.id === id ? { ...w, status: w.status === 'aktif' ? 'suspend' : 'aktif' } : w
    ))
    if (detail?.id === id) {
      setDetail(prev => ({ ...prev, status: prev.status === 'aktif' ? 'suspend' : 'aktif' }))
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 page-enter">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-extrabold text-gray-900">Manajemen Warga</h1>
          <p className="text-sm text-gray-500 mt-1">{warga.length} warga terdaftar</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, email, atau kota..."
              className="input-field pl-9 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="input-field pr-8 text-sm appearance-none cursor-pointer"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>
                  {s === 'Semua' ? 'Semua Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Warga', 'Kota', 'Laporan', 'Level', 'Status', 'Bergabung', 'Aksi'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-display font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(w => (
                  <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <User size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-display font-semibold text-gray-800">{w.name}</p>
                          <p className="text-xs text-gray-400">{w.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{w.city}</td>
                    <td className="px-4 py-3 text-gray-800 font-display font-bold whitespace-nowrap">{w.laporan}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="badge bg-primary-50 text-primary">Lv. {w.level}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`badge ${w.status === 'aktif' ? 'badge-selesai' : 'badge-kritikal'}`}>
                        {w.status === 'aktif' ? 'Aktif' : 'Suspend'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{w.joined}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDetail(w)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-50 transition-colors"
                          title="Lihat detail"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => toggleSuspend(w.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            w.status === 'aktif'
                              ? 'text-gray-400 hover:text-danger hover:bg-red-50'
                              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={w.status === 'aktif' ? 'Suspend' : 'Aktifkan kembali'}
                        >
                          {w.status === 'aktif' ? <Ban size={15} /> : <CheckCircle size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="font-display font-semibold">Tidak ada warga ditemukan</p>
                <p className="text-xs mt-1">Coba ubah filter pencarian</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail modal */}
        {detail && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setDetail(null)}>
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-gray-900">Detail Warga</h3>
                <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-display font-bold text-gray-900">{detail.name}</p>
                  <p className="text-xs text-gray-400">{detail.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-5">
                <Row label="Kota">       {detail.city}    </Row>
                <Row label="Laporan">    {detail.laporan} </Row>
                <Row label="Level">      {detail.level}   </Row>
                <Row label="Bergabung">  {detail.joined}  </Row>
                <Row label="Status">
                  <span className={`badge ${detail.status === 'aktif' ? 'badge-selesai' : 'badge-kritikal'}`}>
                    {detail.status === 'aktif' ? 'Aktif' : 'Suspend'}
                  </span>
                </Row>
              </div>

              <button
                onClick={() => toggleSuspend(detail.id)}
                className={`w-full py-2.5 rounded-xl text-sm font-display font-semibold transition-colors ${
                  detail.status === 'aktif'
                    ? 'bg-red-50 text-danger hover:bg-red-100'
                    : 'bg-primary-50 text-primary hover:bg-primary-100'
                }`}
              >
                {detail.status === 'aktif' ? '🚫 Suspend Akun' : '✓ Aktifkan Kembali'}
              </button>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
      <span className="text-gray-400 font-display font-semibold text-xs uppercase tracking-wide">{label}</span>
      <span className="text-gray-700">{children}</span>
    </div>
  )
}