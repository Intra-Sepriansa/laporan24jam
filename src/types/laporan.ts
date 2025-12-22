export type Meta = {
  kodeToko: string
  namaToko: string
  bulan: number
  tahun: number
  shift: number
}

export type DayRow = {
  tanggal: number | null
  spd: number | null
  std: number | null
  apc: number | null
  pulsa: number | null
}

export type Summary = {
  totalSpd: number
  totalStd: number
  avgApc: number
  totalPulsa: number
  filledDays: number
}

export type DayRowInput = {
  tanggal: number
  spd?: number | null
  std?: number | null
  pulsa?: number | null
}
