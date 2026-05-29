import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Hanya user biasa
export function UserRoute() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/masuk" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  return <Outlet />
}

// Hanya admin
export function AdminRoute() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/admin/masuk" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}

// Redirect user jika sudah login (untuk /masuk dan /daftar)
export function GuestRoute() {
  const { user } = useAuth()
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  if (user?.role === 'user')  return <Navigate to="/" replace />
  return <Outlet />
}

// Redirect admin jika sudah login (untuk /admin/masuk)
export function AdminGuestRoute() {
  const { user } = useAuth()
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  return <Outlet />
}