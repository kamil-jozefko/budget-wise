import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from '@/stores/notification'

describe('Notification Store', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useNotificationStore>
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useNotificationStore()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with empty notifications', () => {
    expect(store.notifications).toEqual([])
  })

  it('adds notifications with default options', () => {
    store.addNotification({
      timeout: 2000,
      title: 'Test',
      description: 'Test description',
    })

    expect(store.notifications).toHaveLength(1)
    expect(store.notifications[0]).toMatchObject({
      title: 'Test',
      description: 'Test description',
      type: 'default',
      timeout: 2000,
    })
  })

  it('adds success notification', () => {
    store.addSuccess('Success', 'Operation succeeded')

    expect(store.notifications).toHaveLength(1)
    expect(store.notifications[0]).toMatchObject({
      title: 'Success',
      description: 'Operation succeeded',
      type: 'success',
      timeout: 3000,
    })
  })

  it('adds error notification', () => {
    store.addError('Error', 'Operation failed')

    expect(store.notifications).toHaveLength(1)
    expect(store.notifications[0]).toMatchObject({
      title: 'Error',
      description: 'Operation failed',
      type: 'error',
      timeout: 5000,
    })
  })

  it('auto-removes notifications after timeout', () => {
    store.addNotification({
      title: 'Test',
      description: 'Test',
      timeout: 1000,
    })

    expect(store.notifications).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    expect(store.notifications).toHaveLength(0)
  })

  it('manually removes notification by id', () => {
    store.addNotification({
      title: 'Test',
      description: 'Test',
    })

    const id = store.notifications[0].id
    store.removeNotification(id!)
    expect(store.notifications).toHaveLength(0)
  })

  it('clears all notifications', () => {
    store.addNotification({ title: 'Test 1', description: 'Test' })
    store.addNotification({ title: 'Test 2', description: 'Test' })

    expect(store.notifications).toHaveLength(2)
    store.clearAll()
    expect(store.notifications).toHaveLength(0)
  })

  it('adds a notification', () => {
    store.addNotification({ title: 'Test', description: 'Desc', type: 'success' })
    expect(store.notifications.length).toBe(1)
    expect(store.notifications[0].title).toBe('Test')
  })

  it('removes a notification', () => {
    store.addNotification({ title: 'Test', description: 'Desc', type: 'success' })
    const id = store.notifications[0].id
    if (typeof id === 'number') {
      store.removeNotification(id)
      expect(store.notifications.length).toBe(0)
    }
    else {
      throw new Error('Notification id is undefined')
    }
  })

  it('adds warning notification', () => {
    store.addWarning('Warning', 'Be careful!')
    expect(store.notifications).toHaveLength(1)
    expect(store.notifications[0]).toMatchObject({
      title: 'Warning',
      description: 'Be careful!',
      type: 'warning',
      timeout: 4000,
    })
  })

  it('adds info notification', () => {
    store.addInfo('Info', 'FYI')
    expect(store.notifications).toHaveLength(1)
    expect(store.notifications[0]).toMatchObject({
      title: 'Info',
      description: 'FYI',
      type: 'info',
      timeout: 3000,
    })
  })

  it('calls addWarning in notifyLocalStorageFallback', () => {
    const store = useNotificationStore()
    store.notifyLocalStorageFallback()
    const warning = store.notifications.find(n => n.type === 'warning')
    expect(warning).toBeTruthy()
    expect(warning?.title).toBe('Local storage fallback')
    expect(warning?.description).toContain('localStorage')
  })
})
