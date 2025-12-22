type ToastVariant = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  message: string
  variant?: ToastVariant
}

type Props = {
  items: ToastItem[]
  onClose: (id: string) => void
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-rose-600 text-white',
  info: 'bg-slate-900 text-white',
}

export const Toast = ({ items, onClose }: Props) => {
  if (items.length === 0) return null
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {items.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-2 px-4 py-3 rounded-xl shadow-lg border border-black/5 ${variantStyles[toast.variant || 'info']}`}
          style={{ animation: 'fadein 0.2s ease, fadeout 0.3s ease 2.7s' }}
        >
          <div className="flex-1 text-sm">{toast.message}</div>
          <button
            type="button"
            onClick={() => onClose(toast.id)}
            className="text-xs opacity-80 hover:opacity-100"
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
