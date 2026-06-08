import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ThumbsUp, Share2, MapPin, CheckCircle, Clock, Send, ExternalLink, AlertCircle } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { useReport } from '../../hooks/useApi'
import { reports as reportsApi } from '../../services/api'

// ── Status helpers ───────────────────────────────────────────────────────────
const STATUS_CLASS = {
  kritikal: 'badge-kritikal', critical: 'badge-kritikal',
  divalidasi: 'badge-divalidasi', verified: 'badge-divalidasi', pending: 'badge-divalidasi',
  proses: 'badge-proses', in_progress: 'badge-proses',
  selesai: 'badge-selesai', resolved: 'badge-selesai',
}
const STATUS_TEXT = {
  kritikal: 'Kritikal', critical: 'Kritikal',
  divalidasi: 'Divalidasi', verified: 'Divalidasi', pending: 'Menunggu',
  proses: 'Diproses', in_progress: 'Diproses',
  selesai: 'Selesai', resolved: 'Selesai',
}

function getStatusClass(s) { return STATUS_CLASS[s] ?? 'badge-divalidasi' }
function getStatusText(s)  { return STATUS_TEXT[s]  ?? s }

// ── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-6" />
        <div className="grid md:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5">
            <div className="w-full aspect-[16/9] bg-gray-200 rounded-2xl" />
            <div className="card p-6 space-y-3">
              <div className="h-6 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-5 h-32" />
            <div className="card p-5 h-40" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function DetailLaporan() {
  const { id } = useParams()
  const { data: reportData, loading, error } = useReport(id)

  const [inputKomentar, setInputKomentar] = useState('')
  const [sudahValidasi, setSudahValidasi] = useState(false)
  const [validasiCount, setValidasiCount] = useState(null)
  const [sendingKomentar, setSendingKomentar] = useState(false)

  if (loading) return <Skeleton />

  if (error || !reportData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <AlertCircle size={40} className="text-red-400 mx-auto" />
            <p className="text-gray-500">{error ?? 'Laporan tidak ditemukan.'}</p>
            <Link to="/peta-laporan" className="btn-primary mt-4 inline-flex">Kembali ke Peta</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Normalisasi field dari backend
  const report = reportData?.report ?? reportData?.data ?? reportData
  const title       = report.title        ?? report.judul        ?? '(Tanpa judul)'
  const desc        = report.description  ?? report.deskripsi    ?? ''
  const location    = report.location     ?? report.lokasi       ?? '-'
  const address     = report.address      ?? report.alamat       ?? location
  const time        = report.created_at_human ?? report.time     ?? report.created_at ?? ''
  const pelapor     = report.reporter?.name ?? report.user?.name ?? report.pelapor    ?? 'Anonim'
  const status      = report.status       ?? 'pending'
  const danger      = report.danger_label ?? (status === 'kritikal' || status === 'critical' ? 'BAHAYA TINGGI' : null)
  const validations = validasiCount ?? report.validations ?? report.validasi ?? 0
  const riwayat     = report.history      ?? report.riwayat      ?? []
  const komentar    = report.comments     ?? report.komentar      ?? []
  const images      = report.images       ?? report.photos        ?? (report.image ? [report.image] : [])
  const mainImage   = images[0]           ?? null

  const handleValidasi = async () => {
    if (sudahValidasi) return
    try {
      const res = await reportsApi.submitFeedback(id, { is_valid: true })
      setValidasiCount(res?.validations ?? validations + 1)
      setSudahValidasi(true)
    } catch {
      setValidasiCount(validations + 1)
      setSudahValidasi(true)
    }
  }

  // Komentar belum ada endpoint tersendiri di api.php, pakai feedback sementara
  const handleKomentar = async () => {
    if (!inputKomentar.trim() || sendingKomentar) return
    setSendingKomentar(true)
    try {
      await reportsApi.submitFeedback(id, { comment: inputKomentar.trim() })
    } catch {
      // Tetap clear input meski gagal (UX)
    } finally {
      setInputKomentar('')
      setSendingKomentar(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">

        <Link to="/peta-laporan" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={15} /> Kembali
        </Link>

        <div className="grid md:grid-cols-[1fr_320px] gap-6">

          {/* ── Left column ── */}
          <div className="space-y-5">

            {/* Hero image */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-200">
              {mainImage ? (
                <img src={mainImage} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  [ Foto Laporan ]
                </div>
              )}
              {danger && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-danger text-white text-xs font-bold">
                  ⚠ {danger}
                </div>
              )}
            </div>

            {/* Info card */}
            <div className="card p-6 space-y-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Dilaporkan oleh <span className="font-semibold text-gray-700">{pelapor}</span> · {time}
                  </p>
                </div>
                <span className={`badge ${getStatusClass(status)} text-sm px-3 py-1.5`}>
                  Status: {getStatusText(status)}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <button
                  onClick={handleValidasi}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    sudahValidasi
                      ? 'bg-primary-50 border-primary text-primary'
                      : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  <ThumbsUp size={15} />
                  Validasi Laporan ({validations})
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary transition-all">
                  <Share2 size={15} />
                  Bagikan
                </button>
              </div>
            </div>

            {/* Diskusi */}
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Diskusi Komunitas ({komentar.length})</h2>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">U</span>
                </div>
                <div className="flex-1 space-y-2">
                  <textarea
                    rows={3}
                    placeholder="Tulis komentar atau informasi tambahan..."
                    className="input-field resize-none text-sm"
                    value={inputKomentar}
                    onChange={e => setInputKomentar(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleKomentar}
                      disabled={sendingKomentar || !inputKomentar.trim()}
                      className="btn-primary py-2 px-5 text-sm disabled:opacity-50"
                    >
                      <Send size={13} /> {sendingKomentar ? 'Mengirim...' : 'Kirim'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {komentar.map((k, idx) => {
                  const nama     = k.name    ?? k.nama    ?? k.user?.name ?? 'Anonim'
                  const official = k.is_official ?? k.official ?? false
                  const komTime  = k.created_at_human ?? k.time ?? k.created_at ?? ''
                  const text     = k.text    ?? k.comment ?? k.body ?? ''
                  return (
                    <div key={k.id ?? idx} className={`flex gap-3 ${official ? 'ml-6 pl-4 border-l-2 border-primary-100' : ''}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        official ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {(k.avatar ?? nama[0] ?? '?').toString().toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-gray-800">{nama}</span>
                          {official && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-100 text-primary">OFFICIAL</span>
                          )}
                          <span className="text-xs text-gray-400">{komTime}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{text}</p>
                        <button className="text-xs text-primary font-semibold mt-1 hover:underline">Balas</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* ── Right column ── */}
          <div className="space-y-4">

            {/* Lokasi */}
            <div className="card p-5 space-y-3">
              <p className="text-sm font-bold text-gray-700">Lokasi Kejadian</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-primary flex-shrink-0" />
                {address}
              </div>
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                  [ Mini Map ]
                </div>
                <button className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center">
                  <ExternalLink size={12} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Riwayat status */}
            <div className="card p-5 space-y-4">
              <p className="text-sm font-bold text-gray-700">Riwayat Status</p>
              {riwayat.length === 0 && (
                <p className="text-xs text-gray-400">Belum ada riwayat.</p>
              )}
              <div className="space-y-3">
                {riwayat.map((r, i) => {
                  const rStatus = r.status ?? r.label ?? '-'
                  const rDesc   = r.description ?? r.desc ?? r.note ?? ''
                  const rTime   = r.created_at_human ?? r.time ?? r.created_at ?? ''
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          i === 0 ? 'bg-primary' : 'bg-gray-200'
                        }`}>
                          {i === 0
                            ? <CheckCircle size={13} className="text-white" />
                            : <Clock size={13} className="text-gray-400" />
                          }
                        </div>
                        {i < riwayat.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="pb-3">
                        <p className="text-sm font-bold text-gray-800">{rStatus}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{rDesc}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{rTime}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}