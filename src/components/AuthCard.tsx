import { useState } from 'react'

type Props = {
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (email: string, password: string) => Promise<void>
  onGoogle: () => Promise<void>
  error?: string | null
}

export const AuthCard = ({ onLogin, onRegister, onGoogle, error }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await onLogin(email, password)
      } else {
        await onRegister(email, password)
      }
    } catch (err: any) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 card-strong p-6 space-y-4 rise-in">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-sky-600" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
          Masuk ke Laporan Shift 3
        </h1>
        <p className="text-sm text-slate-500">Gunakan email & password. Jika belum punya akun, daftar dulu.</p>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="text-sm text-slate-700 space-y-1 w-full">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="nama@contoh.com"
          />
        </label>
        <label className="text-sm text-slate-700 space-y-1 w-full">
          <span>Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Minimal 6 karakter"
          />
        </label>
        {error ? <p className="text-xs text-rose-600">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
        </button>
      </form>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        <span>atau</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      <button
        type="button"
        onClick={async () => {
          setGoogleLoading(true)
          try {
            await onGoogle()
          } catch (err) {
            console.error(err)
          } finally {
            setGoogleLoading(false)
          }
        }}
        disabled={googleLoading}
        className="btn btn-outline w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {googleLoading ? 'Memproses...' : 'Masuk dengan Google'}
      </button>
      <div className="text-sm text-slate-600">
        {mode === 'login' ? (
          <button type="button" className="text-sky-600 hover:underline" onClick={() => setMode('register')}>
            Belum punya akun? Daftar
          </button>
        ) : (
          <button type="button" className="text-sky-600 hover:underline" onClick={() => setMode('login')}>
            Sudah punya akun? Masuk
          </button>
        )}
      </div>
    </div>
  )
}
