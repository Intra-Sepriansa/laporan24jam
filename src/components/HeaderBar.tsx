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
    <header className="card-strong p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Laporan Shift 3</h1>
          <p className="text-xs text-slate-500 mt-1">{sub}</p>
        </div>
        <div className="pill bg-blue-50 text-blue-700 border border-blue-100 uppercase">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Shift {meta.shift || 3}
        </div>
      </div>
    </header>
  )
}
