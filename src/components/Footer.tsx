export const Footer = () => {
  return (
    <footer className="mt-10 border-t border-white/70 bg-white/75 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600">
        <div>
          <p className="font-semibold text-slate-900">Laporan Shift 3</p>
          <p className="text-xs text-slate-500">SPD / STD / APC</p>
        </div>
        <div className="flex flex-col gap-2">
          <a className="hover:text-slate-900" href="#meta">
            Meta Laporan
          </a>
          <a className="hover:text-slate-900" href="#input">
            Input Harian
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <a className="hover:text-slate-900" href="#summary">
            Ringkasan
          </a>
          <a className="hover:text-slate-900" href="#report">
            Format Laporan
          </a>
        </div>
        <div className="text-xs text-slate-500 sm:text-right">© 2025 Laporan Shift 3</div>
      </div>
    </footer>
  )
}
