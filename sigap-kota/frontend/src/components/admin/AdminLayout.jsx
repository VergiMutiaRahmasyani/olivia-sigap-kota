import { NavLink, useNavigate } from 'react-router-dom'
import { FileText, Users, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../common/Logo'

const NAV = [
  { to: '/admin/laporan',    icon: FileText, label: 'Kelola Laporan' },
  { to: '/admin/warga',      icon: Users,    label: 'Warga'          },
  { to: '/admin/pengaturan', icon: Settings, label: 'Pengaturan'     },
]

export default function AdminLayout({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-semibold transition-all ${
      isActive
        ? 'bg-primary text-white shadow-sm'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
    }`

  return (
    <div className="min-h-screen flex bg-cream">

      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-gray-100">
          <Logo />
          <span className="mt-1 text-xs font-body text-gray-400">Panel Admin</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-semibold text-danger hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>

    </div>
  )
}