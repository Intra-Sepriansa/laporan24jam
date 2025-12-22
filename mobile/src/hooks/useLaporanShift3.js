import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { calculateApc } from '../utils/formatNumber'
import { buildStorageKey, getLastKeyForUser, loadCacheForUser, saveCacheForUser, setLastKeyForUser } from '../utils/storage'
import { db } from '../firebase'

const defaultMeta = {
  kodeToko: 'TB56',
  namaToko: 'RAYA CANGKUDU CISOKA',
  bulan: 12,
  tahun: 2025,
  shift: 3,
}

const emptyRow = {
  tanggal: null,
  spd: null,
  std: null,
  apc: null,
  pulsa: 0,
}

const seedRows = [
  { tanggal: 1, spd: 2536600, std: 71, apc: calculateApc(2536600, 71), pulsa: null },
  { tanggal: 2, spd: 4442200, std: 91, apc: calculateApc(4442200, 91), pulsa: null },
  { tanggal: 3, spd: 3169100, std: 78, apc: calculateApc(3169100, 78), pulsa: null },
  { tanggal: 4, spd: 1749000, std: 41, apc: calculateApc(1749000, 41), pulsa: null },
  { tanggal: 5, spd: 3538000, std: 70, apc: calculateApc(3538000, 70), pulsa: null },
  { tanggal: 6, spd: 2437500, std: 65, apc: calculateApc(2437500, 65), pulsa: null },
  { tanggal: 7, spd: 2792200, std: 65, apc: calculateApc(2792200, 65), pulsa: null },
  { tanggal: 8, spd: 2420600, std: 57, apc: calculateApc(2420600, 57), pulsa: null },
  { tanggal: 9, spd: null, std: null, apc: null, pulsa: null },
]

export const useLaporanShift3 = (userId) => {
  const [meta, setMeta] = useState(defaultMeta)
  const [rows, setRows] = useState([])
  const hydratedRef = useRef(false)
  const skipLoadRef = useRef(false)
  const seededRef = useRef(false)
  const saveTimeout = useRef(null)

  const storageKey = useMemo(() => buildStorageKey(meta), [meta])

  const loadFromCloud = useCallback(
    async (key, allowDefault = false) => {
      if (!userId) return
      try {
        const cached = await loadCacheForUser(userId, key)
        if (cached) {
          setMeta(cached.meta)
          setRows(cached.rows ?? [])
          hydratedRef.current = true
        }

        const ref = doc(db, 'users', userId, 'laporans', key)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const data = snap.data()
          setMeta(data.meta)
          setRows(data.rows ?? [])
          hydratedRef.current = true
          await setLastKeyForUser(userId, key)
          await saveCacheForUser(userId, key, data)
        } else if (allowDefault && !seededRef.current) {
          const payload = { meta: defaultMeta, rows: seedRows }
          await setDoc(ref, payload)
          seededRef.current = true
          setMeta(defaultMeta)
          setRows(seedRows)
          hydratedRef.current = true
          await setLastKeyForUser(userId, key)
          await saveCacheForUser(userId, key, payload)
        } else {
          hydratedRef.current = true
          setRows(cached?.rows ?? [])
          setMeta(cached?.meta ?? defaultMeta)
          if (cached) {
            await setLastKeyForUser(userId, key)
            await saveCacheForUser(userId, key, cached)
          }
        }
      } catch (err) {
        console.error('Gagal load data', err)
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
      const lastKey = (await getLastKeyForUser(userId)) || buildStorageKey(defaultMeta)
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
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    const payload = { meta, rows }
    saveCacheForUser(userId, storageKey, payload)
    saveTimeout.current = setTimeout(() => {
      const run = async () => {
        try {
          const ref = doc(db, 'users', userId, 'laporans', storageKey)
          await setDoc(ref, payload)
          await setLastKeyForUser(userId, storageKey)
        } catch (err) {
          console.error('Gagal simpan otomatis', err)
        }
      }
      run()
    }, 400)
  }, [meta, rows, storageKey, userId])

  const addRow = useCallback(() => {
    setRows((prev) => {
      const lastTanggal = prev.length ? prev[prev.length - 1].tanggal ?? prev.length : 0
      const nextTanggal = lastTanggal ? lastTanggal + 1 : 1
      return [...prev, { ...emptyRow, tanggal: nextTanggal > 31 ? null : nextTanggal }]
    })
  }, [])

  const updateRow = useCallback((index, field, rawValue) => {
    const toNumber = (value) => {
      if (value === '' || value === null || value === undefined) return null
      const num = Number(value)
      return Number.isNaN(num) ? null : num
    }

    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row
        const updated = { ...row, [field]: toNumber(rawValue) }
        const spd = field === 'spd' ? toNumber(rawValue) : row.spd
        const std = field === 'std' ? toNumber(rawValue) : row.std
        updated.apc = std && std > 0 && spd ? calculateApc(spd, std) : null
        return updated
      }),
    )
  }, [])

  const deleteRow = useCallback((index) => {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateMetaField = useCallback((key, value) => {
    setMeta((prev) => ({ ...prev, [key]: value }))
  }, [])

  const getSummary = useCallback(() => {
    const totals = rows.reduce(
      (acc, row) => {
        if (!row.tanggal) return acc
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
    return { ...totals, avgApc }
  }, [rows])

  const resetReport = useCallback(() => {
    if (!userId) return
    const run = async () => {
      try {
        await deleteDoc(doc(db, 'users', userId, 'laporans', storageKey))
      } catch (err) {
        console.error('Gagal reset', err)
      } finally {
        setRows([])
      }
    }
    run()
  }, [storageKey, userId])

  const manualSave = useCallback(async () => {
    if (!userId) return
    const payload = { meta, rows }
    await saveCacheForUser(userId, storageKey, payload)
    await setDoc(doc(db, 'users', userId, 'laporans', storageKey), payload)
    await setLastKeyForUser(userId, storageKey)
  }, [meta, rows, storageKey, userId])

  const applySeedData = useCallback(() => {
    skipLoadRef.current = true
    setMeta({ ...defaultMeta })
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
    applySeedData,
  }
}
