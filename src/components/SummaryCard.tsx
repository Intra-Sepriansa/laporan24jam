import type { Summary } from '../types/laporan'
import { formatNumber } from '../utils/formatNumber'

type Props = {
  summary: Summary
}

export const SummaryCard = ({ summary }: Props) => {
  return (
    <section className="card p-5 rise-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="section-title">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 18h16M8 14v-4M12 14V7M16 14v-2" />
            </svg>
            Ringkasan Bulanan
          </h2>
          <p className="text-sm text-slate-500">Total SPD, STD, APC, dan Pulsa untuk baris yang terisi.</p>
        </div>
        <p className="text-xs text-slate-500">Jumlah hari terisi: {summary.filledDays}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
        <div className="stat-card stat-card-blue">
          <div className="flex items-center justify-between">
            <p className="text-xs text-sky-700 uppercase tracking-wide">Total SPD</p>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 18h16M6 14v-3M11 14V8M16 14v-5" />
            </svg>
          </div>
          <p className="text-xl font-bold text-sky-900">{formatNumber(summary.totalSpd)}</p>
        </div>
        <div className="stat-card stat-card-indigo">
          <div className="flex items-center justify-between">
            <p className="text-xs text-indigo-700 uppercase tracking-wide">Total STD</p>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M5 8h10M5 16h8" />
            </svg>
          </div>
          <p className="text-xl font-bold text-indigo-900">{formatNumber(summary.totalStd)}</p>
        </div>
        <div className="stat-card stat-card-emerald">
          <div className="flex items-center justify-between">
            <p className="text-xs text-emerald-700 uppercase tracking-wide">Rata-rata APC</p>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 14l4-4 4 3 6-7" />
            </svg>
          </div>
          <p className="text-xl font-bold text-emerald-900">{formatNumber(summary.avgApc)}</p>
        </div>
        <div className="stat-card stat-card-amber">
          <div className="flex items-center justify-between">
            <p className="text-xs text-amber-700 uppercase tracking-wide">Total Pulsa</p>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 3v18M7 8h10M7 16h10" />
            </svg>
          </div>
          <p className="text-xl font-bold text-amber-900">{formatNumber(summary.totalPulsa)}</p>
        </div>
      </div>
    </section>
  )
}
