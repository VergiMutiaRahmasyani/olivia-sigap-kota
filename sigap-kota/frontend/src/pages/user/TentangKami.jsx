import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

export default function TentangKami() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 flex-1 space-y-10">

        <div className="text-center">
          <h1 className="text-4xl font-display font-extrabold text-gray-900">Tentang SIGAP KOTA</h1>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
            Platform kolaborasi sipil yang menghubungkan warga, data, dan pemerintah untuk kota yang lebih baik.
          </p>
        </div>

        <div className="card p-8 space-y-4">
          <h2 className="text-xl font-display font-bold text-gray-900">Misi Kami</h2>
          <p className="text-gray-600 leading-relaxed">
            SIGAP KOTA hadir untuk memastikan setiap masalah perkotaan — dari lubang jalan hingga
            lampu mati — ditindaklanjuti secara transparan dan terukur. Kami percaya bahwa kota
            yang tangguh dibangun dari partisipasi warganya.
          </p>
        </div>

        <div className="card p-8 space-y-4">
          <h2 className="text-xl font-display font-bold text-gray-900">Mendukung SDG 11</h2>
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white font-display font-extrabold text-lg flex-shrink-0">
              11
            </div>
            <p className="text-gray-600 leading-relaxed">
              Seluruh aktivitas SIGAP KOTA berkontribusi pada Tujuan Pembangunan Berkelanjutan (SDG) nomor 11:
              Kota dan Pemukiman yang Inklusif, Aman, Tangguh, dan Berkelanjutan.
            </p>
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-5">Kontak & Bantuan</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href="tel:112" className="flex items-center gap-3 p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="text-sm font-display font-bold text-red-700">Darurat — 112</p>
                <p className="text-xs text-red-500">Polisi / Ambulans / Pemadam</p>
              </div>
            </a>
            <a href="mailto:bantuan@sigapkota.id" className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors">
              <span className="text-2xl">✉️</span>
              <div>
                <p className="text-sm font-display font-bold text-primary">Pusat Bantuan</p>
                <p className="text-xs text-primary-400">bantuan@sigapkota.id</p>
              </div>
            </a>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}