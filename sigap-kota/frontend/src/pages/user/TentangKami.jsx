import { Mail, Eye, Users, Shield, BarChart2, FileText, Cpu, Building2 } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Sdg11 from '../../assets/sdg-11.png'
import ImgTsalits from '../../assets/Tsalits.jpg'
import ImgVergi from '../../assets/Vergi.jpg'
import ImgAlya from '../../assets/Alya.jpeg'

// ── Data ─────────────────────────────────────────────────────────────────────
const CARA_KERJA = [
  {
    icon: FileText,
    title: 'Warga Lapor',
    desc: 'Ambil foto kerusakan, tentukan lokasi di peta, dan kirim laporan dalam hitungan detik melalui aplikasi.',
  },
  {
    icon: Cpu,
    title: 'AI Prioritaskan',
    desc: 'Sistem AI kami menganalisis tingkat urgensi laporan berdasarkan lokasi dan jenis kerusakan secara otomatis.',
  },
  {
    icon: Building2,
    title: 'Pemerintah Tangani',
    desc: 'Instansi terkait menerima data yang sudah terstruktur untuk melakukan perbaikan dengan efisiensi tinggi.',
  },
]

const NILAI = [
  { icon: Eye,      color: 'text-primary', label: 'Transparan',    desc: 'Setiap perkembangan laporan dapat dipantau oleh publik guna menjamin keterbukaan informasi.' },
  { icon: BarChart2, color: 'text-primary', label: 'Berbasis Data', desc: 'Keputusan perbaikan diambil berdasarkan data nyata di lapangan dan analisis tingkat urgensi.' },
  { icon: Users,    color: 'text-primary', label: 'Partisipatif',  desc: 'Mendorong keterlibatan aktif masyarakat sebagai mata dan telinga dalam pembangunan kota.' },
  { icon: Shield,   color: 'text-primary', label: 'Akuntabel',     desc: 'Menjamin setiap laporan ditangani secara profesional oleh pihak yang berwenang.' },
]

const TIM = [
  { name: 'Tsalits Habibil M', role: 'Back End Developer', badge: 'AI Engineer',        img: ImgTsalits },
  { name: 'Vergi Mutia R',     role: 'UI Design',          badge: 'Front-End Developer', img: ImgVergi   },
  { name: 'Alya Faadilah P',   role: 'Project Management', badge: null,                  img: ImgAlya    },
]

// ── Avatar placeholder ────────────────────────────────────────────────────────
function Avatar({ name, img }) {
  if (img) {
    return (
      <img
        src={img}
        alt={name}
        className="w-24 h-24 rounded-2xl object-cover object-top mx-auto mb-3"
      />
    )
  }
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('')
  return (
    <div className="w-24 h-24 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-3">
      <span className="text-2xl font-display font-extrabold text-primary">{initials}</span>
    </div>
  )
}

