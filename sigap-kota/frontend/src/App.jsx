import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserRoute, AdminRoute, GuestRoute, AdminGuestRoute } from './routes/Guards'

// ── Public / User pages ──
import LandingPage          from './pages/user/LandingPage'
import PetaLaporan          from './pages/user/PetaLaporan'
import DetailLaporan        from './pages/user/DetailLaporan'
import BuatLaporan          from './pages/user/BuatLaporan'
import TentangKami          from './pages/user/TentangKami'
import Profile              from './pages/user/Profile'
import EditProfile          from './pages/user/EditProfile'

// ── User auth ──
import Login                from './pages/user/Login'
import Register             from './pages/user/Register'

// ── Admin auth ──
import AdminLogin           from './pages/admin/Login'

// ── Admin pages ──
import KelolaLaporan        from './pages/admin/KelolaLaporan'
import AdminDetailLaporan   from './pages/admin/AdminDetailLaporan'
import AdminWarga           from './pages/admin/Warga'
import AdminPengaturan      from './pages/admin/Pengaturan'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public routes ── */}
          <Route path="/"             element={<LandingPage />} />
          <Route path="/peta-laporan" element={<PetaLaporan />} />
          <Route path="/laporan/:id"  element={<DetailLaporan />} />
          <Route path="/tentang-kami" element={<TentangKami />} />

          {/* ── User auth ── */}
          <Route element={<GuestRoute />}>
            <Route path="/masuk"  element={<Login />} />
            <Route path="/daftar" element={<Register />} />
          </Route>

          {/* ── Admin auth ── */}
          <Route element={<AdminGuestRoute />}>
            <Route path="/admin/masuk" element={<AdminLogin />} />
          </Route>

          {/* ── User-only routes ── */}
          <Route element={<UserRoute />}>
            <Route path="/buat-laporan" element={<BuatLaporan />} />
            <Route path="/profil"       element={<Profile />} />
            <Route path="/profil/edit"  element={<EditProfile />} />
          </Route>

          {/* ── Admin routes ── */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index                    element={<Navigate to="laporan" replace />} />
            <Route path="laporan"           element={<KelolaLaporan />} />
            <Route path="laporan/:id"       element={<AdminDetailLaporan />} />
            <Route path="warga"             element={<AdminWarga />} />
            <Route path="pengaturan"        element={<AdminPengaturan />} />
          </Route>

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}