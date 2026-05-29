import { Link } from 'react-router-dom'
import { Map, Plus, FileText, Cpu, Users, TrendingUp, ArrowRight } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import EmergencyButton from '../../components/common/EmergencyButton'
import jakartaImg from '../../assets/jakarta.jpg'
import cardmapImg from '../../assets/cardmap.jpg'

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ value, label }) {
  return (
    <div className="flex-1 text-center py-8 px-4 border-r border-gray-100 last:border-r-0">
      <p className="text-4xl font-display font-extrabold text-primary">{value}</p>
      <p className="text-xs font-display font-semibold text-gray-400 tracking-widest uppercase mt-1">
        {label}
      </p>
    </div>
  )
}

// ─── How It Works Card ────────────────────────────────────────────────────────
function StepCard({ step, icon: Icon, title, desc }) {
  return (
    <div className="card p-6 space-y-4">
      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
        <Icon size={22} className="text-primary" />
      </div>
      <div>
        <p className="text-xs font-display font-bold text-primary tracking-widest uppercase mb-1">
          {step}
        </p>
        <h3 className="text-base font-display font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">

          {/* Left copy */}
          <div className="space-y-6 page-enter">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary text-xs font-display font-semibold">
              Platform Kolaborasi Sipil Terpercaya
            </span>

            <h1 className="text-4xl md:text-5xl font-display font-extrabold leading-tight text-gray-900">
              Membangun Kota yang{' '}
              <span className="text-primary">Lebih Aman</span>{' '}
              dan Tangguh Bersama
            </h1>

            <p className="text-gray-500 leading-relaxed max-w-md">
              SIGAP KOTA menghubungkan warga dengan pemerintah untuk penyelesaian masalah
              perkotaan yang cepat, transparan, dan berbasis data demi mewujudkan
              Sustainable Development Goals.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/peta-laporan" className="btn-primary">
                <Map size={16} />
                Lihat Peta
              </Link>
              <Link to="/buat-laporan" className="btn-secondary">
                <Plus size={16} />
                Mulai Lapor
              </Link>
            </div>

            {/* SDG badge */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 bg-amber-500 rounded flex items-center justify-center text-white font-display font-extrabold text-sm">
                11
              </div>
              <div>
                <p className="text-xs font-display font-bold text-gray-700">Mendukung SDG 11</p>
                <p className="text-xs text-gray-400">Kota dan Pemukiman yang Berkelanjutan</p>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative hidden md:block">
            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden">
              <img
                src={jakartaImg}
                alt="Kota Jakarta"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating stat pill */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-5 py-3 border border-gray-100">
              <p className="text-xs text-gray-400">Laporan diselesaikan hari ini</p>
              <p className="text-2xl font-extrabold text-primary">42</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0">
            <StatCard value="10"   label="Laporan Selesai" />
            <StatCard value="35+"  label="Warga Aktif" />
            <StatCard value="78%"  label="Wilayah Tercover" />
          </div>
        </div>
      </section>

      {/* ── Cara Kerja ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-extrabold text-gray-900">Cara Kerja Sigap Kota</h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Sistem pelaporan cerdas yang memastikan setiap suara warga didengar
            dan ditindaklanjuti secara presisi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <StepCard
            step="01. Pelaporan"
            icon={FileText}
            title="Laporkan Masalah"
            desc="Unggah foto dan lokasi masalah infrastruktur atau layanan publik melalui aplikasi secara instan."
          />
          <StepCard
            step="02. Analisis AI"
            icon={Cpu}
            title="AI Hitung Urgensi"
            desc="Algoritma AI memverifikasi laporan dan menentukan skala prioritas berdasarkan tingkat bahaya dan dampak."
          />
          <StepCard
            step="03. Eksekusi"
            icon={Users}
            title="Pemerintah Bertindak"
            desc="Dinas terkait menerima perintah kerja otomatis dan menyelesaikan masalah sesuai timeline yang transparan."
          />
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 w-full">
        <div className="bg-gray-800 rounded-3xl overflow-hidden grid md:grid-cols-2">
          <div className="p-10 md:p-12 space-y-5 flex flex-col justify-center">
            <h2 className="text-3xl font-display font-extrabold text-white leading-tight">
              Siap Berkontribusi untuk Lingkungan Anda?
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Bergabunglah dengan ribuan warga SIGAP KOTA lainnya. Setiap laporan Anda
              adalah satu langkah menuju kota yang lebih inklusif dan layak huni.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/daftar" className="btn-primary">
                Mulai Sekarang
                <ArrowRight size={15} />
              </Link>
              <Link to="/tentang-kami" className="btn-secondary !border-gray-600 !text-gray-300 hover:!bg-gray-700">
                Pelajari Alur Kerja
              </Link>
            </div>
          </div>

        {/* Right visual */}
        <div className="hidden md:flex items-center justify-center overflow-hidden max-h-[320px]">
          <img
            src={cardmapImg}
            alt="Aplikasi SIGAP KOTA"
            className="w-full h-full object-cover object-center"
          />
        </div>
        </div>
      </section>

      <Footer />

      {/* ── Floating Emergency Button ── */}
      <EmergencyButton />
    </div>
  )
}