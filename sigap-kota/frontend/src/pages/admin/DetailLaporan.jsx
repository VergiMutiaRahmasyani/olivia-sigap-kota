import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Share2, Printer, Zap, CheckCircle, Clock, Users, MapPin,
  MessageCircle, Eye, EyeOff, Trash2, Tag, XCircle, Phone,
  UserCheck, RefreshCw, ChevronRight, Flag, ExternalLink, Send,
  MoreVertical, Building2, AlertTriangle, Camera, AlertCircle, Loader
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useReport } from '../../hooks/useApi'
import { reports as reportsApi } from '../../services/api'

// ── Helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const MAP = {
    publik:     'bg-primary-50 text-primary',
    hidden:     'bg-gray-100 text-gray-500 border border-gray-200',
    irrelevant: 'bg-gray-100 text-gray-500 border border-gray-200',
    visible:    'bg-primary-50 text-primary',
  }
  const LABEL = { publik: 'PUBLIK', visible: 'PUBLIK', hidden: 'DISEMBUNYIKAN', irrelevant: 'TIDAK RELEVAN' }
  return (
    <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded tracking-wider ${MAP[status] ?? MAP.hidden}`}>
      {LABEL[status] ?? status?.toUpperCase() ?? '-'}
    </span>
  )
}

function ActionBtn({ icon: Icon, label, sub, variant = 'default', onClick, loading: busy }) {
  const base = 'flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-xs font-display font-semibold transition-colors min-w-[80px]'
  const styles = {
    default: 'border-gray-200 text-gray-600 hover:bg-gray-50',
    danger:  'border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200',
    dark:    'bg-gray-800 border-gray-800 text-white',
  }
  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick} disabled={busy}>
      {busy ? <Loader size={16} className="animate-spin" /> : <Icon size={16} />}
      <span>{label}</span>
      {sub && <span className="text-[10px] text-gray-400 font-normal leading-tight text-center">{sub}</span>}
    </button>
  )
}

function Skeleton() {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-8 w-56 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
          <div className="space-y-5">
            <div className="bg-white rounded-2xl h-48" />
            <div className="bg-white rounded-2xl h-32" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl h-64" />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function DetailLaporan() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const { data: reportData, loading, error, refetch } = useReport(id)

  const [waNumber, setWaNumber] = useState('')
  const [waSent,   setWaSent]   = useState(false)
  const [toast,    setToast]    = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [markingFake,    setMarkingFake]    = useState(false)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  if (loading) return <Skeleton />
  if (error || !reportData) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <AlertCircle size={40} className="text-red-400" />
          <p className="text-gray-500">{error ?? 'Laporan tidak ditemukan.'}</p>
          <button onClick={() => navigate('/admin/laporan')} className="btn-primary">
            Kembali ke Daftar
          </button>
        </div>
      </AdminLayout>
    )
  }

  // Normalisasi data
  const r         = reportData?.report ?? reportData?.data ?? reportData
  const reportId  = r.report_number ?? r.id
  const title     = r.title ?? r.judul ?? '(Tanpa judul)'
  const location  = r.location ?? r.lokasi ?? '-'
  const status    = r.status ?? 'pending'
  const score     = r.urgency_score ?? r.score ?? '-'
  const scoreDen  = r.urgency_max ?? 100
  const reportedAt = r.created_at_human ?? r.created_at ?? '-'
  const validations = r.validations ?? r.validasi ?? 0
  const instansi  = r.assigned_agency?.name ?? r.instansi ?? 'Belum ditentukan'
  const instansiWA = r.assigned_agency?.whatsapp ?? r.instansi_wa ?? waNumber
  const alertSentAt = r.alert_sent_at ?? '-'
  const similarArea = r.similar_in_area ?? r.similar_area ?? 0
  const mapLink   = r.map_link ?? `sigap.id/map/${reportId}`
  const comments  = r.comments ?? r.komentar ?? []
  const images    = r.images ?? r.photos ?? (r.image ? [r.image] : [])
  const isCritical = status === 'kritis' || status === 'critical' || (score !== '-' && score >= 80)

  // ── Update status ────────────────────────────────────────────────────────
  async function handleUpdateStatus(newStatus) {
    setUpdatingStatus(true)
    try {
      await reportsApi.updateStatus(id, { status: newStatus })
      showToast(`Status diperbarui: ${newStatus}`)
      refetch()
    } catch (err) {
      showToast(`Gagal: ${err.message}`)
    } finally {
      setUpdatingStatus(false)
    }
  }

  // ── Mark as fake ─────────────────────────────────────────────────────────
  async function handleMarkFake() {
    if (!window.confirm('Tandai laporan ini sebagai palsu? Laporan akan diarsipkan.')) return
    setMarkingFake(true)
    try {
      await reportsApi.updateStatus(id, { status: 'rejected', note: 'Laporan palsu' })
      showToast('Laporan ditandai sebagai palsu')
      setTimeout(() => navigate('/admin/laporan'), 1500)
    } catch (err) {
      showToast(`Gagal: ${err.message}`)
    } finally {
      setMarkingFake(false)
    }
  }

  // ── Send WA ──────────────────────────────────────────────────────────────
  function kirimWA() {
    const targetWA = instansiWA || waNumber
    if (!targetWA) { showToast('Nomor WA belum diisi'); return }
    const msg = encodeURIComponent(
      `🚨 LAPORAN PRIORITAS — SIGAP KOTA\n\nSkor urgensi: ${score}/${scoreDen}\nKategori: ${r.category?.name ?? '-'}\nLokasi: ${location}\nWaktu: ${reportedAt}\nLaporan serupa area: ${similarArea}\nValidasi warga: ${validations}\nLihat peta: https://${mapLink}`
    )
    const phone = targetWA.replace(/\D/g, '')
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
    setWaSent(true)
    showToast(`Pesan terkirim ke ${targetWA}`)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-display">
          <button onClick={() => navigate('/admin/laporan')} className="hover:text-primary transition-colors">
            Kelola Laporan
          </button>
          <ChevronRight size={12} />
          <span className="text-primary font-semibold">#{reportId}</span>
        </div>

        {/* Page header */}
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-display font-extrabold text-gray-900">Detail Laporan #{reportId}</h1>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 text-sm font-display font-semibold border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors bg-white">
              <Share2 size={15} /> Bagikan
            </button>
            <button className="flex items-center gap-2 text-sm font-display font-semibold bg-primary text-white rounded-xl px-4 py-2 hover:bg-primary/90 transition-colors">
              <Printer size={15} /> Cetak Berkas
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

          {/* ── LEFT ── */}
          <div className="space-y-5">

            {/* Report card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className={`${isCritical ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'} border-b p-5 flex justify-between items-start`}>
                <div>
                  <span className={`inline-block ${isCritical ? 'bg-red-500' : 'bg-orange-400'} text-white text-[10px] font-display font-bold px-2 py-0.5 rounded mb-2 tracking-wider`}>
                    ● {status.toUpperCase()}
                  </span>
                  <h2 className="text-lg font-display font-extrabold text-gray-900">{title}</h2>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin size={11} /> {location}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className={`text-4xl font-display font-extrabold ${isCritical ? 'text-red-500' : 'text-orange-400'} leading-none`}>
                    {score}<span className="text-lg text-gray-400">/{scoreDen}</span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 font-display">Skor Urgensi SIGAP</p>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex divide-x divide-gray-100 border-b border-gray-100">
                <div className="flex-1 px-5 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <Clock size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-display font-semibold">Dilaporkan</p>
                    <p className="text-sm font-display font-bold text-gray-800">{reportedAt}</p>
                  </div>
                </div>
                <div className="flex-1 px-5 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <Users size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-display font-semibold">Validasi Warga</p>
                    <p className="text-sm font-display font-bold text-gray-800">{validations} Verifikasi</p>
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="px-5 py-4 flex gap-3 flex-wrap">
                {images.slice(0, 2).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`foto-${i}`}
                    className="w-20 h-14 rounded-lg object-cover bg-gray-100"
                  />
                ))}
                {images.length === 0 && (
                  <div className="w-20 h-14 bg-stone-200 rounded-lg flex items-center justify-center text-stone-400">
                    <MapPin size={22} />
                  </div>
                )}
                {images.length > 2 && (
                  <button className="w-20 h-14 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-300 transition-colors">
                    <Camera size={16} />
                    <span className="text-[10px] mt-0.5">+{images.length - 2} Foto</span>
                  </button>
                )}
              </div>
            </div>

            {/* Routing card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                  <Zap size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-display font-extrabold text-primary uppercase tracking-wider">Routing Otomatis SIGAP</p>
                  <p className="text-xs text-gray-500 mt-0.5">Sistem telah meneruskan laporan ini berdasarkan klasifikasi AI.</p>
                </div>
              </div>

              <div className="bg-primary-50 border border-primary/20 rounded-xl p-4">
                <p className="text-[11px] text-gray-400 font-display font-semibold mb-1">Instansi Tujuan</p>
                <p className="text-sm font-display font-extrabold text-primary">{instansi}</p>
                {r.category?.name && (
                  <p className="text-xs text-primary/80 mt-1.5 flex items-center gap-1 font-semibold">
                    <CheckCircle size={12} /> Kategori: {r.category.name}
                  </p>
                )}
              </div>

              {alertSentAt !== '-' && (
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-1 border-t border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  Alert Terkirim Otomatis — {alertSentAt} — via WhatsApp Gateway
                </div>
              )}
            </div>

            {/* Moderasi Komentar */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MessageCircle size={15} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-gray-900">Moderasi Komentar ({comments.length})</p>
                  <p className="text-xs text-gray-400">Manajemen komentar warga untuk laporan ini.</p>
                </div>
              </div>

              {comments.length === 0 && (
                <p className="px-5 py-6 text-sm text-gray-400 text-center">Belum ada komentar.</p>
              )}

              {comments.map((c, i) => {
                const cStatus   = c.moderation_status ?? c.status ?? 'publik'
                const cName     = c.user?.name ?? c.name ?? c.nama ?? 'Anonim'
                const cInitials = cName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                const cTime     = c.created_at_human ?? c.time ?? c.created_at ?? ''
                const cText     = c.body ?? c.text ?? c.comment ?? ''

                return (
                  <div key={c.id ?? i} className={`px-5 py-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-[11px] font-display font-bold text-primary shrink-0">
                          {cInitials || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-display font-semibold text-gray-800">{cName}</p>
                          <p className="text-[11px] text-gray-400">{cTime}</p>
                        </div>
                      </div>
                      <StatusBadge status={cStatus} />
                    </div>

                    <p className={`text-sm leading-relaxed mb-3 ${cStatus !== 'publik' && cStatus !== 'visible' ? 'text-gray-400 italic' : 'text-gray-700'}`}>
                      {cText}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      {(cStatus === 'publik' || cStatus === 'visible') && (
                        <>
                          <ActionBtn icon={EyeOff}  label="Sembunyikan"   sub="Sembunyikan dari publik"  onClick={() => showToast('Fitur moderasi dalam pengembangan')} />
                          <ActionBtn icon={Trash2}  label="Hapus"         sub="Hapus dari sistem"        variant="danger" onClick={() => showToast('Fitur hapus dalam pengembangan')} />
                          <ActionBtn icon={XCircle} label="Tidak Relevan" sub="Beri label tidak terkait" onClick={() => showToast('Fitur label dalam pengembangan')} />
                        </>
                      )}
                      {(cStatus === 'hidden') && (
                        <>
                          <ActionBtn icon={Eye}    label="Tampilkan"   sub="Tampilkan ke publik"  onClick={() => showToast('Fitur moderasi dalam pengembangan')} />
                          <ActionBtn icon={Trash2} label="Hapus"       sub="Hapus dari sistem"    variant="danger" onClick={() => showToast('Fitur hapus dalam pengembangan')} />
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="space-y-4">

            {/* WA Panel */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-primary px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Building2 size={17} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-display font-bold text-white">{instansi}</p>
                    <p className="text-[10px] text-white/80 font-semibold">ADMIN DISPATCH</p>
                  </div>
                </div>
                <MoreVertical size={18} className="text-white/70" />
              </div>

              <div className="bg-[#ECE5DD] p-3.5 min-h-[180px]">
                <div className="bg-white rounded-xl rounded-tl-sm p-3 shadow-sm max-w-[95%]">
                  <p className="text-[10px] font-display font-extrabold text-red-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <AlertTriangle size={11} /> LAPORAN PRIORITAS — SIGAP KOTA
                  </p>
                  {[
                    ['Skor urgensi',       `${score}/${scoreDen}`],
                    ['Kategori',           r.category?.name ?? '-'],
                    ['Lokasi',             location],
                    ['Waktu',              reportedAt],
                    ['Laporan serupa',     String(similarArea)],
                    ['Validasi warga',     String(validations)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-[11px] mb-0.5">
                      <span className="text-gray-400 w-28 shrink-0">{k}:</span>
                      <span className="font-semibold text-gray-800">{v}</span>
                    </div>
                  ))}
                  {waSent && <p className="text-[10px] text-gray-400 text-right mt-2">Terkirim ✓✓</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border-t border-gray-100">
                <input
                  type="text"
                  value={instansiWA || waNumber}
                  onChange={e => setWaNumber(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 text-xs font-display outline-none focus:border-primary transition-colors"
                  placeholder="Nomor WA tujuan..."
                />
                <button
                  onClick={kirimWA}
                  className="w-9 h-9 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
                >
                  <Send size={15} className="text-white" />
                </button>
              </div>
            </div>

            {/* Admin nav */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <p className="text-[10px] font-display font-extrabold text-gray-400 uppercase tracking-widest">Navigasi Admin</p>
              </div>
              {[
                { icon: RefreshCw,  label: 'Tandai Sedang Diproses', action: () => handleUpdateStatus('in_progress') },
                { icon: CheckCircle,label: 'Tandai Selesai',         action: () => handleUpdateStatus('resolved') },
                { icon: UserCheck,  label: 'Delegasi Manual',        action: () => showToast('Delegasi manual dalam pengembangan') },
                { icon: Phone,      label: 'Hubungi Instansi',       action: () => kirimWA() },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 disabled:opacity-50"
                  onClick={action}
                  disabled={updatingStatus}
                >
                  <span className="flex items-center gap-2.5 text-sm font-display font-semibold text-gray-700">
                    {updatingStatus ? <Loader size={16} className="animate-spin text-gray-400" /> : <Icon size={16} className="text-gray-500" />}
                    {label}
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              ))}
            </div>

            {/* Tandai palsu */}
            <button
              disabled={markingFake}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors text-white text-sm font-display font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"
              onClick={handleMarkFake}
            >
              {markingFake ? <Loader size={15} className="animate-spin" /> : <Flag size={15} />}
              Tandai Laporan Palsu
            </button>

            {/* Mini map */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden relative h-28">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(rgba(100,100,80,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(100,100,80,.12) 1px,transparent 1px)',
                  backgroundSize: '30px 30px',
                  backgroundColor: '#E8EAD8',
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
                <div className="bg-red-500 text-white text-[10px] font-display font-bold px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap shadow-md">
                  <AlertTriangle size={10} /> #{reportId}
                </div>
                <div className="w-0.5 h-3 bg-red-500 mx-auto" />
              </div>
              <button className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                <ExternalLink size={12} className="text-gray-500" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm font-display font-semibold px-4 py-3 rounded-xl flex items-center gap-2 shadow-xl z-50">
          <CheckCircle size={15} className="text-primary" /> {toast}
        </div>
      )}
    </AdminLayout>
  )
}