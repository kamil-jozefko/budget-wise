import { useNotificationStore } from '~/stores/notification'

export const notifiedFallback = { value: false }

const DB_NAME = 'MealPlannerDB'
const STORE_NAME = 'data'

async function getDB() {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') throw new Error('IndexedDB is not available on the server')
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function storageGet<T = unknown>(key: string): Promise<T | null> {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) as T : null
  }
  catch {
    return null
  }
}

export async function storageSet<T = unknown>(key: string, value: T): Promise<void> {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  }
  catch {
    // handle error if needed
  }
}

export async function storageDelete(key: string) {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.delete(key)
      req.onsuccess = () => resolve(undefined)
      req.onerror = () => reject(req.error)
    })
  }
  catch {
    return lsDelete(key)
  }
}

export function isIndexedDBAvailable() {
  try {
    return typeof indexedDB !== 'undefined'
  }
  catch {
    return false
  }
}

export function lsGet(key: string) {
  const hasLocalStorage = (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') || (typeof global !== 'undefined' && typeof global.localStorage !== 'undefined')
  if (!hasLocalStorage) return null
  if (!notifiedFallback.value) {
    if (typeof window !== 'undefined') {
      useNotificationStore().notifyLocalStorageFallback()
    }
    notifiedFallback.value = true
  }
  const value = (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined')
    ? window.localStorage.getItem(key)
    : (typeof global !== 'undefined' && typeof global.localStorage !== 'undefined')
        ? global.localStorage.getItem(key)
        : null
  try {
    return value ? JSON.parse(value) : null
  }
  catch {
    return null
  }
}

export function lsSet(key: string, value: unknown) {
  const hasLocalStorage = (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') || (typeof global !== 'undefined' && typeof global.localStorage !== 'undefined')
  if (!hasLocalStorage) return
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
    else if (typeof global !== 'undefined' && typeof global.localStorage !== 'undefined') {
      global.localStorage.setItem(key, JSON.stringify(value))
    }
  }
  catch {
    return
  }
}

export function lsDelete(key: string) {
  const hasLocalStorage = (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') || (typeof global !== 'undefined' && typeof global.localStorage !== 'undefined')
  if (!hasLocalStorage) return
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.removeItem(key)
    }
    else if (typeof global !== 'undefined' && typeof global.localStorage !== 'undefined') {
      global.localStorage.removeItem(key)
    }
  }
  catch {
    return
  }
}
