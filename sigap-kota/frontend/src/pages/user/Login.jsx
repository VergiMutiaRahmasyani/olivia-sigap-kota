import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/common/Logo'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    const res = await login(form.email, form.password)
    if (res.success) {
      navigate(res.role === 'admin' ? '/admin' : '/')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-cream to-primary-50 flex flex-col items-center justify-center px-4 py-12">

      <div className="w-full max-w-md">
        {/* Card */}
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">Alamat Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="input-field pl-10"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="input-label mb-0">Kata Sandi</label>
                <button type="button" className="text-xs font-display font-semibold text-primary hover:underline">
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-10"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? 'Memproses...' : (
                <>Masuk <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Social divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-body">Atau masuk dengan</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-display font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-display font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Apple
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun?{' '}
            <Link to="/daftar" className="text-primary font-display font-semibold hover:underline">
              Daftar sekarang
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