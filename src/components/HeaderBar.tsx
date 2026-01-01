import type { Meta } from '../types/laporan'
import { bulanList } from '../constants/bulan'

type Props = {
  meta: Meta
}

export const HeaderBar = ({ meta }: Props) => {
  const bulanName = bulanList[meta.bulan - 1]?.toUpperCase() ?? ''
  const sub =
    meta.kodeToko || meta.namaToko || bulanName
      ? `KODE: ${meta.kodeToko || '-'} | TOKO: ${meta.namaToko || '-'} | BULAN: ${bulanName} ${meta.tahun || ''}`
      : 'Lengkapi meta laporan di bawah'

  return (
    <header className="card-strong p-4 rise-in">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-sky-600" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 7h16M4 12h12M4 17h16" />
            </svg>
            <h1 className="text-xl font-semibold text-slate-900">Laporan Shift 3</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">{sub}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="pill bg-blue-50 text-blue-700 border border-blue-100 uppercase">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Shift {meta.shift || 3}
          </div>
          <div className="pill bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.6A4 4 0 1 1 18 18H7Z" />
            </svg>
            Auto-save aktif
          </div>
        </div>
      </div>
    </header>
  )
}
