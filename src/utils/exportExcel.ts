import * as XLSX from 'xlsx'
import { bulanList } from '../constants/bulan'
import { calculateApc } from './formatNumber'
import type { DayRow, Meta, Summary } from '../types/laporan'

export const exportLaporanToExcel = (meta: Meta, rows: DayRow[], summary: Summary) => {
  const bulanName = bulanList[meta.bulan - 1] ?? ''
  const bulanPadded = String(meta.bulan).padStart(2, '0')

  const cleanedRows = rows.filter(
    (row) => row.tanggal !== null || row.spd !== null || row.std !== null || (row.pulsa ?? 0) > 0,
  )

  const tableRows = cleanedRows.map((row, idx) => {
    const apc = row.std && row.std > 0 && row.spd ? calculateApc(row.spd, row.std) : row.apc ?? null
    return [idx + 1, row.tanggal ?? '', row.spd ?? '', row.std ?? '', apc ?? '', row.pulsa ?? '']
  })

  const sheetData = [
    ['Laporan Shift', meta.shift],
    ['Kode Toko', meta.kodeToko],
    ['Nama Toko', meta.namaToko],
    ['Bulan', `${bulanName} ${meta.tahun}`.trim()],
    [],
    ['No', 'Tanggal', 'SPD', 'STD', 'APC', 'Pulsa'],
    ...tableRows,
    [],
    ['Ringkasan'],
    ['Total SPD', summary.totalSpd],
    ['Total STD', summary.totalStd],
    ['Rata-rata APC', summary.avgApc],
    ['Total Pulsa', summary.totalPulsa],
    ['Jumlah Hari Terisi', summary.filledDays],
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan')

  const fileName = `laporan_shift3_${meta.kodeToko || 'NOKODE'}_${meta.tahun}-${bulanPadded}.xlsx`
  XLSX.writeFile(workbook, fileName)

  return fileName
}
