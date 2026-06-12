// pages/admin/TambahInstansi.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, UserCircle, Phone, GitMerge, ChevronRight, Info, Loader2 } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import api from '../../services/api'

export default function TambahInstansi() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nama:              '',
    jenis:             'PUPR',
    kota:              '',
    alamat:            '',
    email:             '',
    penanggung_jawab:  '',
    no_hp:             '',
    whatsapp:          '',
    kategori_jalan_rusak:  false,
    kategori_bencana:      false,
    kategori_lalu_lintas:  false,
    radius:            10,
    jam_operasional:   '24 Jam Penuh',
  })

  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    // Hapus error field saat user mengetik
    if (errors[field]) setErrors(prev => { const e = {...prev}; delete e[field]; return e })
  }

  function toggleKategori(key) {
    setForm(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSimpan(e) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      await api.post('/instansi', form)
      setSuccess(true)
      setTimeout(() => navigate('/admin/instansi'), 1500)
    } catch (err) {
      if (err.response?.status === 422) {
        // Validation errors dari Laravel
        setErrors(err.response.data.errors ?? {})
      } else {
        alert('Terjadi kesalahan. Coba lagi.')
        console.error(err)
      }
    } finally {
      setLoading(false)
    }
  }

  const inputCls = (field) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm font-display outline-none focus:border-primary transition-colors bg-white placeholder:text-gray-300 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'
    }`
  const labelCls = 'text-xs font-display font-semibold text-gray-600 mb-1.5 block'

  const FieldError = ({ field }) =>
    errors[field] ? (
      <p className="text-xs text-red-500 mt-1">{errors[field][0]}</p>
    ) : null

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

        {/* Success banner */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-2xl px-5 py-4 font-display font-semibold">
            ✓ Instansi berhasil disimpan. Mengalihkan…
          </div>
        )}

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
                  className={inputCls('nama')}
                  placeholder="Contoh: Dinas Bina Marga"
                  value={form.nama}
                  onChange={e => set('nama', e.target.value)}
                />
                <FieldError field="nama" />
              </div>
              <div>
                <label className={labelCls}>Jenis Instansi</label>
                <select
                  className={inputCls('jenis')}
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
                  className={inputCls('kota')}
                  placeholder="Kota, Provinsi"
                  value={form.kota}
                  onChange={e => set('kota', e.target.value)}
                />
                <FieldError field="kota" />
              </div>
              <div>
                <label className={labelCls}>Alamat Kantor</label>
                <input
                  className={inputCls('alamat')}
                  placeholder="Jl. Raya No. 123"
                  value={form.alamat}
                  onChange={e => set('alamat', e.target.value)}
                />
                <FieldError field="alamat" />
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
                  className={inputCls('email')}
                  placeholder="admin@dinas.go.id"
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                />
                <FieldError field="email" />
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
                  className={inputCls('penanggung_jawab')}
                  placeholder="Nama Lengkap"
                  value={form.penanggung_jawab}
                  onChange={e => set('penanggung_jawab', e.target.value)}
                />
                <FieldError field="penanggung_jawab" />
              </div>
              <div>
                <label className={labelCls}>Nomor HP</label>
                <input
                  className={inputCls('no_hp')}
                  placeholder="0812-xxxx-xxxx"
                  value={form.no_hp}
                  onChange={e => set('no_hp', e.target.value)}
                />
                <FieldError field="no_hp" />
              </div>
              <div>
                <label className={labelCls}>WhatsApp Hotcall</label>
                <input
                  className={inputCls('whatsapp')}
                  placeholder="0812-xxxx-xxxx"
                  value={form.whatsapp}
                  onChange={e => set('whatsapp', e.target.value)}
                />
                <FieldError field="whatsapp" />
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
                    { key: 'kategori_jalan_rusak',  label: 'Jalan Rusak'  },
                    { key: 'kategori_bencana',       label: 'Bencana'      },
                    { key: 'kategori_lalu_lintas',   label: 'Lalu Lintas'  },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                      <div
                        onClick={() => toggleKategori(key)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          form[key]
                            ? 'bg-primary border-primary'
                            : 'border-gray-300 group-hover:border-primary/50'
                        }`}
                      >
                        {form[key] && (
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
                  className={inputCls('jam_operasional')}
                  value={form.jam_operasional}
                  onChange={e => set('jam_operasional', e.target.value)}
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
            disabled={loading}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-display font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSimpan}
            disabled={loading || success}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-display font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {loading
              ? <><Loader2 size={15} className="animate-spin" /> Menyimpan…</>
              : 'Simpan Instansi ▷'
            }
          </button>
        </div>

      </div>
    </AdminLayout>
  )
}