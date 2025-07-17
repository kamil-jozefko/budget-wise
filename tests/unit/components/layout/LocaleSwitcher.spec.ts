import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import LocaleSwitcher from '@/components/layout/LocaleSwitcher.vue'

const setLocale = vi.fn()
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      'app.name': 'App',
      'navigation.dashboard': 'Dashboard',
      'navigation.transactions': 'Transactions',
      'user.profile': 'Profile',
      'profile.languageLabel': 'Application Language',
    },
    pl: {
      'app.name': 'Aplikacja',
      'navigation.dashboard': 'Panel',
      'navigation.transactions': 'Transakcje',
      'user.profile': 'Profil',
      'profile.languageLabel': 'Język aplikacji',
    },
  },
  availableLocales: ['en', 'pl'],
})
i18n.global.setLocale = setLocale

describe('LocaleSwitcher.vue', () => {
  beforeEach(() => {
    setLocale.mockClear()
  })

  it('renders with available locales', async () => {
    const wrapper = mount(LocaleSwitcher, {
      global: {
        plugins: [i18n],
        mocks: {
          setLocale,
        },
      },
      props: {
        modelValue: 'en',
        label: 'Language',
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain('EN')
    expect(wrapper.html()).toContain('PL')
  })

  it('calls setLocale when selection changes', async () => {
    const wrapper = mount(LocaleSwitcher, {
      global: {
        plugins: [i18n],
      },
      props: {
        setLocale,
        modelValue: 'en',
      },
    })
    await wrapper.vm.$nextTick()
    // Simulate changing the select value
    // Find the select element rendered by BaseSelect
    const select = wrapper.find('select')
    await select.setValue('pl')
    // Check that setLocale was called with 'pl'
    expect(setLocale).toHaveBeenCalledWith('pl')
  })
})
