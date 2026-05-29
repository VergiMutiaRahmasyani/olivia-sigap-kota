import { useState } from 'react'
import { Bell, Shield, Tag, Globe, Save, RotateCcw } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon size={16} className="text-primary" />
        </div>
        <h2 className="text-base font-display font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-display font-semibold text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => setOn(v => !v)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${on ? 'bg-primary' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

const DEFAULT_CATEGORIES = ['Jalan & Trotoar', 'Banjir & Drainase', 'Penerangan Jalan', 'Keamanan & Kriminal']

export default function AdminPengaturan() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [newCat, setNewCat]         = useState('')
  const [platformName, setPlatformName] = useState('SIGAP KOTA')
  const [city, setCity]             = useState('Jakarta')
  const [saved, setSaved]           = useState(false)

  const addCategory = () => {
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      setCategories(prev => [...prev, newCat.trim()])
      setNewCat('')
    }
  }

  const removeCategory = cat => setCategories(prev => prev.filter(c => c !== cat))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminLayout>
      <div className="space-y-6 page-enter max-w-2xl">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-extrabold text-gray-900">Pengaturan Platform</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola konfigurasi dan preferensi SIGAP KOTA.</p>
        </div>

        {/* Informasi Umum */}
        <SectionCard icon={Globe} title="Informasi Umum">
          <div className="space-y-4">
            <div>
              <label className="input-label">Nama Platform</label>
              <input
                type="text"
                className="input-field"
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">Kota / Wilayah</label>
              <input
                type="text"
                className="input-field"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>
          </div>
        </SectionCard>

        {/* Notifikasi */}
        <SectionCard icon={Bell} title="Notifikasi">
          <div className="divide-y divide-gray-50">
            <ToggleRow
              label="Email Laporan Baru"
              desc="Kirim notifikasi email saat ada laporan masuk."
              defaultOn={true}
            />
            <ToggleRow
              label="Email Laporan Kritikal"
              desc="Notifikasi khusus untuk laporan dengan urgensi tinggi."
              defaultOn={true}
            />
            <ToggleRow
              label="Ringkasan Harian"
              desc="Kirim ringkasan aktivitas setiap pagi pukul 07.00."
              defaultOn={false}
            />
            <ToggleRow
              label="Notifikasi Warga Baru"
              desc="Pemberitahuan saat ada warga baru mendaftar."
              defaultOn={false}
            />
          </div>
        </SectionCard>

        {/* Kategori Laporan */}
        <SectionCard icon={Tag} title="Kategori Laporan">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <span key={cat} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 text-primary text-xs font-display font-semibold">
                  {cat}
                  <button
                    onClick={() => removeCategory(cat)}
                    className="text-primary/50 hover:text-danger transition-colors"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah kategori baru..."
                className="input-field flex-1 text-sm"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCategory()}
              />
              <button onClick={addCategory} className="btn-primary px-4 py-2 text-sm">
                Tambah
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Keamanan */}
        <SectionCard icon={Shield} title="Keamanan">
          <div className="divide-y divide-gray-50">
            <ToggleRow
              label="Verifikasi Email Wajib"
              desc="Warga harus verifikasi email sebelum bisa membuat laporan."
              defaultOn={true}
            />
            <ToggleRow
              label="Moderasi Laporan"
              desc="Setiap laporan baru perlu disetujui admin sebelum tampil di peta."
              defaultOn={false}
            />
            <ToggleRow
              label="Batas Laporan Harian"
              desc="Batasi setiap warga maksimal 5 laporan per hari."
              defaultOn={true}
            />
          </div>
        </SectionCard>

        {/* Save */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setPlatformName('SIGAP KOTA')
              setCity('Jakarta')
              setCategories(DEFAULT_CATEGORIES)
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw size={14} />
            Reset Default
          </button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save size={14} />
            {saved ? 'Tersimpan ✓' : 'Simpan Perubahan'}
          </button>
        </div>

      </div>
    </AdminLayout>
  )
}