import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'default'

interface Notification {
  id?: number
  title: string
  description?: string
  type?: NotificationType
  icon?: string
  timeout?: number
}

const defaultIcons: Record<NotificationType, string> = {
  success: 'tabler:check-circle',
  error: 'tabler:x-circle',
  warning: 'tabler:alert-triangle',
  info: 'tabler:info-circle',
  default: 'tabler:bell',
}

const defaultTimeouts: Record<NotificationType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
  default: 2000,
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  function addNotification(notification: Notification) {
    const id = Date.now()
    const type: NotificationType = notification.type ?? 'default'
    const timeout = notification.timeout ?? defaultTimeouts[type]

    const finalNotification: Notification = {
      ...notification,
      id,
      type,
      timeout,
      icon: notification.icon ?? defaultIcons[type],
    }

    notifications.value.push(finalNotification)

    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, timeout)
    }
  }

  function addSuccess(title: string, description?: string, options?: Partial<Notification>) {
    addNotification({
      title,
      description,
      type: 'success',
      ...options,
    })
  }

  function addError(title: string, description?: string, options?: Partial<Notification>) {
    addNotification({
      title,
      description,
      type: 'error',
      ...options,
    })
  }

  function addWarning(title: string, description?: string, options?: Partial<Notification>) {
    addNotification({
      title,
      description,
      type: 'warning',
      ...options,
    })
  }

  function addInfo(title: string, description?: string, options?: Partial<Notification>) {
    addNotification({
      title,
      description,
      type: 'info',
      ...options,
    })
  }

  function removeNotification(id: number) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function clearAll() {
    notifications.value = []
  }

  function notifyLocalStorageFallback() {
    addWarning('Local storage fallback', 'Your browser does not support IndexedDB. Data will be stored in localStorage.')
  }

  return {
    notifications,
    addNotification,
    addSuccess,
    addError,
    addWarning,
    addInfo,
    removeNotification,
    clearAll,
    notifyLocalStorageFallback,
  }
})
