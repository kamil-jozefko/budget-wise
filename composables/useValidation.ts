import { TRANSACTION_CATEGORIES } from '~/types/transaction'

export const useValidation = () => {
  const isRequired = (value: string | number | null | undefined): boolean => {
    return value !== undefined && value !== null && value.toString().trim() !== ''
  }

  const isEmail = (value: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
  }

  const minLength = (value: string, length: number): boolean => {
    return value.length >= length
  }

  const maxLength = (value: string, length: number): boolean => {
    return value.length <= length
  }

  const isPositiveNumber = (value: number): boolean => {
    return value > 0
  }

  const isValidDate = (value: string): boolean => {
    return !isNaN(Date.parse(value))
  }

  const isValidCategory = (
    value: string,
    type: 'INCOME' | 'EXPENSE',
  ): boolean => {
    const validCategories = TRANSACTION_CATEGORIES[type]
    return validCategories.includes(value as string)
  }

  const isDateInRange = (value: string, min: string = '2000-01-01', max: string = new Date().toISOString().split('T')[0]): boolean => {
    if (!isValidDate(value)) return false
    return value >= min && value <= max
  }

  return {
    isRequired,
    isEmail,
    minLength,
    maxLength,
    isPositiveNumber,
    isValidDate,
    isValidCategory,
    isDateInRange,
  }
}
