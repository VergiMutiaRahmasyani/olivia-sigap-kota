import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, MapPin, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/common/Logo'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', city: ''
  })
  const [error, setError] = useState('')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Kata sandi tidak cocok.')
      return
    }
    const res = await register(form)
    if (res.success) navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-cream to-primary-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8 md:p-10 shadow-xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <Logo size="lg" />
            </div>
            <p className="text-sm text-gray-500 font-body">Layanan Pelaporan Warga Digital</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 mb-5">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama */}
            <div>
              <label className="input-label">Nama Lengkap</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="name" type="text" placeholder="Nama lengkap sesuai KTP"
                  className="input-field pl-10" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="input-label">Alamat Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="email" type="email" placeholder="nama@email.com"
                  className="input-field pl-10" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Kata Sandi</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="password" type="password" placeholder="••••••••"
                  className="input-field pl-10" value={form.password} onChange={handleChange} required />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="input-label">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="confirmPassword" type="password" placeholder="••••••••"
                  className="input-field pl-10" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="input-label">Nomor Telepon</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="phone" type="tel" placeholder="0812xxxxxxxx"
                  className="input-field pl-10" value={form.phone} onChange={handleChange} required />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="input-label">Kota / Kabupaten</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="city" type="text" placeholder="Masukan kota tempat tinggal"
                  className="input-field pl-10" value={form.city} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Sudah punya akun?{' '}
            <Link to="/masuk" className="text-primary font-display font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
          SIGAP KOTA menggunakan sistem enkripsi tingkat lanjut untuk
          melindungi data pribadi dan privasi laporan Anda.
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <button className="text-xs text-gray-400 hover:text-primary">Kebijakan Privasi</button>
          <span className="text-gray-300">·</span>
          <button className="text-xs text-gray-400 hover:text-primary">Syarat & Ketentuan</button>
        </div>
      </div>
    </div>
  )
}