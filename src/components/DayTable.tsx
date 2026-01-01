import type { DayRow as DayRowType } from '../types/laporan'
import { DayRow } from './DayRow'

type Props = {
  rows: DayRowType[]
  onAddRow: () => void
  onChangeRow: (index: number, field: keyof DayRowType, value: string | number | null) => void
  onDeleteRow: (index: number) => void
  onSaveAll?: () => Promise<void>
  saving?: boolean
}

export const DayTable = ({
  rows,
  onAddRow,
  onChangeRow,
  onDeleteRow,
  onSaveAll,
  saving,
}: Props) => {
  return (
    <section className="card p-5 space-y-3 rise-in" id="input">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="section-title">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 6h16M4 10h16M4 14h8M4 18h8" />
            </svg>
            Tabel Input Harian
          </h2>
          <p className="text-sm text-slate-500">Isi SPD &amp; STD secara manual, APC dihitung otomatis.</p>
        </div>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto sm:justify-end">
          {onSaveAll ? (
            <button
              type="button"
              onClick={onSaveAll}
              disabled={saving}
              className="btn btn-success disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onAddRow}
            className="btn btn-primary"
          >
            + Tambah Baris
          </button>
        </div>
      </div>

      {/* Tabel untuk layar medium ke atas */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700 uppercase tracking-wide text-xs">
            <tr>
              <th className="px-2 py-3 font-semibold">No</th>
              <th className="px-2 py-3 font-semibold">Tanggal</th>
              <th className="px-2 py-3 font-semibold">SPD</th>
              <th className="px-2 py-3 font-semibold">STD</th>
              <th className="px-2 py-3 font-semibold">APC</th>
              <th className="px-2 py-3 font-semibold">Pulsa</th>
              <th className="px-2 py-3 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-slate-500 py-4">
                  Belum ada baris. Klik &quot;+ Tambah Baris&quot; untuk mulai.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <DayRow
                  key={index}
                  index={index}
                  row={row}
                  onChange={onChangeRow}
                  onDelete={onDeleteRow}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tampilan kartu untuk mobile */}
        <div className="sm:hidden space-y-3">
        {rows.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-2">Belum ada baris. Tambah baris untuk mulai.</div>
        ) : (
          rows.map((row, index) => {
            const handle = (field: keyof typeof row, value: string | number | null) => onChangeRow(index, field, value)
            return (
              <div key={index} className="border border-slate-200 rounded-lg p-3 shadow-sm bg-white">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span className="font-semibold">Baris {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => onDeleteRow(index)}
                    className="text-rose-600 hover:text-rose-700"
                  >
                    Hapus
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-[11px] text-slate-500 space-y-1">
                    <span>Tanggal</span>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={row.tanggal ?? ''}
                      onChange={(e) => handle('tanggal', e.target.value === '' ? null : Number(e.target.value))}
                      className="input-field"
                    />
                  </label>
                  <label className="text-[11px] text-slate-500 space-y-1">
                    <span>SPD</span>
                    <input
                      type="number"
                      min={0}
                      value={row.spd ?? ''}
                      onChange={(e) => handle('spd', e.target.value === '' ? null : Number(e.target.value))}
                      className="input-field"
                    />
                  </label>
                  <label className="text-[11px] text-slate-500 space-y-1">
                    <span>STD</span>
                    <input
                      type="number"
                      min={0}
                      value={row.std ?? ''}
                      onChange={(e) => handle('std', e.target.value === '' ? null : Number(e.target.value))}
                      className="input-field"
                    />
                  </label>
                  <label className="text-[11px] text-slate-500 space-y-1">
                    <span>APC</span>
                    <input
                      readOnly
                      value={row.std && row.std > 0 && row.spd ? Math.round((row.spd ?? 0) / (row.std ?? 1)) : ''}
                      className="input-field-muted text-right"
                      placeholder="Otomatis"
                    />
                  </label>
                  <label className="text-[11px] text-slate-500 space-y-1 col-span-2">
                    <span>Pulsa</span>
                    <input
                      type="number"
                      min={0}
                      value={row.pulsa ?? 0}
                      onChange={(e) => handle('pulsa', e.target.value === '' ? 0 : Number(e.target.value))}
                      className="input-field"
                    />
                  </label>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
