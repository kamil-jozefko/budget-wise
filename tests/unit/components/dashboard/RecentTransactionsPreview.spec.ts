import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RecentTransactionsPreview from '@/components/dashboard/RecentTransactionsPreview.vue'
import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'
import pl from '@/i18n/locales/pl.json'
import { createTestingPinia } from '@pinia/testing'
import BaseButton from '@/components/ui/BaseButton.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en, pl },
  globalInjection: true,
})

describe('RecentTransactionsPreview', () => {
  it('renders empty state and add button when no transactions', () => {
    const wrapper = mount(RecentTransactionsPreview, {
      global: {
        plugins: [i18n, createTestingPinia({ createSpy: vi.fn })],
        components: { BaseButton },
        stubs: { NuxtIcon: { template: '<span />' } },
        mocks: { $t: msg => msg },
      },
      props: { transactions: [] },
    })
    expect(wrapper.text()).toContain('dashboard.noRecentTransactions')
    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toBe('dashboard.addFirstTransaction')
    const link = wrapper.find('a[href="/dashboard/transactions/new"]')
    expect(link.exists()).toBe(true)
  })

  it('does not render empty state when transactions exist', () => {
    const wrapper = mount(RecentTransactionsPreview, {
      global: {
        plugins: [i18n, createTestingPinia({ createSpy: vi.fn })],
        components: { BaseButton },
        stubs: { NuxtIcon: { template: '<span />' } },
        mocks: { $t: msg => msg },
      },
      props: {
        transactions: [
          {
            id: '1',
            description: 'Test',
            category: 'salary',
            date: '2024-01-01',
            amount: 100,
            type: 'INCOME',
          },
        ],
      },
    })
    expect(wrapper.text()).not.toContain('dashboard.noRecentTransactions')
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
