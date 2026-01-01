import { useState } from 'react'
import { Logo } from './Logo'

type Props = {
  userEmail?: string | null
  onLogout: () => void
}

const links = [
  {
    label: 'Meta',
    href: '#meta',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 7h16M4 12h10M4 17h16" />
      </svg>
    ),
  },
  {
    label: 'Input',
    href: '#input',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 6h16M4 10h16M4 14h8M4 18h8" />
      </svg>
    ),
  },
  {
    label: 'Ringkasan',
    href: '#summary',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 18h16M8 14v-4M12 14V7M16 14v-2" />
      </svg>
    ),
  },
  {
    label: 'Laporan',
    href: '#report',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M7 4h8l4 4v12H7z" />
        <path d="M15 4v4h4" />
      </svg>
    ),
  },
]

export const NavBar = ({ userEmail, onLogout }: Props) => {
  const [open, setOpen] = useState(false)

  const handleToggle = () => setOpen((prev) => !prev)
  const handleClose = () => setOpen(false)

  return (
    <nav className="sticky top-0 z-30 nav-blur">
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
          className="sm:hidden btn btn-outline"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={handleToggle}
        >
          {open ? 'Tutup' : 'Menu'}
        </button>

        <div className="hidden sm:flex items-center gap-4">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.icon}
              <span>{link.label}</span>
            </a>
          ))}
          {userEmail ? (
            <span className="pill bg-slate-100 border border-slate-200 text-slate-700">{userEmail}</span>
          ) : null}
          <button
            className="btn btn-dark"
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
                className="nav-link"
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
            {userEmail ? (
              <span className="pill bg-slate-100 border border-slate-200 text-slate-700">{userEmail}</span>
            ) : null}
            <button
              className="btn btn-dark"
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
