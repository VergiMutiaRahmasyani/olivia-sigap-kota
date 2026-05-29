import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ThumbsUp, Share2, MapPin, CheckCircle, Clock, Send, ExternalLink } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

// Mock data lengkap — nanti ganti dengan fetch by ID
const MOCK_REPORTS = [
  {
    id: 1,
    status: 'kritikal',
    danger: 'BAHAYA TINGGI',
    title: 'Lubang Jalan Besar (Jalur TransJ)',
    desc: 'Lubang sedalam 15cm di Jl. Gatot Subroto arah Semanggi membahayakan pengendara motor. Ditemukan kerusakan aspal yang cukup parah akibat pipa air bawah tanah yang pecah. Air terus mengalir hingga menggenangi jalan raya dan membahayakan pengendara motor.',
    location: 'Jakarta Selatan',
    address: 'Jl. Gatot Subroto, Kel. Semanggi',
    distance: '0.8 km',
    time: '2 jam yang lalu',
    pelapor: 'Budi Cahyono',
    validasi: 124,
    image: null, // ganti dengan import gambar jika ada
    riwayat: [
      { status: 'Diproses',       desc: 'Tim URC-02 telah tiba di lokasi.',          time: 'HARI INI, 10:45' },
      { status: 'Validasi Admin', desc: 'Laporan dikonfirmasi oleh sistem.',          time: 'HARI INI, 09:15' },
      { status: 'Terkirim',       desc: 'Laporan berhasil diunggah oleh warga.',      time: 'HARI INI, 09:02' },
    ],
    komentar: [
      {
        id: 1,
        nama: 'Agus Pratama',
        avatar: null,
        official: false,
        time: '45 menit yang lalu',
        text: 'Tadi saya lewat sana, tim teknis PDAM sudah sampai di lokasi. Arus lalu lintas sedikit tersendat.',
      },
      {
        id: 2,
        nama: 'Petugas SIGAP',
        avatar: 'SK',
        official: true,
        time: '15 menit yang lalu',
        text: 'Konfirmasi: Tim Unit Reaksi Cepat (URC) sedang melakukan penutupan katup air utama. Estimasi perbaikan 3-4 jam.',
      },
    ],
  },
  {
    id: 2,
    status: 'divalidasi',
    danger: null,
    title: 'Saluran Air Tersumbat',
    desc: 'Penumpukan sampah di gorong-gorong menyebabkan genangan saat hujan sedang. Kondisi ini sudah berlangsung selama 3 hari dan semakin parah.',
    location: 'Jakarta Timur',
    address: 'Jl. Pemuda, Kel. Rawamangun',
    distance: '3.2 km',
    time: '1 hari yang lalu',
    pelapor: 'Siti Rahayu',
    validasi: 56,
    image: null,
    riwayat: [
      { status: 'Validasi Admin', desc: 'Laporan dikonfirmasi oleh sistem.',     time: 'KEMARIN, 14:00' },
      { status: 'Terkirim',       desc: 'Laporan berhasil diunggah oleh warga.', time: 'KEMARIN, 13:45' },
    ],
    komentar: [],
  },
  {
    id: 3,
    status: 'proses',
    danger: null,
    title: 'Penerangan Jalan Mati',
    desc: 'Sepanjang 50 meter area taman tidak memiliki penerangan aktif di malam hari. Warga merasa tidak aman melewati area ini setelah gelap.',
    location: 'Jakarta Pusat',
    address: 'Jl. Thamrin, Kel. Menteng',
    distance: '1.5 km',
    time: '5 jam yang lalu',
    pelapor: 'Rudi Hartono',
    validasi: 89,
    image: null,
    riwayat: [
      { status: 'Diproses',       desc: 'Teknisi PLN dijadwalkan hari ini.',     time: 'HARI INI, 08:00' },
      { status: 'Validasi Admin', desc: 'Laporan dikonfirmasi oleh sistem.',     time: 'KEMARIN, 18:30' },
      { status: 'Terkirim',       desc: 'Laporan berhasil diunggah oleh warga.', time: 'KEMARIN, 18:15' },
    ],
    komentar: [],
  },
]

const STATUS_CLASS = {
  kritikal:   'badge-kritikal',
  divalidasi: 'badge-divalidasi',
  proses:     'badge-proses',
  selesai:    'badge-selesai',
}
const STATUS_TEXT = {
  kritikal: 'Kritikal', divalidasi: 'Divalidasi', proses: 'Diproses', selesai: 'Selesai'
}

export default function DetailLaporan() {
  const { id } = useParams()
  const report = MOCK_REPORTS.find(r => r.id === Number(id))
  const [komentar, setKomentar] = useState(report?.komentar ?? [])
  const [input, setInput] = useState('')
  const [validasi, setValidasi] = useState(report?.validasi ?? 0)
  const [sudahValidasi, setSudahValidasi] = useState(false)

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Laporan tidak ditemukan.</p>
            <Link to="/peta-laporan" className="btn-primary mt-4 inline-flex">Kembali ke Peta</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleKomentar = () => {
    if (!input.trim()) return
    setKomentar(prev => [...prev, {
      id: Date.now(),
      nama: 'Saya',
      avatar: null,
      official: false,
      time: 'Baru saja',
      text: input.trim(),
    }])
    setInput('')
  }

  const handleValidasi = () => {
    if (sudahValidasi) return
    setValidasi(v => v + 1)
    setSudahValidasi(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">

        {/* Back */}
        <Link to="/peta-laporan" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={15} /> Kembali
        </Link>

        <div className="grid md:grid-cols-[1fr_320px] gap-6">

          {/* ── Left column ── */}
          <div className="space-y-5">

            {/* Hero image */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-200">
              {report.image ? (
                <img src={report.image} alt={report.title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  [ Foto Laporan ]
                </div>
              )}
              {report.danger && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-danger text-white text-xs font-bold">
                  ⚠ {report.danger}
                </div>
              )}
            </div>

            {/* Info card */}
            <div className="card p-6 space-y-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">{report.title}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Dilaporkan oleh <span className="font-semibold text-gray-700">{report.pelapor}</span> · {report.time}
                  </p>
                </div>
                <span className={`badge ${STATUS_CLASS[report.status]} text-sm px-3 py-1.5`}>
                  Status: {STATUS_TEXT[report.status]}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">{report.desc}</p>

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
                  Validasi Laporan ({validasi})
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

              {/* Input */}
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">U</span>
                </div>
                <div className="flex-1 space-y-2">
                  <textarea
                    rows={3}
                    placeholder="Tulis komentar atau informasi tambahan..."
                    className="input-field resize-none text-sm"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button onClick={handleKomentar} className="btn-primary py-2 px-5 text-sm">
                      <Send size={13} /> Kirim
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments list */}
              <div className="space-y-4 pt-2">
                {komentar.map(k => (
                  <div key={k.id} className={`flex gap-3 ${k.official ? 'ml-6 pl-4 border-l-2 border-primary-100' : ''}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      k.official ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {k.avatar ?? k.nama[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-gray-800">{k.nama}</span>
                        {k.official && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-100 text-primary">OFFICIAL</span>
                        )}
                        <span className="text-xs text-gray-400">{k.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{k.text}</p>
                      <button className="text-xs text-primary font-semibold mt-1 hover:underline">Balas</button>
                    </div>
                  </div>
                ))}
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
                {report.address}
              </div>
              {/* Map placeholder */}
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
              <div className="space-y-3">
                {report.riwayat.map((r, i) => (
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
                      {i < report.riwayat.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className="text-sm font-bold text-gray-800">{r.status}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}