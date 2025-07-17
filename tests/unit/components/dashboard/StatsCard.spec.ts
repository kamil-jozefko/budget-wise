import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import { createTestingPinia } from '@pinia/testing'
import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'
import pl from '@/i18n/locales/pl.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en, pl },
  globalInjection: true,
})

describe('StatsCard', () => {
  it('renders title and formatted amount', () => {
    const wrapper = mount(StatsCard, {
      props: { title: 'Test', amount: 1234.56, isPositive: true },
      global: { plugins: [i18n, createTestingPinia({ createSpy: vi.fn })] },
    })
    expect(wrapper.text()).toContain('Test')
    expect(wrapper.text()).toMatch(/1[\s,]234[.,]56/)
  })
})
