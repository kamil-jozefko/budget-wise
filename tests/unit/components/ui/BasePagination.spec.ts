import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BasePagination from '@/components/ui/BasePagination.vue'
import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'
import pl from '@/i18n/locales/pl.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en, pl },
  globalInjection: true,
})

describe('BasePagination', () => {
  it('renders without crashing', () => {
    const wrapper = mount(BasePagination, { props: { page: 1, pageSize: 10, total: 10 }, global: { plugins: [i18n] } })
    expect(wrapper.exists()).toBe(true)
  })
})
