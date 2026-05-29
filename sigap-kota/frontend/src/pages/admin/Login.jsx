import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/common/Logo'

export default function AdminLogin() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    const res = await login(form.email, form.password)
    if (res.success && res.role === 'admin') {
      navigate('/admin')
    } else if (res.success && res.role !== 'admin') {
      setError('Akun ini bukan akun admin.')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 md:p-10 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center">
                <Shield size={28} className="text-white" />
              </div>
            </div>
            <h1 className="text-xl font-display font-bold text-white">Panel Admin</h1>
            <p className="text-sm text-gray-400 mt-1">SIGAP KOTA — Akses Terbatas</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/40 border border-red-700 text-sm text-red-400 mb-5">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-display font-semibold text-gray-300 mb-1.5">
                Email Admin
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="email"
                  type="email"
                  placeholder="admin@sigapkota.id"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-gray-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-display font-semibold text-sm hover:bg-primary-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memverifikasi...' : (
                <> Masuk ke Panel <ArrowRight size={16} /> </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Halaman ini hanya untuk pengelola SIGAP KOTA.
          </p>
        </div>

        {/* Back to main site */}
        <div className="text-center mt-4">
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← Kembali ke halaman utama
          </a>
        </div>

      </div>
    </div>
  )
}