// pages/admin/TambahInstansi.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, UserCircle, Phone, GitMerge, ChevronRight, Info } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'

export default function TambahInstansi() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nama: '',
    jenis: 'PUPR',
    kota: '',
    alamat: 'Jl. Raya No. 123',
    email: '',
    penanggung: '',
    noHp: '',
    whatsapp: '',
    kategori: { jalanRusak: false, bencana: false, laluLintas: false },
    radius: 10,
    jamOperasional: '24 Jam Penuh',
  })

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function setKategori(key) {
    setForm(prev => ({
      ...prev,
      kategori: { ...prev.kategori, [key]: !prev.kategori[key] }
    }))
  }

  function handleSimpan(e) {
    e.preventDefault()
    // TODO: save logic
    navigate('/admin/instansi')
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-display outline-none focus:border-primary transition-colors bg-white placeholder:text-gray-300'
  const labelCls = 'text-xs font-display font-semibold text-gray-600 mb-1.5 block'

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-display">
          <button onClick={() => navigate('/admin/instansi')} className="hover:text-primary transition-colors">
            Kelola Instansi
          </button>
          <ChevronRight size={12} />
          <span className="text-primary font-semibold">Tambah Instansi Baru</span>
        </div>

        {/* ── Section 1: Identitas ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-l-4 border-primary">
            <div className="flex items-center gap-2 mb-5">
              <Building2 size={18} className="text-primary" />
              <h2 className="text-base font-display font-extrabold text-gray-900">Identitas Instansi</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Nama Instansi</label>
                <input
                  className={inputCls}
                  placeholder="Contoh: Dinas Bina Marga"
                  value={form.nama}
                  onChange={e => set('nama', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Jenis Instansi</label>
                <select
                  className={inputCls}
                  value={form.jenis}
                  onChange={e => set('jenis', e.target.value)}
                >
                  {['PUPR', 'BPBD', 'Dishub', 'Polisi', 'Kesehatan', 'Lainnya'].map(j => (
                    <option key={j}>{j}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Kota &amp; Provinsi</label>
                <input
                  className={inputCls}
                  placeholder="Kota, Provinsi"
                  value={form.kota}
                  onChange={e => set('kota', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Alamat Kantor</label>
                <input
                  className={inputCls}
                  placeholder="Jl. Raya No. 123"
                  value={form.alamat}
                  onChange={e => set('alamat', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Data Akun ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-l-4 border-primary">
            <div className="flex items-center gap-2 mb-5">
              <UserCircle size={18} className="text-primary" />
              <h2 className="text-base font-display font-extrabold text-gray-900">Data Akun</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Email Resmi Dinas</label>
                <input
                  className={inputCls}
                  placeholder="admin@dinas.go.id"
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                />
              </div>
              <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 flex items-start gap-2.5">
                <Info size={14} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Sistem akan secara otomatis menghasilkan kata sandi sementara yang akan dikirimkan ke email terdaftar setelah form disimpan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3: Kontak Operasional ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-l-4 border-primary">
            <div className="flex items-center gap-2 mb-5">
              <Phone size={18} className="text-primary" />
              <h2 className="text-base font-display font-extrabold text-gray-900">Kontak Operasional</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Nama Penanggung Jawab</label>
                <input
                  className={inputCls}
                  placeholder="Nama Lengkap"
                  value={form.penanggung}
                  onChange={e => set('penanggung', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Nomor HP</label>
                <input
                  className={inputCls}
                  placeholder="0812-xxxx-xxxx"
                  value={form.noHp}
                  onChange={e => set('noHp', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>WhatsApp Hotcall</label>
                <input
                  className={inputCls}
                  placeholder="0812-xxxx-xxxx"
                  value={form.whatsapp}
                  onChange={e => set('whatsapp', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 4: Konfigurasi Routing ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-l-4 border-primary">
            <div className="flex items-center gap-2 mb-5">
              <GitMerge size={18} className="text-primary" />
              <h2 className="text-base font-display font-extrabold text-gray-900">Konfigurasi Routing</h2>
            </div>
            <div className="grid grid-cols-3 gap-8">

              {/* Kategori laporan */}
              <div>
                <p className={labelCls}>Kategori Laporan</p>
                <div className="space-y-2.5 mt-2">
                  {[
                    { key: 'jalanRusak', label: 'Jalan Rusak' },
                    { key: 'bencana',    label: 'Bencana'     },
                    { key: 'laluLintas', label: 'Lalu Lintas' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                      <div
                        onClick={() => setKategori(key)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          form.kategori[key]
                            ? 'bg-primary border-primary'
                            : 'border-gray-300 group-hover:border-primary/50'
                        }`}
                      >
                        {form.kategori[key] && (
                          <svg viewBox="0 0 10 8" fill="white" className="w-2.5 h-2.5">
                            <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Radius */}
              <div>
                <p className={labelCls}>Radius Wilayah Kerja (km)</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">1 km</span>
                    <span className="text-sm font-display font-extrabold text-primary">{form.radius} km</span>
                    <span className="text-xs text-gray-400">50 km</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={form.radius}
                    onChange={e => set('radius', Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              {/* Jam operasional */}
              <div>
                <p className={labelCls}>Jam Operasional</p>
                <select
                  className={inputCls}
                  value={form.jamOperasional}
                  onChange={e => set('jamOperasional', e.target.value)}
                >
                  {['24 Jam Penuh', '08:00 - 17:00', '07:00 - 21:00', 'Kustom'].map(j => (
                    <option key={j}>{j}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pb-4">
          <button
            onClick={() => navigate('/admin/instansi')}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-display font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSimpan}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-display font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            Simpan Instansi ▷
          </button>
        </div>

      </div>
    </AdminLayout>
  )
}