// AdminLayout.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.png'

const NAV = [
  { to: '/admin/peta',      label: 'Peta Laporan'   },
  { to: '/admin/laporan',   label: 'Kelola Laporan' },
  { to: '/admin/instansi',  label: 'Kelola Instansi' },
]

export default function AdminLayout({ children, fullWidth = false }) {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  const linkClass = ({ isActive }) =>
    `text-sm font-display font-semibold px-1 py-0.5 transition-colors relative ${
      isActive
        ? 'text-primary after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-full'
        : 'text-gray-600 hover:text-gray-900'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8]">

      {/* ── Top Navbar ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">

          {/* Logo */}
          <img src={logo} alt="SIGAP KOTA" style={{ height: 36 }} />

          {/* Nav links */}
          <nav className="flex items-center gap-8">
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-bold bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className={`flex-1 ${fullWidth ? 'overflow-hidden' : 'max-w-7xl mx-auto w-full px-8 py-8'}`}>
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#F5F0E8] border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-8 py-10 flex items-start justify-between">
          <div>
            <p className="text-base font-display font-extrabold text-gray-900 mb-1">SIGAP KOTA</p>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[220px]">
              © 2026 SIGAP KOTA. Menuju Kota Berkelanjutan (SDG 11).
            </p>
            <div className="flex items-center gap-3 mt-3">
              {/* Globe */}
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </button>
              {/* Share */}
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
              {/* Email */}
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="text-xs font-display font-extrabold text-primary mb-3">Tautan Cepat</p>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Syarat &amp; Ketentuan</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-display font-extrabold text-gray-900 mb-3">Bantuan</p>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Kontak Darurat</a></li>
                <li><a href="#" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Pusat Bantuan</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}