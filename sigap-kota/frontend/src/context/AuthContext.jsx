import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Mock users for development — ganti dengan API call nanti
const MOCK_USERS = [
  { id: 1, role: 'user',  name: 'Aditya Pratama', email: 'user@sigapkota.id',  avatar: null },
  { id: 2, role: 'admin', name: 'Admin SIGAP',    email: 'admin@sigapkota.id', avatar: null },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    // Simulasi API — ganti dengan fetch() ke backend
    await new Promise(r => setTimeout(r, 800))
    const found = MOCK_USERS.find(u => u.email === email)
    setLoading(false)
    if (found) {
      setUser(found)
      return { success: true, role: found.role }
    }
    return { success: false, message: 'Email atau kata sandi salah.' }
  }

  const logout = () => setUser(null)

  const register = async (data) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    // Setelah register, auto-login sebagai user
    const newUser = { id: Date.now(), role: 'user', name: data.name, email: data.email, avatar: null }
    setUser(newUser)
    return { success: true }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}