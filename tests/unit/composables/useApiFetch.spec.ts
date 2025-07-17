import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isIndexedDBAvailable, storageGet, storageSet, storageDelete, notifiedFallback } from '@/composables/useApiFetch'

// Mock Notification Store
const notify = vi.fn()
vi.mock('~/stores/notification', () => ({
  useNotificationStore: () => ({
    notifyLocalStorageFallback: notify,
  }),
}))

beforeEach(() => {
  global.window = Object.create(window)
  global.window.indexedDB = undefined
  notifiedFallback.value = false
})

describe('useApiFetch', () => {
  it('should detect IndexedDB availability', () => {
    vi.restoreAllMocks()
    global.window = Object.create(window)
    global.window.indexedDB = {}
    global.indexedDB = {}
    expect(isIndexedDBAvailable()).toBe(true)
  })

  it('should fallback to localStorage if IndexedDB is unavailable', async () => {
    vi.spyOn(global, 'indexedDB', 'get').mockReturnValue(undefined)
    const key = 'testKey'
    const value = { foo: 'bar' }
    global.localStorage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(value)),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    } as unknown as Storage
    expect(await storageGet(key)).toEqual(value)
    await storageSet(key, value)
    expect(global.localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value))
    await storageDelete(key)
    expect(global.localStorage.removeItem).toHaveBeenCalledWith(key)
  })

  it('should notify once on localStorage fallback', async () => {
    await storageSet('key', { foo: 'bar' })
    await storageDelete('key')
    expect(await storageGet('key')).toEqual({ foo: 'bar' })
  })

  it('should handle JSON parse errors in lsGet gracefully', async () => {
    vi.spyOn(global, 'indexedDB', 'get').mockReturnValue(undefined)
    global.localStorage = {
      getItem: vi.fn().mockReturnValue('not-json'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    } as unknown as Storage
    expect(await storageGet('bad')).toBeNull()
  })
})
