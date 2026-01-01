import { useEffect, useMemo, useState } from 'react'
import type { DayRowInput } from '../types/laporan'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (items: DayRowInput[]) => void
}

const parseNumber = (raw: string) => {
  const cleaned = raw.replace(/[^\d]/g, '')
  if (!cleaned) return null
  const num = Number.parseInt(cleaned, 10)
  return Number.isNaN(num) ? null : num
}

const parseText = (text: string): DayRowInput[] => {
  const items: DayRowInput[] = []
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      // Contoh: 9.9/1.497.900/56/26.748/0
      // Bagian pertama = No.Tanggal (No diabaikan, tanggal dipakai sebagai kunci).
      const parts = line.split('/').map((p) => p.trim()).filter(Boolean)
      if (parts.length < 2) return

      const firstNumbers = parts[0].match(/\d+/g) || []
      const tanggalRaw = firstNumbers.length >= 2 ? firstNumbers[firstNumbers.length - 1] : firstNumbers[0]
      const tanggal = tanggalRaw ? Number.parseInt(tanggalRaw, 10) : null
      if (!tanggal || tanggal < 1 || tanggal > 31) return

      const spd = parseNumber(parts[1])
      const std = parseNumber(parts[2])
      // parts[3] sering APC; pulsa ambil dari bagian ke-5 jika ada, else ke-4 jika tidak ada APC.
      const pulsa = parts.length >= 5 ? parseNumber(parts[4]) : parts.length === 4 ? parseNumber(parts[3]) : null

      items.push({ tanggal, spd, std, pulsa })
    })
  return items
}

export const BulkImportModal = ({ open, onClose, onSubmit }: Props) => {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const parsed = useMemo(() => parseText(text), [text])

  useEffect(() => {
    if (open) {
      setText('')
      setError(null)
    }
  }, [open])

  const handleSubmit = () => {
    if (parsed.length === 0) {
      setError('Tidak ada baris valid. Gunakan format: tanggal spd std [pulsa].')
      return
    }
    onSubmit(parsed)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="card-strong w-full max-w-2xl overflow-hidden rise-in">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-sky-600" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
              Tambah data terlewat (tempel salinan)
            </p>
            <p className="text-xs text-slate-500">
              Format per baris: <span className="font-semibold">tanggal spd std [pulsa]</span>. Pisah dengan spasi,
              koma, atau garis miring.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setError(null)
            }}
            rows={8}
            className="input-field font-mono"
            placeholder={`Contoh:\n9.9/3.340.900/61/54.768/15.000\n10.10/2.033.301/53/38.364/0\n11.11.3.100.801/64/48.450/116.500`}
          />
          <div className="text-xs text-slate-600 flex justify-between items-center">
            <span>
              {parsed.length > 0
                ? `${parsed.length} baris siap diproses.`
                : 'Tempel salinan angka dari laporan sebelumnya.'}
            </span>
            {error ? <span className="text-rose-600">{error}</span> : null}
          </div>
        </div>

        <div className="px-4 py-3 flex items-center justify-end gap-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Tambahkan
          </button>
        </div>
      </div>
    </div>
  )
}
