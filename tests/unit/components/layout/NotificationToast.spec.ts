import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notification'
import NotificationToast from '~/components/layout/NotificationToast.vue'
import { nextTick } from 'vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: { close: 'Close' },
    pl: { close: 'Zamknij' },
  },
})

describe('NotificationToast.vue', () => {
  let store: ReturnType<typeof useNotificationStore>

  beforeEach(() => {
    mount(NotificationToast, { global: { plugins: [createTestingPinia({ createSpy: vi.fn }), i18n], stubs: { NuxtIcon: { template: '<span />' } } } })
    store = useNotificationStore()
    store.notifications = []
    store.removeNotification = vi.fn()
  })

  it('renders notifications from store', async () => {
    const wrapper = mount(NotificationToast, { global: { plugins: [createTestingPinia({ createSpy: vi.fn }), i18n], stubs: { NuxtIcon: { template: '<span />' } } } })
    store = useNotificationStore()
    store.notifications.push(
      { id: 1, title: 'Test', description: 'Test desc', icon: 'tabler:info' },
      { id: 2, title: 'Another', description: 'Another desc' },
    )
    await nextTick()
    expect(wrapper.text()).toContain('Test')
    expect(wrapper.text()).toContain('Another')
    expect(wrapper.findAll('div.max-w-md').length).toBe(2)
  })

  it('calls removeNotification when close button is clicked', async () => {
    const wrapper = mount(NotificationToast, { global: { plugins: [createTestingPinia({ createSpy: vi.fn }), i18n], stubs: { NuxtIcon: { template: '<span />' } } } })
    store = useNotificationStore()
    store.notifications.push({ id: 1, title: 'Test', description: 'Test desc', icon: 'tabler:info' })
    await nextTick()
    const closeButton = wrapper.find('div.max-w-md .ml-4 button')
    expect(closeButton.exists()).toBe(true)
    await closeButton.trigger('click')
    expect(store.removeNotification).toHaveBeenCalledWith(1)
  })

  it('renders nothing if no notifications', () => {
    const wrapper = mount(NotificationToast, { global: { plugins: [createTestingPinia({ createSpy: vi.fn }), i18n], stubs: { NuxtIcon: { template: '<span />' } } } })
    expect(wrapper.findAll('div.max-w-md').length).toBe(0)
  })
})
