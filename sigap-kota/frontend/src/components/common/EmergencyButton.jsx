import { useState } from 'react'
import { Phone, X, AlertTriangle } from 'lucide-react'

// Daftar nomor darurat Indonesia
const EMERGENCY_CONTACTS = [
  { label: 'Polisi',         number: '110',  color: 'bg-blue-600'  },
  { label: 'Ambulans / PMI', number: '118',  color: 'bg-red-600'   },
  { label: 'Pemadam Api',    number: '113',  color: 'bg-orange-500' },
  { label: 'BNPB (Bencana)', number: '117',  color: 'bg-purple-600' },
  { label: 'PLN (Listrik)',  number: '123',  color: 'bg-yellow-600' },
]

export default function EmergencyButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-72 card shadow-2xl overflow-hidden animate-[slideUp_0.2s_ease]">
          <div className="bg-danger px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-white" />
              <span className="text-sm font-display font-bold text-white">Hubungi Darurat</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="p-3 space-y-2">
            {EMERGENCY_CONTACTS.map(c => (
              <a
                key={c.number}
                href={`tel:${c.number}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${c.color} rounded-lg flex items-center justify-center`}>
                    <Phone size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-display font-semibold text-gray-800">{c.label}</p>
                    <p className="text-xs text-gray-500">{c.number}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Hubungi
                </span>
              </a>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 pb-3">
            Tekan untuk langsung menghubungi
          </p>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-danger text-white shadow-lg shadow-red-200 transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Hubungi darurat"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-danger animate-ping opacity-30" />
        <Phone size={18} className="relative" />
        <span className="relative text-sm font-display font-bold">Darurat</span>
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}