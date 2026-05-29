import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Share2, Printer, Zap, CheckCircle, Clock, Users, MapPin,
  MessageCircle, Eye, EyeOff, Trash2, Tag, XCircle, Phone,
  UserCheck, RefreshCw, ChevronRight, Flag, ExternalLink, Send,
  MoreVertical, Building2, AlertTriangle, Camera
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'

// ── Dummy data ─────────────────────────────────────────────────────────────
const REPORT_DATA = {
  id: 'REP-8821',
  status: 'kritis',
  title: 'Jalan Rusak & Lubang Dalam',
  location: 'Jl. Soekarno-Hatta, Kedungwaru, Kota Kediri',
  score: 82,
  reportedAt: '18 Mei 2025, 14:30',
  validations: 47,
  instansi: 'Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)',
  instansiWA: '+62 812-XXXX-7721',
  alertSentAt: '18 Mei 2025, 14:33 WIB',
  similarArea: 12,
  mapLink: 'sigap.id/map/8821',
}

const INITIAL_COMMENTS = [
  {
    id: 1,
    name: 'Budi Santoso',
    initials: 'BS',
    time: '18 Mei 2025, 14:45',
    text: 'Lubang ini sudah ada sejak 2 minggu lalu, sangat berbahaya di malam hari karena penerangan jalan minim.',
    status: 'publik', // publik | hidden | irrelevant
  },
  {
    id: 2,
    name: 'Andi Wijaya',
    initials: 'AW',
    time: '18 Mei 2025, 15:10',
    text: 'Jualan pulsa murah meriah, cek profil saya kak!',
    status: 'irrelevant',
  },
]

// ── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const MAP = {
    publik:     'bg-primary-50 text-primary',
    hidden:     'bg-gray-100 text-gray-500 border border-gray-200',
    irrelevant: 'bg-gray-100 text-gray-500 border border-gray-200',
  }
  const LABEL = { publik: 'PUBLIK', hidden: 'DISEMBUNYIKAN', irrelevant: 'TIDAK RELEVAN' }
  return (
    <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded tracking-wider ${MAP[status]}`}>
      {LABEL[status]}
    </span>
  )
}

function ActionBtn({ icon: Icon, label, sub, variant = 'default', onClick }) {
  const base = 'flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-xs font-display font-semibold transition-colors min-w-[80px]'
  const styles = {
    default: 'border-gray-200 text-gray-600 hover:bg-gray-50',
    danger:  'border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200',
    dark:    'bg-gray-800 border-gray-800 text-white',
  }
  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick}>
      <Icon size={16} />
      <span>{label}</span>
      {sub && <span className="text-[10px] text-gray-400 font-normal leading-tight text-center">{sub}</span>}
    </button>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function DetailLaporan() {
  const { id } = useParams()
  const navigate = useNavigate()

  const report = REPORT_DATA // in real app: fetch by id
  const [waNumber, setWaNumber] = useState(report.instansiWA)
  const [waSent, setWaSent] = useState(false)
  const [comments, setComments] = useState(INITIAL_COMMENTS)
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function kirimWA() {
    // Buka WA ke nomor pemerintah dengan pesan laporan
    const msg = encodeURIComponent(
      `🚨 LAPORAN PRIORITAS — SafeRoute\n\nSkor urgensi: ${report.score}/100 (Kritis)\nKategori: Jalan Rusak\nLokasi: ${report.location}\nWaktu: ${report.reportedAt} WIB\nLaporan serupa area: ${report.similarArea}\nValidasi warga: ${report.validations}\nLihat peta: https://${report.mapLink}`
    )
    const phone = waNumber.replace(/\D/g, '')
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
    setWaSent(true)
    showToast(`Pesan terkirim ke ${waNumber}`)
  }

  function updateComment(id, status) {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }

  function deleteComment(id) {
    if (window.confirm('Hapus komentar ini secara permanen dari sistem?')) {
      setComments(prev => prev.filter(c => c.id !== id))
      showToast('Komentar dihapus permanen')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 page-enter">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-display">
          <button onClick={() => navigate('/admin/laporan')} className="hover:text-primary transition-colors">
            Kelola Laporan
          </button>
          <ChevronRight size={12} />
          <span className="text-primary font-semibold">#{report.id}</span>
        </div>

        {/* Page header */}
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-display font-extrabold text-gray-900">Detail Laporan #{report.id}</h1>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 text-sm font-display font-semibold border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors">
              <Share2 size={15} /> Bagikan
            </button>
            <button className="flex items-center gap-2 text-sm font-display font-semibold bg-primary text-white rounded-xl px-4 py-2 hover:bg-primary/90 transition-colors">
              <Printer size={15} /> Cetak Berkas
            </button>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">

            {/* Report card */}
            <div className="card overflow-hidden">
              <div className="bg-red-50 border-b border-red-100 p-5 flex justify-between items-start">
                <div>
                  <span className="inline-block bg-red-500 text-white text-[10px] font-display font-bold px-2 py-0.5 rounded mb-2 tracking-wider">
                    ● KRITIS
                  </span>
                  <h2 className="text-lg font-display font-extrabold text-gray-900">{report.title}</h2>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin size={11} /> {report.location}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-4xl font-display font-extrabold text-red-500 leading-none">
                    {report.score}<span className="text-lg text-gray-400">/100</span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 font-display">Skor Urgensi SafeRoute</p>
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
                    <p className="text-sm font-display font-bold text-gray-800">{report.reportedAt}</p>
                  </div>
                </div>
                <div className="flex-1 px-5 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <Users size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-display font-semibold">Validasi Warga</p>
                    <p className="text-sm font-display font-bold text-gray-800">{report.validations} Verifikasi Positif</p>
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="px-5 py-4 flex gap-3">
                <div className="w-20 h-14 bg-stone-200 rounded-lg flex items-center justify-center text-stone-400">
                  <MapPin size={22} />
                </div>
                <div className="w-20 h-14 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                  <MapPin size={22} />
                </div>
                <button className="w-20 h-14 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-300 transition-colors">
                  <Camera size={16} />
                  <span className="text-[10px] mt-0.5">Lihat Semua (5)</span>
                </button>
              </div>
            </div>

            {/* Routing card */}
            <div className="card p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                  <Zap size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-display font-extrabold text-primary uppercase tracking-wider">Routing Otomatis SafeRoute</p>
                  <p className="text-xs text-gray-500 mt-0.5">Sistem telah meneruskan laporan ini berdasarkan klasifikasi AI.</p>
                </div>
              </div>

              <div className="bg-primary-50 border border-primary/20 rounded-xl p-4">
                <p className="text-[11px] text-gray-400 font-display font-semibold mb-1">Instansi Tujuan</p>
                <p className="text-sm font-display font-extrabold text-primary">{report.instansi}</p>
                <p className="text-xs text-primary/80 mt-1.5 flex items-center gap-1 font-semibold">
                  <CheckCircle size={12} /> Kategori Terdeteksi: Jalan Rusak
                  <span className="text-gray-400 font-normal">(Akurasi 98%)</span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 pt-1 border-t border-gray-100">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                Alert Terkirim Otomatis — {report.alertSentAt} — via WhatsApp Gateway
              </div>
            </div>

            {/* Moderasi Komentar */}
            <div className="card overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MessageCircle size={15} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-gray-900">Moderasi Komentar</p>
                  <p className="text-xs text-gray-400">Manajemen komentar warga untuk laporan ini.</p>
                </div>
              </div>

              {comments.map((c, i) => (
                <div key={c.id} className={`px-5 py-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-[11px] font-display font-bold text-primary shrink-0">
                        {c.initials}
                      </div>
                      <div>
                        <p className="text-sm font-display font-semibold text-gray-800">{c.name}</p>
                        <p className="text-[11px] text-gray-400">{c.time}</p>
                      </div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>

                  {/* Comment text */}
                  <p className={`text-sm leading-relaxed mb-3 ${c.status !== 'publik' ? 'text-gray-400 italic' : 'text-gray-700'}`}>
                    {c.text}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {c.status === 'publik' && (
                      <>
                        <ActionBtn icon={EyeOff}  label="Sembunyikan"   sub="Sembunyikan dari publik" onClick={() => { updateComment(c.id, 'hidden');     showToast('Komentar disembunyikan') }} />
                        <ActionBtn icon={Trash2}   label="Hapus Permanen" sub="Hapus dari sistem"      variant="danger" onClick={() => deleteComment(c.id)} />
                        <ActionBtn icon={XCircle}  label="Tidak Relevan"  sub="Beri label tidak terkait" onClick={() => { updateComment(c.id, 'irrelevant'); showToast('Komentar diberi label tidak relevan') }} />
                      </>
                    )}
                    {c.status === 'hidden' && (
                      <>
                        <ActionBtn icon={Eye}    label="Tampilkan"     sub="Tampilkan ke publik"  onClick={() => { updateComment(c.id, 'publik'); showToast('Komentar ditampilkan') }} />
                        <ActionBtn icon={Trash2} label="Hapus Permanen" sub="Hapus dari sistem"  variant="danger" onClick={() => deleteComment(c.id)} />
                      </>
                    )}
                    {c.status === 'irrelevant' && (
                      <>
                        <ActionBtn icon={Eye}    label="Tampilkan"       sub="Tampilkan ke publik"        onClick={() => { updateComment(c.id, 'publik'); showToast('Komentar ditampilkan') }} />
                        <ActionBtn icon={Trash2} label="Hapus Permanen"  sub="Hapus dari sistem"          variant="danger" onClick={() => deleteComment(c.id)} />
                        <ActionBtn icon={Tag}    label="Batalkan Label"  sub="Hapus tanda tidak relevan"  variant="dark"   onClick={() => { updateComment(c.id, 'publik'); showToast('Label dibatalkan') }} />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-4">

            {/* WA Panel */}
            <div className="card overflow-hidden">
              {/* WA Header */}
              <div className="bg-primary px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Building2 size={17} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-display font-bold text-white">PUPR Kota Kediri</p>
                    <p className="text-[10px] text-white/80 font-semibold">ONLINE · ADMIN DISPATCH</p>
                  </div>
                </div>
                <MoreVertical size={18} className="text-white/70" />
              </div>

              {/* Chat bubble */}
              <div className="bg-[#ECE5DD] p-3.5 min-h-[180px]">
                <div className="bg-white rounded-xl rounded-tl-sm p-3 shadow-sm max-w-[95%]">
                  <p className="text-[10px] font-display font-extrabold text-red-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <AlertTriangle size={11} /> LAPORAN PRIORITAS — SafeRoute
                  </p>
                  {[
                    ['Skor urgensi', `${report.score}/100 (Kritis)`],
                    ['Kategori', 'Jalan Rusak'],
                    ['Lokasi', 'Jl. Soekarno-Hatta, Kedungwaru'],
                    ['Waktu', `${report.reportedAt} WIB`],
                    ['Laporan serupa area', String(report.similarArea)],
                    ['Validasi warga', String(report.validations)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-[11px] mb-0.5">
                      <span className="text-gray-400 w-28 shrink-0">{k}:</span>
                      <span className="font-semibold text-gray-800">{v}</span>
                    </div>
                  ))}
                  <div className="flex gap-2 text-[11px] mt-0.5">
                    <span className="text-gray-400 w-28 shrink-0">Lihat peta:</span>
                    <span className="text-primary font-semibold underline">{report.mapLink}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 text-right mt-2">14:33 ✓✓</p>
                </div>
                <div className="text-center text-[10px] text-gray-500 mt-2 font-semibold">HARI INI</div>
              </div>

              {/* Input row */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border-t border-gray-100">
                <input
                  type="text"
                  value={waNumber}
                  onChange={e => setWaNumber(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 text-xs font-display outline-none focus:border-primary transition-colors"
                  placeholder="Nomor WA tujuan..."
                />
                <button
                  onClick={kirimWA}
                  className="w-9 h-9 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
                  aria-label="Kirim WhatsApp"
                >
                  <Send size={15} className="text-white" />
                </button>
              </div>
            </div>

            {/* Admin nav */}
            <div className="card overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <p className="text-[10px] font-display font-extrabold text-gray-400 uppercase tracking-widest">Navigasi Admin</p>
              </div>
              {[
                { icon: RefreshCw,  label: 'Update Status Laporan' },
                { icon: UserCheck,  label: 'Delegasi Manual'        },
                { icon: Phone,      label: 'Hubungi Instansi (PUPR)' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  onClick={() => showToast(`${label} dibuka`)}
                >
                  <span className="flex items-center gap-2.5 text-sm font-display font-semibold text-gray-700">
                    <Icon size={16} className="text-gray-500" /> {label}
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              ))}
            </div>

            {/* Tandai palsu */}
            <button
              className="w-full bg-red-500 hover:bg-red-600 transition-colors text-white text-sm font-display font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"
              onClick={() => {
                if (window.confirm('Tandai laporan ini sebagai palsu? Laporan akan diarsipkan.')) {
                  showToast('Laporan ditandai sebagai palsu')
                  setTimeout(() => navigate('/admin/laporan'), 1500)
                }
              }}
            >
              <Flag size={15} /> Tandai Laporan Palsu
            </button>

            {/* Mini map */}
            <div className="card overflow-hidden relative h-28">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(rgba(100,100,80,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(100,100,80,.12) 1px,transparent 1px)',
                  backgroundSize: '30px 30px',
                  backgroundColor: '#E8EAD8',
                }}
              />
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 112">
                <line x1="0" y1="56" x2="300" y2="56" stroke="#C8C4A8" strokeWidth="8" opacity=".5"/>
                <line x1="150" y1="0" x2="150" y2="112" stroke="#C8C4A8" strokeWidth="5" opacity=".4"/>
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
                <div className="bg-red-500 text-white text-[10px] font-display font-bold px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap shadow-md">
                  <AlertTriangle size={10} /> #REP-8821
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
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm font-display font-semibold px-4 py-3 rounded-xl flex items-center gap-2 shadow-xl z-50 animate-fade-in">
          <CheckCircle size={15} className="text-primary" /> {toast}
        </div>
      )}
    </AdminLayout>
  )
}