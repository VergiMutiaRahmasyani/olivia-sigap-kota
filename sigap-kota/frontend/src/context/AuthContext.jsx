import { createContext, useContext, useState, useEffect } from 'react'
import { auth as authApi, setToken, clearToken, getToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true) // true saat startup agar Guards tidak flicker

  // ── Restore session saat app pertama kali load ──────────────────────────
  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }

    authApi.me()
      .then(data => setUser(data?.user ?? data))   // terima { user } atau langsung object
      .catch(() => clearToken())                    // token expired / invalid → hapus
      .finally(() => setLoading(false))
  }, [])

  // ── Login ────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true)
    try {
      const data = await authApi.login(email, password)
      // Backend diharapkan mengembalikan: { token, user }
      setToken(data.token)
      setUser(data.user)
      return { success: true, role: data.user.role }
    } catch (err) {
      return {
        success: false,
        message: err.message ?? 'Email atau kata sandi salah.',
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Register ─────────────────────────────────────────────────────────────
  const register = async (formData) => {
    setLoading(true)
    try {
      const data = await authApi.register(formData)
      setToken(data.token)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.message ?? 'Pendaftaran gagal, coba lagi.',
        errors: err.data?.errors ?? {},   // validasi Laravel (422)
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // Lanjutkan logout di sisi client meski API gagal
    } finally {
      clearToken()
      setUser(null)
    }
  }

  // ── Update profile ───────────────────────────────────────────────────────
  const updateProfile = async (data) => {
    try {
      const updated = await authApi.updateProfile(data)
      setUser(prev => ({ ...prev, ...(updated?.user ?? updated) }))
      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.message ?? 'Gagal memperbarui profil.',
        errors: err.data?.errors ?? {},
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}