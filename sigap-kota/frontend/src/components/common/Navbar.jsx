import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from './Logo'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const navLinkClass = ({ isActive }) =>
    `text-sm font-display font-medium transition-colors duration-150 pb-0.5 border-b-2 ${
      isActive
        ? 'text-primary border-primary'
        : 'text-gray-600 border-transparent hover:text-primary'
    }`

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7">
          <NavLink to="/peta-laporan" className={navLinkClass}>Peta Laporan</NavLink>
          <NavLink to="/buat-laporan" className={navLinkClass}>Buat Laporan</NavLink>
          <NavLink to="/tentang-kami" className={navLinkClass}>Tentang Kami</NavLink>
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <span className="text-sm font-display font-semibold text-gray-700 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 card shadow-lg py-1 z-50">
                  <Link
                    to="/profil"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User size={15} />
                    Profil Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-red-50"
                  >
                    <LogOut size={15} />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/masuk" className="btn-primary">Masuk</Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          <NavLink to="/peta-laporan" onClick={() => setMobileOpen(false)} className={navLinkClass}>
            Peta Laporan
          </NavLink>
          <NavLink to="/buat-laporan" onClick={() => setMobileOpen(false)} className={navLinkClass}>
            Buat Laporan
          </NavLink>
          <NavLink to="/tentang-kami" onClick={() => setMobileOpen(false)} className={navLinkClass}>
            Tentang Kami
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profil" onClick={() => setMobileOpen(false)} className={navLinkClass}>
                Profil Saya
              </NavLink>
              <button onClick={handleLogout} className="text-left text-sm font-display font-medium text-danger">
                Keluar
              </button>
            </>
          ) : (
            <Link to="/masuk" onClick={() => setMobileOpen(false)} className="btn-primary w-fit">
              Masuk
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}