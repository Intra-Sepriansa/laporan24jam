type Props = {
  text: string
  onGenerate: () => void
  onCopy: () => void
  onExport: () => void
  exporting?: boolean
}

export const ReportOutputPanel = ({ text, onGenerate, onCopy, onExport, exporting }: Props) => {
  return (
    <section className="card p-5 space-y-3 rise-in">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="section-title">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M7 4h8l4 4v12H7z" />
              <path d="M15 4v4h4" />
            </svg>
            Format Laporan Shift 3
          </h2>
          <p className="text-sm text-slate-500">Klik generate untuk membuat teks siap salin.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={onGenerate}
            className="btn btn-primary"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Generate Laporan
          </button>
          <button
            type="button"
            onClick={onExport}
            disabled={exporting}
            className="btn btn-success disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            {exporting ? 'Membuat Excel...' : 'Download Excel'}
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="btn btn-dark"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 9h10v10H9z" />
              <path d="M5 5h10v10" />
            </svg>
            Copy ke Clipboard
          </button>
        </div>
      </div>
      <textarea
        readOnly
        value={text}
        placeholder="Belum ada teks laporan. Isi data lalu klik Generate."
        className="w-full border rounded-lg p-3 text-sm font-mono min-h-[220px] bg-slate-950 text-slate-100 shadow-inner border-slate-800"
      />
    </section>
  )
}
