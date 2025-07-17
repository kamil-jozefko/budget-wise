import { describe, it, expect } from 'vitest'
import { useValidation } from '@/composables/useValidation'

describe('useValidation', () => {
  const {
    isRequired,
    isEmail,
    minLength,
    maxLength,
    isPositiveNumber,
    isValidDate,
    isValidCategory,
    isDateInRange,
  } = useValidation()

  it('isRequired works', () => {
    expect(isRequired('abc')).toBe(true)
    expect(isRequired('')).toBe(false)
    expect(isRequired(null)).toBe(false)
    expect(isRequired(undefined)).toBe(false)
  })

  it('isEmail works', () => {
    expect(isEmail('test@example.com')).toBe(true)
    expect(isEmail('invalid')).toBe(false)
  })

  it('minLength works', () => {
    expect(minLength('abc', 2)).toBe(true)
    expect(minLength('a', 2)).toBe(false)
  })

  it('maxLength works', () => {
    expect(maxLength('abc', 5)).toBe(true)
    expect(maxLength('abcdef', 5)).toBe(false)
  })

  it('isPositiveNumber works', () => {
    expect(isPositiveNumber(5)).toBe(true)
    expect(isPositiveNumber(0)).toBe(false)
    expect(isPositiveNumber(-1)).toBe(false)
  })

  it('isValidDate works', () => {
    expect(isValidDate('2024-01-01')).toBe(true)
    expect(isValidDate('not-a-date')).toBe(false)
  })

  it('isDateInRange works for valid, too early, too late, and invalid date', () => {
    const today = new Date().toISOString().split('T')[0]
    expect(isDateInRange('2024-01-01')).toBe(true)
    expect(isDateInRange('1999-12-31')).toBe(false)
    expect(isDateInRange('3000-01-01')).toBe(false)
    expect(isDateInRange('not-a-date')).toBe(false)
    expect(isDateInRange(today)).toBe(true)
    expect(isDateInRange('2000-01-01')).toBe(true)
  })

  it('isValidCategory works for income', () => {
    expect(isValidCategory('Salary', 'INCOME')).toBe(true)
    expect(isValidCategory('Food & Dining', 'INCOME')).toBe(false)
  })

  it('isValidCategory works for expense', () => {
    expect(isValidCategory('Food & Dining', 'EXPENSE')).toBe(true)
    expect(isValidCategory('Salary', 'EXPENSE')).toBe(false)
  })
})
