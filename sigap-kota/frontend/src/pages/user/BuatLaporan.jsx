import { useState } from 'react'
import { CheckCircle, ChevronRight, Road, Home, Lightbulb, Shield, Upload, MapPin, FileText, ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

const STEPS = ['Pilih Kategori', 'Unggah Bukti', 'Lokasi Presisi', 'Detail Laporan']

const CATEGORIES = [
  { id: 'jalan',    label: 'Jalan & Trotoar',      Icon: Road    },
  { id: 'banjir',   label: 'Banjir & Drainase',    Icon: Home    },
  { id: 'lampu',    label: 'Penerangan Jalan',      Icon: Lightbulb },
  { id: 'keamanan', label: 'Keamanan & Kriminal',   Icon: Shield  },
]

// ── Step 1 ───────────────────────────────────────────────────────────────────
function StepKategori({ selected, onSelect }) {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">Apa yang ingin Anda laporkan?</h2>
      <p className="text-sm text-gray-500 mb-8">Pilih salah satu kategori infrastruktur atau keamanan di bawah ini.</p>
      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`p-8 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-150 ${
              selected === id
                ? 'border-primary bg-primary-50'
                : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50/40'
            }`}
          >
            <Icon size={30} className="text-primary" />
            <span className="text-sm font-display font-semibold text-gray-800 text-center">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Step 2 ───────────────────────────────────────────────────────────────────
function StepUnggah({ files, onFiles }) {
  const handleDrop = e => {
    e.preventDefault()
    onFiles([...files, ...Array.from(e.dataTransfer.files)])
  }

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">Unggah Bukti</h2>
      <p className="text-sm text-gray-500 mb-6">Tambahkan foto atau video sebagai bukti laporan.</p>

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-primary transition-colors cursor-pointer"
        onClick={() => document.getElementById('file-input').click()}
      >
        <Upload size={32} className="text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-display font-semibold text-gray-600">Seret & lepas atau klik untuk unggah</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, MP4 — maks. 10MB</p>
        <input
          id="file-input" type="file" multiple accept="image/*,video/*" className="hidden"
          onChange={e => onFiles([...files, ...Array.from(e.target.files)])}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {files.map((f, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
              <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Step 3 ───────────────────────────────────────────────────────────────────
function StepLokasi({ location, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">Lokasi Presisi</h2>
      <p className="text-sm text-gray-500 mb-6">Tandai lokasi kejadian di peta atau isi secara manual.</p>

      {/* Map placeholder */}
      <div className="w-full h-56 rounded-2xl bg-gray-800 flex items-center justify-center mb-5">
        <div className="text-center text-gray-500">
          <MapPin size={28} className="mx-auto mb-1 opacity-40" />
          <p className="text-xs">Klik untuk pilih lokasi di peta</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="input-label">Alamat Lengkap</label>
          <input type="text" placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan"
            className="input-field" value={location} onChange={e => onChange(e.target.value)} />
        </div>
        <button className="btn-secondary w-full justify-center">
          <MapPin size={15} />
          Gunakan Lokasi Saat Ini
        </button>
      </div>
    </div>
  )
}

// ── Step 4 ───────────────────────────────────────────────────────────────────
function StepDetail({ detail, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">Detail Laporan</h2>
      <p className="text-sm text-gray-500 mb-6">Berikan informasi tambahan agar laporan Anda lebih mudah ditindaklanjuti.</p>

      <div className="space-y-4">
        <div>
          <label className="input-label">Judul Laporan</label>
          <input type="text" placeholder="Contoh: Lubang jalan besar di depan halte"
            className="input-field" value={detail.title} onChange={e => onChange({ ...detail, title: e.target.value })} />
        </div>
        <div>
          <label className="input-label">Deskripsi</label>
          <textarea
            rows={4}
            placeholder="Jelaskan kondisi, ukuran, dampak, dan kapan pertama kali terlihat..."
            className="input-field resize-none"
            value={detail.desc}
            onChange={e => onChange({ ...detail, desc: e.target.value })}
          />
        </div>
        <div>
          <label className="input-label">Tingkat Urgensi</label>
          <select className="input-field" value={detail.urgency} onChange={e => onChange({ ...detail, urgency: e.target.value })}>
            <option value="">Pilih tingkat urgensi</option>
            <option value="rendah">Rendah — Bisa ditunda</option>
            <option value="sedang">Sedang — Perlu perhatian</option>
            <option value="tinggi">Tinggi — Segera ditangani</option>
            <option value="kritikal">Kritikal — Bahaya langsung</option>
          </select>
        </div>
      </div>
    </div>
  )
}

// ── Main wizard ───────────────────────────────────────────────────────────────
export default function BuatLaporan() {
  const [step, setStep]         = useState(0)
  const [category, setCategory] = useState('')
  const [files, setFiles]       = useState([])
  const [location, setLocation] = useState('')
  const [detail, setDetail]     = useState({ title: '', desc: '', urgency: '' })
  const [submitted, setSubmitted] = useState(false)

  const canNext = [
    category !== '',
    true, // files optional
    location !== '',
    detail.title !== '' && detail.urgency !== '',
  ]

  const handleNext = () => {
    if (step === STEPS.length - 1) { setSubmitted(true); return }
    setStep(s => s + 1)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <CheckCircle size={64} className="text-primary mx-auto" />
            <h2 className="text-2xl font-display font-bold text-gray-900">Laporan Terkirim!</h2>
            <p className="text-gray-500">Terima kasih. Laporan Anda sedang diproses oleh tim kami.</p>
            <a href="/peta-laporan" className="btn-primary inline-flex">Lihat di Peta</a>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full flex-1 flex gap-8">

        {/* ── Sidebar stepper ── */}
        <aside className="w-44 flex-shrink-0 hidden md:block">
          <div className="card p-5 sticky top-24">
            <p className="text-xs font-display font-bold text-gray-400 uppercase tracking-widest mb-4">
              Status Laporan
            </p>
            <div className="space-y-1">
              {STEPS.map((label, i) => (
                <div key={i} className={`flex items-start gap-2.5 py-2 ${i < step ? 'opacity-60' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-display font-bold mt-0.5 ${
                    i === step ? 'bg-primary text-white' :
                    i < step  ? 'bg-primary-100 text-primary' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm font-display font-semibold leading-tight ${
                    i === step ? 'text-primary' : 'text-gray-400'
                  }`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Content ── */}
        <div className="flex-1 card p-8 md:p-10">
          {step === 0 && <StepKategori selected={category} onSelect={setCategory} />}
          {step === 1 && <StepUnggah files={files} onFiles={setFiles} />}
          {step === 2 && <StepLokasi location={location} onChange={setLocation} />}
          {step === 3 && <StepDetail detail={detail} onChange={setDetail} />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={15} />
              Kembali
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext[step]}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === STEPS.length - 1 ? 'Kirim Laporan' : 'Lanjut'}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}