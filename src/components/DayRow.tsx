import type { DayRow as DayRowType } from '../types/laporan'
import { calculateApc, formatNumber } from '../utils/formatNumber'

type Props = {
  index: number
  row: DayRowType
  onChange: (index: number, field: keyof DayRowType, value: string | number | null) => void
  onDelete: (index: number) => void
  onNotify?: (message: string, variant?: 'success' | 'error' | 'info') => void
}

export const DayRow = ({ index, row, onChange, onDelete }: Props) => {
  const apcValue = row.std && row.std > 0 && row.spd ? calculateApc(row.spd, row.std) : row.apc
  const apcDisplay = row.std && row.std > 0 && row.spd ? formatNumber(apcValue) : ''

  return (
    <tr className="hover:bg-slate-50/60">
      <td className="px-2 py-2 text-sm text-slate-600">{index + 1}</td>
      <td className="px-2 py-2">
        <input
          type="number"
          min={1}
          max={31}
          value={row.tanggal ?? ''}
          onChange={(e) => onChange(index, 'tanggal', e.target.value === '' ? null : Number(e.target.value))}
          className="input-field-compact"
        />
      </td>
      <td className="px-2 py-2">
        <input
          type="number"
          min={0}
          value={row.spd ?? ''}
          onChange={(e) => onChange(index, 'spd', e.target.value === '' ? null : Number(e.target.value))}
          className="input-field-compact"
        />
      </td>
      <td className="px-2 py-2">
        <input
          type="number"
          min={0}
          value={row.std ?? ''}
          onChange={(e) => onChange(index, 'std', e.target.value === '' ? null : Number(e.target.value))}
          className="input-field-compact"
        />
      </td>
      <td className="px-2 py-2">
        <input
          value={apcDisplay}
          readOnly
          className="input-field-compact-muted text-right"
          placeholder="Otomatis"
        />
      </td>
      <td className="px-2 py-2">
        <input
          type="number"
          min={0}
          value={row.pulsa ?? 0}
          onChange={(e) => onChange(index, 'pulsa', e.target.value === '' ? 0 : Number(e.target.value))}
          className="input-field-compact"
        />
      </td>
      <td className="px-2 py-2 text-right">
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="text-sm text-rose-600 hover:text-rose-700"
        >
          Hapus
        </button>
      </td>
    </tr>
  )
}
