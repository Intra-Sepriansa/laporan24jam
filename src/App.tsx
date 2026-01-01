import { useState } from 'react'
import { HeaderBar } from './components/HeaderBar'
import { MetaForm } from './components/MetaForm'
import { DayTable } from './components/DayTable'
import { SummaryCard } from './components/SummaryCard'
import { ReportOutputPanel } from './components/ReportOutputPanel'
import { AuthCard } from './components/AuthCard'
import { NavBar } from './components/NavBar'
import { Footer } from './components/Footer'
import { Toast, type ToastItem } from './components/Toast'
import { useLaporanShift3 } from './hooks/useLaporanShift3'
import { useAuth } from './hooks/useAuth'
import { bulanList } from './constants/bulan'
import { calculateApc, formatNumber } from './utils/formatNumber'
import { exportLaporanToExcel } from './utils/exportExcel'
import type { DayRow, DayRowInput, Meta } from './types/laporan'
import { BulkImportModal } from './components/BulkImportModal'

const buildReportText = (meta: Meta, rows: DayRow[]) => {
  const bulanName = bulanList[meta.bulan - 1]?.toUpperCase() ?? ''
  const header = [
    '*Format laporan shift 3*',
    `*KODE : ${meta.kodeToko || '-'}*`,
    `*TOKO : ${meta.namaToko || '-'}*`,
    `*BULAN : ${bulanName} ${meta.tahun || ''}*`,
    '',
    'No / Tanggal / SPD / STD / APC / PULSA',
  ]

  const detailLines = rows
    .filter((row) => row.tanggal !== null || row.spd !== null || row.std !== null || (row.pulsa ?? 0) > 0)
    .map((row, idx) => {
      const tanggalText = row.tanggal ?? ''
      const spdText = row.spd !== null ? formatNumber(row.spd) : ''
      const stdText = row.std !== null ? formatNumber(row.std) : ''
      const apc =
        row.std && row.std > 0 && row.spd ? calculateApc(row.spd, row.std) : row.apc ? row.apc : null
      const apcText = apc ? formatNumber(apc) : ''
      const pulsaText = row.pulsa && row.pulsa > 0 ? formatNumber(row.pulsa) : ''
      return `${idx + 1}. ${tanggalText}/${spdText}/${stdText}/${apcText}/${pulsaText}`
    })

  return [...header, ...detailLines].join('\n')
}

const App = () => {
  const { user, loading: authLoading, error: authError, login, register, loginWithGoogle, logout } = useAuth()
  const {
    meta,
    rows,
    addRow,
    updateRow,
    deleteRow,
    updateMetaField,
    getSummary,
    resetReport,
    manualSave,
    applySeedData,
    upsertRows,
  } = useLaporanShift3(user?.uid ?? null)
  const [reportText, setReportText] = useState('')
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [savingMeta, setSavingMeta] = useState(false)
  const [savingData, setSavingData] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)

  const pushToast = (message: string, variant: ToastItem['variant'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const summary = getSummary()

  const handleGenerate = () => {
    const text = buildReportText(meta, rows)
    setReportText(text)
    pushToast('Laporan digenerate.', 'success')
  }

  const handleCopy = async () => {
    const text = reportText || buildReportText(meta, rows)
    setReportText(text)
    try {
      await navigator.clipboard.writeText(text)
      pushToast('Teks laporan disalin ke clipboard.', 'success')
    } catch (err) {
      console.error(err)
      pushToast('Gagal menyalin ke clipboard.', 'error')
    }
  }

  const handleExportExcel = async () => {
    if (exporting) return
    setExporting(true)
    try {
      const fileName = exportLaporanToExcel(meta, rows, summary)
      pushToast(`File ${fileName} berhasil dibuat.`, 'success')
    } catch (err) {
      console.error(err)
      pushToast('Gagal membuat file Excel.', 'error')
    } finally {
      setExporting(false)
    }
  }

  const handleReset = () => {
    resetReport()
    setReportText('')
    pushToast('Laporan direset.', 'info')
  }

  const handleSaveMeta = async () => {
    if (savingMeta) return
    const start = Date.now()
    setSavingMeta(true)
    try {
      await manualSave()
      pushToast('Meta & data tersimpan.', 'success')
    } catch (err) {
      pushToast('Gagal menyimpan meta.', 'error')
    } finally {
      const elapsed = Date.now() - start
      setTimeout(() => setSavingMeta(false), Math.max(0, 300 - elapsed))
    }
  }

  const handleSaveData = async () => {
    if (savingData) return
    const start = Date.now()
    setSavingData(true)
    try {
      await manualSave()
      pushToast('Data tersimpan.', 'success')
    } catch (err) {
      pushToast('Gagal menyimpan data.', 'error')
    } finally {
      const elapsed = Date.now() - start
      setTimeout(() => setSavingData(false), Math.max(0, 300 - elapsed))
    }
  }

  const handleBulkSubmit = (items: DayRowInput[]) => {
    const { updated, created, skipped } = upsertRows(items)
    const parts = [
      created > 0 ? `${created} baris baru ditambahkan` : null,
      updated > 0 ? `${updated} baris diperbarui` : null,
      skipped > 0 ? `${skipped} baris dilewati (tanggal tidak valid)` : null,
    ].filter(Boolean)
    pushToast(parts.join('. ') || 'Tidak ada data yang diubah.', created > 0 || updated > 0 ? 'success' : 'info')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-600">Memuat...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthCard onLogin={login} onRegister={register} onGoogle={loginWithGoogle} error={authError || undefined} />
  }

  return (
    <div className="min-h-screen">
      <NavBar userEmail={user.email} onLogout={logout} />
      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <HeaderBar meta={meta} />
        <section id="meta">
          <MetaForm
            meta={meta}
            onChange={updateMetaField}
            onSave={handleSaveMeta}
            onReset={handleReset}
            onSeed={applySeedData}
            saving={savingMeta}
          />
        </section>
        <section id="bulk-import">
          <div className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rise-in">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">Import Salinan</h3>
              <p className="text-sm text-slate-500">Tempel salinan laporan (format No.Tanggal/SPD/STD/APC/Pulsa), baris baru otomatis dibuat.</p>
            </div>
            <div className="w-full sm:w-auto flex gap-2">
              <button
                type="button"
                onClick={() => setBulkOpen(true)}
                className="btn btn-outline flex-1 sm:flex-none"
              >
                Import Salinan
              </button>
            </div>
          </div>
        </section>
        <section id="input">
          <DayTable
            rows={rows}
            onAddRow={addRow}
            onChangeRow={updateRow}
            onDeleteRow={deleteRow}
            onSaveAll={handleSaveData}
            saving={savingData}
          />
        </section>
        <section id="summary">
          <SummaryCard summary={summary} />
        </section>
        <section id="report">
          <ReportOutputPanel
            text={reportText}
            onGenerate={handleGenerate}
            onCopy={handleCopy}
            onExport={handleExportExcel}
            exporting={exporting}
          />
        </section>
      </main>
      <Footer />
      <Toast items={toasts} onClose={dismissToast} />
      <BulkImportModal open={bulkOpen} onClose={() => setBulkOpen(false)} onSubmit={handleBulkSubmit} />
    </div>
  )
}

export default App
