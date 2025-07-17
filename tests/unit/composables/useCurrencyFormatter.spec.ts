import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useCurrencyFormatter } from '@/composables/useCurrencyFormatter'

describe('useCurrencyFormatter', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('formats USD with prefix', () => {
    const { formatCurrency } = useCurrencyFormatter('$')
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('formats PLN with suffix', () => {
    const { formatCurrency } = useCurrencyFormatter('zł')
    expect(formatCurrency(1234.56)).toBe('1 234,56 zł')
  })

  it('falls back to PLN if unknown currency', () => {
    const { formatCurrency } = useCurrencyFormatter('EUR')
    expect(formatCurrency(1234.56)).toBe('1 234,56 zł')
  })
})
