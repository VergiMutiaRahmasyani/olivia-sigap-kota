import { Link } from 'react-router-dom'
import { Globe, Share2, Mail } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="space-y-3">
            <Logo />
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              © 2026 SIGAP KOTA. Menuju Kota Berkelanjutan (SDG 11).
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button className="text-gray-400 hover:text-primary transition-colors"><Globe size={16} /></button>
              <button className="text-gray-400 hover:text-primary transition-colors"><Share2 size={16} /></button>
              <button className="text-gray-400 hover:text-primary transition-colors"><Mail size={16} /></button>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-sm font-display font-semibold text-primary mb-3">Tautan Cepat</p>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-sm font-display font-semibold text-primary mb-3">Bantuan</p>
            <ul className="space-y-2">
              <li>
                <a href="tel:112" className="text-sm text-gray-500 hover:text-primary transition-colors">
                  Kontak Darurat
                </a>
              </li>
              <li><Link to="/tentang-kami" className="text-sm text-gray-500 hover:text-primary transition-colors">Pusat Bantuan</Link></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  )
}