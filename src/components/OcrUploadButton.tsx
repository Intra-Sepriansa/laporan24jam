import { useRef, useState, type ChangeEvent } from 'react'
import type { ToastItem } from './Toast'
import { recognizeNumberWithText } from '../utils/ocr'

type Props = {
  label: string
  fieldLabel?: string
  min?: number
  onNumber: (value: number) => void
  onNotify?: (message: string, variant?: ToastItem['variant']) => void
  className?: string
}

export const OcrUploadButton = ({ label, fieldLabel, min = 1, onNumber, onNotify, className }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePick = () => {
    if (!loading) {
      inputRef.current?.click()
    }
  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const { number } = await recognizeNumberWithText(file, min)
      if (number === null) {
        onNotify?.('Tidak menemukan angka yang bisa dibaca dari foto.', 'error')
        return
      }
      onNumber(number)
      const name = fieldLabel || label
      onNotify?.(`${name} terisi otomatis (${number}).`, 'success')
    } catch (err) {
      console.error(err)
      onNotify?.('Gagal membaca gambar. Coba foto lebih jelas.', 'error')
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const buttonClass =
    className ||
    'text-xs px-2 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 shadow-sm disabled:opacity-60'

  return (
    <>
      <button type="button" onClick={handlePick} disabled={loading} className={buttonClass}>
        {loading ? 'Membaca...' : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
    </>
  )
}
