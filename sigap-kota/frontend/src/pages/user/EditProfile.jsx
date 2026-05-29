import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Phone, MapPin, ArrowLeft, Camera } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

export default function EditProfile() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    city: '',
    bio: '',
  })

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        <Link to="/profil" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={15} /> Kembali ke Profil
        </Link>

        <div className="card p-8 space-y-6">
          <h1 className="text-xl font-display font-bold text-gray-900">Edit Profil</h1>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center">
                <User size={28} className="text-primary" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Camera size={11} className="text-white" />
              </button>
            </div>
            <div>
              <p className="text-sm font-display font-semibold text-gray-700">Foto Profil</p>
              <p className="text-xs text-gray-400 mt-0.5">JPG atau PNG, maks. 2MB</p>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="input-label">Nama Lengkap</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="name" type="text" className="input-field pl-9"
                  value={form.name} onChange={handleChange} placeholder="Nama lengkap sesuai KTP" />
              </div>
            </div>

            <div>
              <label className="input-label">Alamat Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="email" type="email" className="input-field pl-9"
                  value={form.email} onChange={handleChange} placeholder="nama@email.com" />
              </div>
            </div>

            <div>
              <label className="input-label">Nomor Telepon</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="phone" type="tel" className="input-field pl-9"
                  value={form.phone} onChange={handleChange} placeholder="0812xxxxxxxx" />
              </div>
            </div>

            <div>
              <label className="input-label">Kota / Kabupaten</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="city" type="text" className="input-field pl-9"
                  value={form.city} onChange={handleChange} placeholder="Masukan kota tempat tinggal" />
              </div>
            </div>

            <div>
              <label className="input-label">Bio Singkat</label>
              <textarea name="bio" rows={3} className="input-field resize-none"
                value={form.bio} onChange={handleChange}
                placeholder="Ceritakan kontribusi Anda untuk kota..." />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link to="/profil" className="btn-secondary flex-1 justify-center">Batal</Link>
            <button className="btn-primary flex-1 justify-center">Simpan Perubahan</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}