export default function TentangKami() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#e8ede8] py-24 px-4 text-center">
        {/* Grid pattern SVG background */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2d6a4f" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-primary leading-tight">
            Suara warga,<br />Aksi nyata.
          </h1>
          <p className="mt-5 text-gray-600 leading-relaxed text-sm sm:text-base">
            SIGAP KOTA adalah platform pelaporan infrastruktur kota berbasis peta yang menghubungkan
            warga langsung dengan instansi pemerintah terkait — didukung AI untuk memastikan
            masalah yang paling mendesak ditangani lebih cepat.
          </p>
        </div>
      </section>

      {/* ── Misi ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-gray-900 mb-4 leading-snug">
            Menjembatani<br />Kesenjangan Komunikasi
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm mb-4">
            Seringkali, masalah infrastruktur harian seperti lubang jalan yang membahayakan atau lampu
            jalan yang mati di area rawan kriminalitas luput dari perhatian pemerintah. Warga merasa
            suaranya tidak terdengar, sementara instansi terkadang kewalahan memproses ribuan laporan
            manual tanpa sistem prioritas yang jelas.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm">
            SIGAP KOTA hadir untuk menutup celah tersebut. Kami percaya bahwa setiap laporan adalah
            data berharga bagi pembangunan kota. Dengan mendigitalisasi proses pelaporan secara
            transparan, kita menciptakan siklus kepercayaan baru antara masyarakat dan pengelola kota.
          </p>
        </div>
        {/* Ilustrasi tangan */}
        <div className="rounded-2xl overflow-hidden bg-primary-100 h-64 flex items-center justify-center">
          <div className="text-center text-primary opacity-40">
            <Users size={64} />
            <p className="text-xs mt-2 font-display font-semibold">Kolaborasi Warga & Pemerintah</p>
          </div>
        </div>
      </section>

      {/* ── SDG 11 ── */}
      <section className="bg-gray-50 py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <img
            src={Sdg11}
            alt="SDG 11 - Sustainable Cities and Communities"
            className="w-30 h-30 rounded-xl mx-auto mb-5"
          />
          <h2 className="text-2xl font-display font-extrabold text-gray-900 mb-3">
            Mewujudkan SDG 11: Kota yang Berkelanjutan
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            SIGAP KOTA berakar pada misi global Sustainable Development Goal 11. Kami berupaya
            menjadikan kota dan pemukiman manusia inklusif, aman, tangguh, dan berkelanjutan
            melalui partisipasi aktif warga dalam menjaga infrastruktur publik.
          </p>
        </div>
      </section>

      {/* ── Cara Kerja ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-display font-extrabold text-gray-900 text-center mb-10">
          Cara Kerja Platform
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {CARA_KERJA.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto">
                <Icon size={22} className="text-primary" />
              </div>
              <p className="font-display font-bold text-gray-900">{title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Nilai-Nilai ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-display font-extrabold text-gray-900 text-center mb-10">
            Nilai-Nilai Utama
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {NILAI.map(({ icon: Icon, color, label, desc }) => (
              <div key={label} className="card p-5 flex gap-4 items-start">
                <Icon size={18} className={`${color} mt-0.5 shrink-0`} />
                <div>
                  <p className={`text-sm font-display font-bold ${color} mb-1`}>{label}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tim Pengembang ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-display font-extrabold text-gray-900 text-center mb-2">
          Tim Pengembang
        </h2>
        <p className="text-center text-sm text-gray-500 mb-10">
          Inovasi ini lahir dari kolaborasi akademisi dan praktisi teknologi.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-6">
          {TIM.map(({ name, role, badge, img }) => (
              <div key={name} className="text-center">
                <Avatar name={name} img={img} />
                <p className="font-display font-bold text-gray-900 text-sm">{name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{role}</p>
                {badge && (
                  <span className="inline-block mt-1.5 text-xs font-display font-semibold text-primary bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </div>
            ))}
        </div>

        {/* Dosen & Institusi */}
        <div className="card p-5 grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div className="pb-4 sm:pb-0 sm:pr-6">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-display font-semibold mb-1">Dosen Pembimbing</p>
            <p className="text-sm font-display font-bold text-gray-800">Dimas Novian Aditia Syahputra, S.Tr.T., M.Tr.T.</p>
          </div>
          <div className="pt-4 sm:pt-0 sm:pl-6">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-display font-semibold mb-1">Institusi</p>
            <p className="text-sm font-display font-bold text-gray-800">Universitas Negeri Surabaya</p>
          </div>
        </div>
      </section>

      {/* ── Kontak & Kemitraan ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 grid sm:grid-cols-2 gap-5">
        {/* Untuk Warga */}
        <div className="card p-6">
          <h3 className="text-lg font-display font-extrabold text-gray-900 mb-2">Untuk Warga</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Ada pertanyaan atau butuh bantuan dalam menggunakan aplikasi? Hubungi tim dukungan kami.
          </p>
          <a
            href="mailto:lapor@sigapkota.go.id"
            className="inline-flex items-center gap-2 text-sm font-display font-semibold text-primary hover:underline"
          >
            <Mail size={14} />
            lapor@sigapkota.go.id
          </a>
        </div>

        {/* Kemitraan Instansi */}
        <div className="card p-6 bg-primary text-white">
          <h3 className="text-lg font-display font-extrabold mb-2">Kemitraan Instansi</h3>
          <p className="text-sm text-white/80 leading-relaxed mb-4">
            Ingin mengintegrasikan data wilayah Anda ke dalam sistem SIGAP KOTA? Mari berkolaborasi.
          </p>
          <a
            href="mailto:mitra@sigapkota.go.id"
            className="inline-flex items-center gap-2 text-sm font-display font-semibold text-white/90 hover:text-white mb-4"
          >
            <Mail size={14} />
            mitra@sigapkota.go.id
          </a>
          <button className="w-full py-2.5 rounded-xl bg-white text-primary text-sm font-display font-bold hover:bg-primary-50 transition-colors">
            Daftarkan Instansi Anda
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}