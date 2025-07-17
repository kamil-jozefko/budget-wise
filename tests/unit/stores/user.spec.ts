import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useCurrencyStore } from '@/stores/user'

describe('useCurrencyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('defaults to PLN', () => {
    const store = useCurrencyStore()
    expect(store.currency).toBe('zł')
  })

  it('can set currency to $', () => {
    const store = useCurrencyStore()
    store.setCurrency('$')
    expect(store.currency).toBe('$')
  })

  it('can set currency to zł', () => {
    const store = useCurrencyStore()
    store.setCurrency('zł')
    expect(store.currency).toBe('zł')
  })
})
