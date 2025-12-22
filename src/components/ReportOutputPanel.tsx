type Props = {
  text: string
  onGenerate: () => void
  onCopy: () => void
  onExport: () => void
  exporting?: boolean
}

export const ReportOutputPanel = ({ text, onGenerate, onCopy, onExport, exporting }: Props) => {
  return (
    <section className="card p-5 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Format Laporan Shift 3</h2>
          <p className="text-sm text-slate-500">Klik generate untuk membuat teks siap salin.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={onGenerate}
            className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            Generate Laporan
          </button>
          <button
            type="button"
            onClick={onExport}
            disabled={exporting}
            className="px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm disabled:opacity-60"
          >
            {exporting ? 'Membuat Excel...' : 'Download Excel'}
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="px-3 py-2 text-sm rounded-lg bg-slate-800 text-white hover:bg-black shadow-sm"
          >
            Copy ke Clipboard
          </button>
        </div>
      </div>
      <textarea
        readOnly
        value={text}
        placeholder="Belum ada teks laporan. Isi data lalu klik Generate."
        className="w-full border rounded-lg p-3 text-sm font-mono min-h-[220px] bg-slate-900 text-slate-50"
      />
    </section>
  )
}
