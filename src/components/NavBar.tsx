import { useState } from 'react'
import { Logo } from './Logo'

type Props = {
  userEmail?: string | null
  onLogout: () => void
}

const links = [
  { label: 'Meta', href: '#meta' },
  { label: 'Input', href: '#input' },
  { label: 'Ringkasan', href: '#summary' },
  { label: 'Laporan', href: '#report' },
]

export const NavBar = ({ userEmail, onLogout }: Props) => {
  const [open, setOpen] = useState(false)

  const handleToggle = () => setOpen((prev) => !prev)
  const handleClose = () => setOpen(false)

  return (
    <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Logo size={42} />
          <div>
            <p className="text-sm font-semibold text-slate-900">Laporan Shift 3</p>
            <p className="text-xs text-slate-500">SPD / STD / APC</p>
          </div>
          <span className="hidden sm:inline-flex pill bg-blue-50 text-blue-700 border border-blue-100">Shift 3</span>
        </div>

        <button
          className="sm:hidden rounded-lg border px-3 py-2 text-sm text-slate-700"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={handleToggle}
        >
          {open ? 'Tutup' : 'Menu'}
        </button>

        <div className="hidden sm:flex items-center gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100"
            >
              {link.label}
            </a>
          ))}
          {userEmail ? (
            <span className="pill bg-slate-100 border border-slate-200 text-slate-700">{userEmail}</span>
          ) : null}
          <button
            className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-black text-sm shadow-sm"
            onClick={onLogout}
          >
            Keluar
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur">
          <div className="px-4 py-3 flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleClose}
                className="text-sm text-slate-700 px-2 py-2 rounded-lg hover:bg-slate-100"
              >
                {link.label}
              </a>
            ))}
            {userEmail ? (
              <span className="pill bg-slate-100 border border-slate-200 text-slate-700">{userEmail}</span>
            ) : null}
            <button
              className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm shadow-sm"
              onClick={() => {
                handleClose()
                onLogout()
              }}
            >
              Keluar
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
