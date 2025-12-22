import AsyncStorage from '@react-native-async-storage/async-storage'

const LAST_KEY = 'laporan_shift3_lastKey'
const CACHE_PREFIX = 'laporan_shift3_cache'

export const buildStorageKey = (meta) => {
  const bulan = String(meta.bulan).padStart(2, '0')
  return `laporan_shift3_${meta.kodeToko || 'NOKODE'}_${meta.tahun}-${bulan}`
}

export const setLastKeyForUser = async (userId, key) => {
  try {
    await AsyncStorage.setItem(`${LAST_KEY}_${userId}`, key)
  } catch (err) {
    console.error('Gagal simpan last key', err)
  }
}

export const getLastKeyForUser = async (userId) => {
  try {
    return await AsyncStorage.getItem(`${LAST_KEY}_${userId}`)
  } catch (err) {
    console.error('Gagal baca last key', err)
    return null
  }
}

export const saveCacheForUser = async (userId, key, data) => {
  try {
    await AsyncStorage.setItem(`${CACHE_PREFIX}_${userId}_${key}`, JSON.stringify(data))
  } catch (err) {
    console.error('Gagal simpan cache', err)
  }
}

export const loadCacheForUser = async (userId, key) => {
  try {
    const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}_${userId}_${key}`)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (err) {
    console.error('Gagal baca cache', err)
    return null
  }
}
