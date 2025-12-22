// Formatter angka dengan gaya Indonesia (titik sebagai pemisah ribuan).
const formatter = new Intl.NumberFormat('id-ID')

export const formatNumber = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(value)) return ''
  return formatter.format(value)
}

// APC dibulatkan ke bilangan bulat terdekat (0 digit desimal).
export const calculateApc = (spd?: number | null, std?: number | null) => {
  if (!spd || !std || std === 0) return 0
  return Math.round(spd / std)
}
