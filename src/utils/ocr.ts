import { recognize } from 'tesseract.js'

const normalizeNumberString = (raw: string) => {
  // Buang karakter non-digit kecuali pemisah ribuan/desimal.
  let cleaned = raw.replace(/[^\d.,]/g, '')
  // Hilangkan desimal tunggal di akhir, mis. ".0" atau ",0".
  cleaned = cleaned.replace(/([.,])0$/, '')
  // Jika masih ada desimal pendek (1-2 digit) di akhir, buang desimalnya.
  cleaned = cleaned.replace(/([.,]\d{1,2})$/, '')
  // Satu pemisah ribuan yang tersisa cukup untuk dipakai, jadi hapus titik/koma untuk parse int.
  return cleaned.replace(/[.,]/g, '')
}

export const extractNumber = (text: string, min = 1) => {
  const matches = text.match(/\d[\d.,]*/g)
  if (!matches) return null
  const numbers = matches
    .map((m) => normalizeNumberString(m))
    .map((m) => Number.parseInt(m, 10))
    .filter((n) => Number.isFinite(n) && n >= min)
  if (numbers.length === 0) return null
  // Pilih angka terpanjang untuk memprioritaskan nilai besar (mis. SPD).
  return numbers.reduce((best, current) => {
    const bestLen = String(best).length
    const curLen = String(current).length
    if (curLen > bestLen) return current
    if (curLen === bestLen) return Math.max(best, current)
    return best
  }, numbers[0])
}

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err)
    }
    img.src = url
  })

const preprocessToBlob = async (file: File): Promise<Blob> => {
  const img = await loadImage(file)
  const canvas = document.createElement('canvas')
  const maxWidth = 1800
  const scale = img.width > maxWidth ? maxWidth / img.width : 1
  canvas.width = Math.floor(img.width * scale)
  canvas.height = Math.floor(img.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas tidak tersedia')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  // Grayscale + threshold ringan untuk menghilangkan noise.
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const gray = 0.299 * r + 0.587 * g + 0.114 * b
    const value = gray > 180 ? 255 : 0
    data[i] = value
    data[i + 1] = value
    data[i + 2] = value
  }
  ctx.putImageData(imageData, 0, 0)

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Gagal memproses gambar'))
    }, 'image/png')
  })
}

export type RecognizeNumberResult = {
  text: string
  number: number | null
}

export const recognizeNumberWithText = async (file: File, min = 1): Promise<RecognizeNumberResult> => {
  const preprocessed = await preprocessToBlob(file)
  const result = await recognize(preprocessed, 'eng', {
    // PSM 7: single line; membantu fokus ke angka.
    tessedit_pageseg_mode: 7 as any,
    // Batasi hanya angka dan set dpi agar OCR lebih stabil.
    config: 'tessedit_char_whitelist=0123456789\nuser_defined_dpi=300',
  } as any)
  const text = result.data.text || ''
  return {
    text,
    number: extractNumber(text, min),
  }
}

export const recognizeNumberFromFile = async (file: File, min = 1) => {
  const { number } = await recognizeNumberWithText(file, min)
  return number
}
