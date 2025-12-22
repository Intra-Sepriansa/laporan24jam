const formatter = new Intl.NumberFormat('id-ID')

export const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return ''
  return formatter.format(value)
}

export const calculateApc = (spd, std) => {
  if (!spd || !std || std === 0) return 0
  return Math.round(spd / std)
}
