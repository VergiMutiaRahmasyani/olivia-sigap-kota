import { useState } from 'react'
import { CheckCircle, Road, Home, Lightbulb, Shield, Upload, MapPin, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { reports as reportsApi } from '../../services/api'
import { useCategories } from '../../hooks/useApi'
import LocationPickerMap from '../../components/common/LocationPickerMap'

const STEPS = ['Pilih Kategori', 'Unggah Bukti', 'Lokasi Presisi', 'Detail Laporan']

const CATEGORY_ICONS = {
  jalan: Road, banjir: Home, lampu: Lightbulb, keamanan: Shield,
  road: Road, flood: Home, light: Lightbulb, safety: Shield,
}

function StepKategori({ selected, onSelect, categoriesData, loadingCategories }) {
  if (loadingCategories) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-6">Apa yang ingin Anda laporkan?</h2>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const cats = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data ?? [])

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-1">Apa yang ingin Anda laporkan?</h2>
      <p className="text-sm text-gray-500 mb-6">Pilih salah satu kategori infrastruktur atau keamanan di bawah ini.</p>
      <div className="grid grid-cols-2 gap-3">
        {cats.map(cat => {
          const slug = (cat.slug ?? cat.id ?? '').toString().toLowerCase()
          const Icon = CATEGORY_ICONS[slug] ?? Road
          const label = cat.name ?? cat.nama ?? cat.label ?? 'Kategori'
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`p-4 sm:p-6 rounded-2xl border-2 flex flex-col items-center gap-2 sm:gap-3 transition-all duration-150 ${
                selected === cat.id
                  ? 'border-primary bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50/40'
              }`}
            >
              <Icon size={24} className="text-primary" />
              <span className="text-xs sm:text-sm font-display font-semibold text-gray-800 text-center">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepUnggah({ files, onFiles, aiResult, loadingAi, onAnalyze }) {
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    onFiles([...files, ...selectedFiles]);
    
    // Kirim foto pertama ke AI untuk dianalisis
    if (selectedFiles.length > 0) {
      onAnalyze(selectedFiles[0]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Unggah Bukti</h2>
      
      {/* Area Upload */}
      <div 
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer ${loadingAi ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}
        onClick={() => document.getElementById('file-input').click()}
      >
        {loadingAi ? (
          <p className="text-primary font-bold">Sedang Menganalisis Gambar dengan AI...</p>
        ) : (
          <>
            <Upload size={28} className="text-gray-300 mx-auto mb-3" />
            <p>Klik untuk unggah</p>
          </>
        )}
        <input id="file-input" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {/* Tampilkan Hasil AI jika ada */}
      {aiResult && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm font-bold text-green-800">Hasil Deteksi AI:</p>
          <p className="text-xs">Tingkat Kerusakan: {aiResult.severity.toUpperCase()} | Score: {aiResult.score}</p>
        </div>
      )}
    </div>
  )
}

function StepLokasi({ location, onChange }) {
  const handleGPS = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        onChange({ ...location, lat: latitude, lng: longitude, address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` })
      },
      () => {}
    )
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-1">Lokasi Presisi</h2>
      <p className="text-sm text-gray-500 mb-6">Tandai lokasi kejadian di peta atau isi secara manual.</p>

      <div className="mb-5 overflow-hidden rounded-2xl">
        <LocationPickerMap
          location={location}
          onChange={onChange}
        />
      </div>

      <div className="space-y-3">
        <div>
          <label className="input-label">Alamat Lengkap</label>
          <input
            type="text"
            placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan"
            className="input-field"
            value={location.address}
            onChange={e => onChange({ ...location, address: e.target.value })}
          />
        </div>
        <button onClick={handleGPS} type="button" className="btn-secondary w-full justify-center">
          <MapPin size={15} />
          Gunakan Lokasi Saat Ini
        </button>
        {location.lat && (
          <p className="text-xs text-gray-400 text-center">
            📍 Koordinat: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </p>
        )}
      </div>
    </div>
  )
}

function StepDetail({ detail, onChange }) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-1">Detail Laporan</h2>
      <p className="text-sm text-gray-500 mb-6">Berikan informasi tambahan agar laporan Anda lebih mudah ditindaklanjuti.</p>

      <div className="space-y-4">
        <div>
          <label className="input-label">Judul Laporan</label>
          <input
            type="text"
            placeholder="Contoh: Lubang jalan besar di depan halte"
            className="input-field"
            value={detail.title}
            onChange={e => onChange({ ...detail, title: e.target.value })}
          />
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
          <select
            className="input-field"
            value={detail.urgency}
            onChange={e => onChange({ ...detail, urgency: e.target.value })}
          >
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

export default function BuatLaporan() {
  const [step, setStep]         = useState(0)
  const [category, setCategory] = useState('')
  const [files, setFiles]       = useState([])
  const [location, setLocation] = useState({ address: '',kelurahan: '', kecamatan: '', lat: null, lng: null })
  const [detail, setDetail]     = useState({ title: '', desc: '', urgency: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [createdId, setCreatedId]   = useState(null)
  const [aiResult, setAiResult] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const { data: categoriesData, loading: loadingCategories } = useCategories()

  const canNext = [
    category !== '',
    true,
    location.lat !== null && location.lng !== null,
    detail.title !== '' &&
    detail.desc.length >= 20 &&
    detail.urgency !== '',
  ]
  const handleAnalyze = async (file) => {
  setLoadingAi(true);
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setAiResult(data);

    const urgencyMap = {
      'parah': 'kritikal',   // Jika AI bilang parah, set ke kritikal
      'sedang': 'sedang',    // Jika AI bilang sedang, set ke sedang
      'ringan': 'rendah'     // Jika AI bilang ringan, set ke rendah
    };
    
    // Opsional: Isi otomatis detail laporan berdasarkan AI
    setDetail(prev => ({
      ...prev,
      // desc: `Terdeteksi ${data.potholes} lubang, ${data.cracks} retakan.`,
      urgency: urgencyMap[data.severity]  || ''
    }));
  } catch (e) {
    console.error("AI Analysis Failed", e);
  } finally {
    setLoadingAi(false);
  }
};

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const formData = new FormData()

      formData.append('category_id', category)
      formData.append('title', detail.title)
      formData.append('description', detail.desc)

      formData.append('location_address', location.address)
      formData.append('kelurahan', location.kelurahan)
      formData.append('kecamatan', location.kecamatan)
      formData.append('latitude', location.lat)
      formData.append('longitude', location.lng)

      if (location.lat !== null) {
        formData.append('latitude', location.lat)
      }

      if (location.lng !== null) {
        formData.append('longitude', location.lng)
      }

      files.forEach(file => {
        formData.append('photos[]', file)
      })

      // Debug sementara
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }

      const res = await reportsApi.store(formData)

      setCreatedId(res?.data?.id ?? res?.id ?? null)
      setSubmitted(true)
    } 
    
    catch (err) {
  console.error(err)

  if (err?.data?.errors) {
    const firstError = Object.values(err.data.errors)[0]

    setSubmitError(
      Array.isArray(firstError)
        ? firstError[0]
        : 'Data laporan tidak valid'
    )
  } else {
    setSubmitError(
      err.message ?? 'Gagal mengirim laporan, coba lagi.'
    )
  }
}
    
    finally {
      setSubmitting(false)
    }
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
            <div className="flex gap-3 justify-center">
              {createdId && (
                <a href={`/laporan/${createdId}`} className="btn-secondary inline-flex">Lihat Laporan Saya</a>
              )}
              <a href="/peta-laporan" className="btn-primary inline-flex">Lihat di Peta</a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      {/* ── Mobile step indicator ── */}
      <div className="md:hidden px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-display font-bold text-primary">{STEPS[step]}</p>
          <p className="text-xs text-gray-400">{step + 1} / {STEPS.length}</p>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full flex-1 flex gap-8">

        {/* ── Sidebar stepper (desktop only) ── */}
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
        <div className="flex-1 card p-5 sm:p-8 md:p-10">
          {step === 0 && (
            <StepKategori
              selected={category}
              onSelect={setCategory}
              categoriesData={categoriesData}
              loadingCategories={loadingCategories}
            />
          )}
          {step === 1 && <StepUnggah files={files} onFiles={setFiles} aiResult={aiResult} loadingAi={loadingAi} onAnalyze={handleAnalyze} />}
          {step === 2 && <StepLokasi location={location} onChange={setLocation} />}
          {step === 3 && <StepDetail detail={detail} onChange={setDetail} />}

          {/* Submit error */}
          {submitError && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
              <AlertCircle size={16} /> {submitError}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
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
              disabled={!canNext[step] || submitting}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Mengirim...' : step === STEPS.length - 1 ? 'Kirim Laporan' : 'Lanjut'}
              {!submitting && <ArrowRight size={15} />}
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}