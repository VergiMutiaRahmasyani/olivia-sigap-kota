import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function UserRoute() {
  const { user, loading } = useAuth() // Tambahkan loading
  
  if (loading) return <div>Loading...</div> // Penting: Tunggu sebentar
  if (!user) return <Navigate to="/masuk" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  return <Outlet />
}

export function AdminRoute() {
  const { user, loading } = useAuth() // Tambahkan loading
  
  if (loading) return null // Penting: Tunggu sebentar
  if (!user) return <Navigate to="/admin/masuk" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}

export function GuestRoute() {
  const { user, loading } = useAuth() // Tambahkan loading
  
  if (loading) return null // Atau return <div>Loading...</div>
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  if (user?.role === 'user')  return <Navigate to="/" replace />
  return <Outlet />
}