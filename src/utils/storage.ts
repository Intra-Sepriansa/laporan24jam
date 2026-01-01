import type { Meta, DayRow } from '../types/laporan'

export type StoredReport = {
  meta: Meta
  rows: DayRow[]
  updatedAt?: number
}

const LAST_KEY = 'laporan_shift3_lastKey'
const CACHE_PREFIX = 'laporan_shift3_cache'

export const buildStorageKey = (meta: Meta) => {
  const bulan = String(meta.bulan).padStart(2, '0')
  return `laporan_shift3_${meta.kodeToko || 'NOKODE'}_${meta.tahun}-${bulan}`
}

export const loadReport = (key: string): StoredReport | null => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as StoredReport
  } catch (err) {
    console.error('Gagal baca localStorage', err)
    return null
  }
}

export const saveReport = (key: string, data: StoredReport) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.error('Gagal simpan localStorage', err)
  }
}

export const clearReport = (key: string) => {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.error('Gagal hapus localStorage', err)
  }
}

export const setLastKeyForUser = (userId: string, key: string) => {
  try {
    localStorage.setItem(`${LAST_KEY}_${userId}`, key)
  } catch (err) {
    console.error('Gagal simpan last key user', err)
  }
}

export const getLastKeyForUser = (userId: string) => {
  try {
    return localStorage.getItem(`${LAST_KEY}_${userId}`)
  } catch (err) {
    console.error('Gagal baca last key user', err)
    return null
  }
}

export const saveCacheForUser = (userId: string, key: string, data: StoredReport) => {
  try {
    localStorage.setItem(`${CACHE_PREFIX}_${userId}_${key}`, JSON.stringify(data))
  } catch (err) {
    console.error('Gagal simpan cache', err)
  }
}

export const loadCacheForUser = (userId: string, key: string): StoredReport | null => {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}_${userId}_${key}`)
    if (!raw) return null
    return JSON.parse(raw) as StoredReport
  } catch (err) {
    console.error('Gagal baca cache', err)
    return null
  }
}
