import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '../firebase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      setError(err.message || 'Gagal login')
      throw err
    }
  }

  const register = async (email: string, password: string) => {
    setError(null)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      setError(err.message || 'Gagal daftar')
      throw err
    }
  }

  const loginWithGoogle = async () => {
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      setError(err.message || 'Gagal login Google')
      throw err
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return { user, loading, error, setError, login, register, loginWithGoogle, logout }
}
