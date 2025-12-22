import type { Summary } from '../types/laporan'
import { formatNumber } from '../utils/formatNumber'

type Props = {
  summary: Summary
}

export const SummaryCard = ({ summary }: Props) => {
  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Ringkasan Bulanan</h2>
          <p className="text-sm text-slate-500">Total SPD, STD, APC, dan Pulsa untuk baris yang terisi.</p>
        </div>
        <p className="text-xs text-slate-500">Jumlah hari terisi: {summary.filledDays}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 shadow-sm">
          <p className="text-xs text-blue-700 uppercase tracking-wide">Total SPD</p>
          <p className="text-xl font-bold text-blue-900">{formatNumber(summary.totalSpd)}</p>
        </div>
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm">
          <p className="text-xs text-indigo-700 uppercase tracking-wide">Total STD</p>
          <p className="text-xl font-bold text-indigo-900">{formatNumber(summary.totalStd)}</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 shadow-sm">
          <p className="text-xs text-emerald-700 uppercase tracking-wide">Rata-rata APC</p>
          <p className="text-xl font-bold text-emerald-900">{formatNumber(summary.avgApc)}</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 shadow-sm">
          <p className="text-xs text-amber-700 uppercase tracking-wide">Total Pulsa</p>
          <p className="text-xl font-bold text-amber-900">{formatNumber(summary.totalPulsa)}</p>
        </div>
      </div>
    </section>
  )
}
