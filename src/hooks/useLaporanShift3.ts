import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { calculateApc } from '../utils/formatNumber'
import {
  buildStorageKey,
  getLastKeyForUser,
  setLastKeyForUser,
  saveCacheForUser,
  loadCacheForUser,
  type StoredReport,
} from '../utils/storage'
import { db } from '../firebase'
import type { DayRow, DayRowInput, Meta, Summary } from '../types/laporan'

const defaultMeta: Meta = {
  kodeToko: 'TB56',
  namaToko: 'RAYA CANGKUDU CISOKA',
  bulan: 12,
  tahun: 2025,
  shift: 3,
}

const emptyRow: DayRow = {
  tanggal: null,
  spd: null,
  std: null,
  apc: null,
  pulsa: 0,
}

const seedRows: DayRow[] = [
  { tanggal: 1, spd: 2_536_600, std: 71, apc: calculateApc(2_536_600, 71), pulsa: null },
  { tanggal: 2, spd: 4_442_200, std: 91, apc: calculateApc(4_442_200, 91), pulsa: null },
  { tanggal: 3, spd: 3_169_100, std: 78, apc: calculateApc(3_169_100, 78), pulsa: null },
  { tanggal: 4, spd: 1_749_000, std: 41, apc: calculateApc(1_749_000, 41), pulsa: null },
  { tanggal: 5, spd: 3_538_000, std: 70, apc: calculateApc(3_538_000, 70), pulsa: null },
  { tanggal: 6, spd: 2_437_500, std: 65, apc: calculateApc(2_437_500, 65), pulsa: null },
  { tanggal: 7, spd: 2_792_200, std: 65, apc: calculateApc(2_792_200, 65), pulsa: null },
  { tanggal: 8, spd: 2_420_600, std: 57, apc: calculateApc(2_420_600, 57), pulsa: null },
  { tanggal: 9, spd: null, std: null, apc: null, pulsa: null },
]

const resolveReport = (cached: StoredReport | null, remote: StoredReport | null) => {
  if (cached && remote) {
    const cachedAt = cached.updatedAt ?? 0
    const remoteAt = remote.updatedAt ?? 0
    if (cachedAt >= remoteAt) {
      return { source: 'cache' as const, report: cached }
    }
    return { source: 'remote' as const, report: remote }
  }
  if (cached) return { source: 'cache' as const, report: cached }
  if (remote) return { source: 'remote' as const, report: remote }
  return null
}

const withUpdatedAt = (report: StoredReport) => ({
  meta: report.meta ?? defaultMeta,
  rows: report.rows ?? [],
  updatedAt: report.updatedAt ?? Date.now(),
})

