import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, Mail, Lock, Phone, MapPin, AlertCircle, Eye, EyeOff
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/common/Logo'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name:                  '',
    email:                 '',
    password:              '',
    password_confirmation: '',
    phone:                 '',
    kecamatan:             '',
    kelurahan:             '',
  })

  const [error,       setError]       = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.password_confirmation) {
      setError('Kata sandi tidak cocok.')
      return
    }

    try {
      const payload = {
        name:                  form.name,
        email:                 form.email,
        phone:                 form.phone,
        kecamatan:             form.kecamatan,
        kelurahan:             form.kelurahan,
        password:              form.password,
        password_confirmation: form.password_confirmation,
      }

      const res = await register(payload)

      if (res?.token || res?.success) {
        navigate('/')
      } else {
        setError(res?.message || 'Registrasi gagal.')
      }
    } catch (err) {
      if (err?.data?.errors) {
        const firstError = Object.values(err.data.errors)[0]
        setError(Array.isArray(firstError) ? firstError[0] : 'Data yang dimasukkan tidak valid.')
      } else {
        setError(err?.message || 'Registrasi gagal.')
      }
    }
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
                <input name="password" type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 8 karakter" className="input-field pl-10 pr-10"
                  value={form.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="input-label">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="password_confirmation" type={showConfirm ? 'text' : 'password'}
                  placeholder="Ulangi kata sandi" className="input-field pl-10 pr-10"
                  value={form.password_confirmation} onChange={handleChange} required />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Telepon */}
            <div>
              <label className="input-label">Nomor Telepon</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="phone" type="tel" placeholder="08123456789"
                  className="input-field pl-10" value={form.phone} onChange={handleChange} required />
              </div>
            </div>

            {/* Kecamatan & Kelurahan */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label">Kecamatan</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="kecamatan" type="text" placeholder="Tambaksari"
                    className="input-field pl-10" value={form.kecamatan} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="input-label">Kelurahan</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="kelurahan" type="text" placeholder="Gading"
                    className="input-field pl-10" value={form.kelurahan} onChange={handleChange} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>

          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-body">Atau daftar dengan</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-display font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-display font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
          </div>

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

      </div>
    </div>
  )
}