import type { Meta } from '../types/laporan'
import { bulanList } from '../constants/bulan'

type Props = {
  meta: Meta
  onChange: <K extends keyof Meta>(key: K, value: Meta[K]) => void
  onSave: () => Promise<void> | void
  onReset: () => void
  onSeed: () => void
  saving?: boolean
}

export const MetaForm = ({ meta, onChange, onSave, onReset, onSeed, saving }: Props) => {
  const handleReset = () => {
    const ok = window.confirm('Hapus semua data laporan untuk meta ini?')
    if (ok) onReset()
  }

  return (
    <section className="card p-5 space-y-4 rise-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="section-title">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 6h16M4 12h10M4 18h16" />
            </svg>
            Meta Laporan
          </h2>
          <p className="text-sm text-slate-500">Isi sekali, dipakai untuk semua tanggal di bulan tersebut.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={onSeed}
            className="btn btn-success"
          >
            Isi Contoh Data TB56 November 2025
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-danger"
          >
            Reset Laporan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <label className="text-sm text-slate-700 space-y-1">
          <span>Kode Toko</span>
          <input
            value={meta.kodeToko}
            onChange={(e) => onChange('kodeToko', e.target.value.toUpperCase())}
            className="input-field"
            placeholder="TF81, TB56, dll."
          />
        </label>

        <label className="text-sm text-slate-700 space-y-1">
          <span>Nama Toko</span>
          <input
            value={meta.namaToko}
            onChange={(e) => onChange('namaToko', e.target.value.toUpperCase())}
            className="input-field"
            placeholder="SOLEAR, RAYA CANGKUDU"
          />
        </label>

        <label className="text-sm text-slate-700 space-y-1">
          <span>Bulan</span>
          <select
            value={meta.bulan}
            onChange={(e) => onChange('bulan', Number(e.target.value))}
            className="input-field"
          >
            {bulanList.map((b, idx) => (
              <option key={b} value={idx + 1}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-700 space-y-1">
          <span>Tahun</span>
          <input
            type="number"
            min={2000}
            value={meta.tahun}
            onChange={(e) => onChange('tahun', Number(e.target.value))}
            className="input-field"
          />
        </label>

        <label className="text-sm text-slate-700 space-y-1">
          <span>Shift</span>
          <input
            type="number"
            min={1}
            value={meta.shift}
            onChange={(e) => onChange('shift', Number(e.target.value))}
            className="input-field"
          />
        </label>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-slate-500">
          Data tersimpan otomatis ke akun (Firestore). Tombol simpan hanya memaksa simpan manual.
        </p>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? 'Menyimpan...' : 'Simpan Meta'}
        </button>
      </div>
    </section>
  )
}