export const useLaporanShift3 = (userId: string | null) => {
  const [meta, setMeta] = useState<Meta>(defaultMeta)
  const [rows, setRows] = useState<DayRow[]>([])
  const hydratedRef = useRef(false)
  const skipLoadRef = useRef(false)
  const seededRef = useRef(false)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const storageKey = useMemo(() => buildStorageKey(meta), [meta])

  const loadFromCloud = useCallback(
    async (key: string, allowDefault = false) => {
      if (!userId) return
      try {
        // Prioritas: coba baca cache lokal dulu untuk render cepat/offline.
        const cached = loadCacheForUser(userId, key)
        if (cached) {
          setMeta(cached.meta)
          setRows(cached.rows ?? [])
          hydratedRef.current = true
        }

        const ref = doc(db, 'users', userId, 'laporans', key)
        const snap = await getDoc(ref)
        const remote = snap.exists() ? (snap.data() as StoredReport) : null

        if (!remote && !cached) {
          if (allowDefault && !seededRef.current) {
            // Buat dokumen baru dengan seed default supaya tidak hilang saat refresh berikutnya.
            const payload: StoredReport = { meta: defaultMeta, rows: seedRows, updatedAt: Date.now() }
            await setDoc(ref, payload)
            seededRef.current = true
            setMeta(defaultMeta)
            setRows(seedRows)
            hydratedRef.current = true
            setLastKeyForUser(userId, key)
            saveCacheForUser(userId, key, payload)
          } else {
            // Jika belum ada data untuk meta ini, biarkan meta tetap & kosongkan rows.
            hydratedRef.current = true
            setRows([])
            setLastKeyForUser(userId, key)
          }
          return
        }

        const resolved = resolveReport(cached, remote)
        if (!resolved) return

        const payload = withUpdatedAt(resolved.report)
        setMeta(payload.meta)
        setRows(payload.rows ?? [])
        hydratedRef.current = true
        setLastKeyForUser(userId, key)
        saveCacheForUser(userId, key, payload)
        if (resolved.source === 'cache' || !remote?.updatedAt) {
          await setDoc(ref, payload)
        }
      } catch (err) {
        console.error('Gagal load data dari cloud', err)
      }
    },
    [userId],
  )

  useEffect(() => {
    if (!userId) {
      setMeta(defaultMeta)
      setRows([])
      hydratedRef.current = false
      return
    }
    const init = async () => {
      const lastKey = getLastKeyForUser(userId) || buildStorageKey(defaultMeta)
      await loadFromCloud(lastKey, true)
    }
    init()
  }, [userId, loadFromCloud])

  useEffect(() => {
    if (!hydratedRef.current) return
    if (!userId) return
    if (skipLoadRef.current) {
      skipLoadRef.current = false
      return
    }
    loadFromCloud(storageKey)
  }, [storageKey, loadFromCloud, userId])

  useEffect(() => {
    if (!hydratedRef.current) return
    if (!userId) return
    // Debounce penulisan ke Firestore supaya lebih cepat terasa (cache langsung disimpan).
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    const payload: StoredReport = { meta, rows, updatedAt: Date.now() }
    saveCacheForUser(userId, storageKey, payload)
    saveTimeout.current = setTimeout(() => {
      const save = async () => {
        try {
          const ref = doc(db, 'users', userId, 'laporans', storageKey)
          await setDoc(ref, payload)
          setLastKeyForUser(userId, storageKey)
        } catch (err) {
          console.error('Gagal simpan ke cloud', err)
        }
      }
      save()
    }, 400)
  }, [meta, rows, storageKey, userId])

  const addRow = useCallback(() => {
    setRows((prev) => {
      const lastTanggal = prev.length ? prev[prev.length - 1].tanggal ?? prev.length : 0
      const nextTanggal = lastTanggal ? lastTanggal + 1 : 1
      return [...prev, { ...emptyRow, tanggal: nextTanggal > 31 ? null : nextTanggal }]
    })
  }, [])

  const updateRow = useCallback(
    (index: number, field: keyof DayRow, rawValue: string | number | null) => {
      const toNumber = (value: string | number | null) => {
        if (value === '' || value === null || value === undefined) return null
        const num = Number(value)
        return Number.isNaN(num) ? null : num
      }

      setRows((prev) =>
        prev.map((row, i) => {
          if (i !== index) return row

          const updated: DayRow = { ...row, [field]: toNumber(rawValue) }
          const spd = field === 'spd' ? toNumber(rawValue) : row.spd
          const std = field === 'std' ? toNumber(rawValue) : row.std
          updated.apc = std && std > 0 && spd ? calculateApc(spd, std) : null
          return updated
        }),
      )
    },
    [],
  )

  const deleteRow = useCallback((index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateMetaField = useCallback(<K extends keyof Meta>(key: K, value: Meta[K]) => {
    setMeta((prev) => ({ ...prev, [key]: value }))
  }, [])

  const getSummary = useCallback((): Summary => {
    const totals = rows.reduce(
      (acc, row) => {
        if (!row.tanggal) return acc
        // Hanya hitung baris yang punya SPD dan STD (dua-duanya terisi) agar tidak tercampur antar hari.
        if (row.spd != null && row.std != null) {
          acc.totalSpd += row.spd
          acc.totalStd += row.std
          acc.totalPulsa += row.pulsa ?? 0
          acc.filledDays += 1
        }
        return acc
      },
      { totalSpd: 0, totalStd: 0, totalPulsa: 0, filledDays: 0 },
    )

    const avgApc = totals.totalStd > 0 ? Math.round(totals.totalSpd / totals.totalStd) : 0

    return {
      totalSpd: totals.totalSpd,
      totalStd: totals.totalStd,
      totalPulsa: totals.totalPulsa,
      filledDays: totals.filledDays,
      avgApc,
    }
  }, [rows])

  const resetReport = useCallback(() => {
    if (!userId) return
    const run = async () => {
      try {
        await deleteDoc(doc(db, 'users', userId, 'laporans', storageKey))
      } catch (err) {
        console.error('Gagal reset laporan di cloud', err)
      } finally {
        setRows([])
      }
    }
    run()
  }, [storageKey, userId])

  const manualSave = useCallback(async () => {
    if (!userId) return
    try {
      const payload: StoredReport = { meta, rows, updatedAt: Date.now() }
      saveCacheForUser(userId, storageKey, payload)
      await setDoc(doc(db, 'users', userId, 'laporans', storageKey), payload)
      setLastKeyForUser(userId, storageKey)
    } catch (err) {
      console.error('Gagal simpan manual', err)
      throw err
    }
  }, [meta, rows, storageKey, userId])

  const upsertRows = useCallback((items: DayRowInput[]) => {
    let updated = 0
    let created = 0
    let skipped = 0

    setRows((prev) => {
      let next = [...prev]

      const applyValues = (base: DayRow, item: DayRowInput): DayRow => {
        const updatedRow: DayRow = { ...base }
        if ('spd' in item) updatedRow.spd = item.spd ?? null
        if ('std' in item) updatedRow.std = item.std ?? null
        if ('pulsa' in item) updatedRow.pulsa = item.pulsa ?? null
        if (updatedRow.std && updatedRow.std > 0 && updatedRow.spd) {
          updatedRow.apc = calculateApc(updatedRow.spd, updatedRow.std)
        } else {
          updatedRow.apc = null
        }
        return updatedRow
      }

      items.forEach((item) => {
        const { tanggal } = item
        if (!tanggal || tanggal < 1 || tanggal > 31) {
          skipped += 1
          return
        }
        const idx = next.findIndex((row) => row.tanggal === tanggal)
        if (idx >= 0) {
          next[idx] = applyValues(next[idx], item)
          updated += 1
        } else {
          const newRow = applyValues({ ...emptyRow, tanggal }, item)
          next = [...next, newRow]
          created += 1
        }
      })

      next.sort((a, b) => (a.tanggal ?? 0) - (b.tanggal ?? 0))
      return next
    })
    return { updated, created, skipped }
  }, [])

  const applySeedData = useCallback(() => {
    const seedMeta: Meta = {
      ...defaultMeta,
    }
    skipLoadRef.current = true
    setMeta(seedMeta)
    setRows(seedRows)
  }, [])

  return {
    meta,
    rows,
    storageKey,
    addRow,
    updateRow,
    deleteRow,
    updateMetaField,
    getSummary,
    resetReport,
    manualSave,
    upsertRows,
    applySeedData,
    setRows,
  }
}
