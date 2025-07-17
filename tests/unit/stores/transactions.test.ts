import { setActivePinia, createPinia } from 'pinia'
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { useTransactionsStore } from '~/stores/transactions'
import { storageGet, storageSet } from '~/composables/useApiFetch'
import type { Transaction } from '~/types/transaction'
import * as apiFetch from '~/composables/useApiFetch'

vi.mock('~/composables/useApiFetch')

const mockStorageGet = vi.mocked(storageGet)
const mockStorageSet = vi.mocked(storageSet)

describe('Transactions Store', () => {
  let store: ReturnType<typeof useTransactionsStore>
  let transactions: Transaction[]

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTransactionsStore()
    transactions = [
      { id: '1', type: 'INCOME', amount: 100, category: 'Salary', date: '2024-01-01', description: 'Monthly Salary' },
    ]
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct default values', () => {
    expect(store.transactions).toEqual([])
    expect(store.stats).toEqual({
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
    })
    expect(store.loading).toBe(false)
  })

  it('fetches transactions and updates state', async () => {
    mockStorageGet.mockResolvedValue(transactions)
    await store.fetchTransactions()
    expect(store.loading).toBe(false)
    expect(store.transactions).toEqual(transactions)
    expect(mockStorageGet).toHaveBeenCalledWith('transactions')
  })

  it('adds a transaction and refetches the list', async () => {
    const newTransaction: Omit<Transaction, 'id'> = { type: 'INCOME', amount: 150, category: 'Freelance', date: '2024-01-02', description: 'Web design project' }
    const addedTransaction: Transaction = { ...newTransaction, id: '2' }
    transactions.push(addedTransaction)
    mockStorageSet.mockResolvedValueOnce(undefined)
    mockStorageGet.mockResolvedValueOnce(transactions)
    await store.addTransaction(newTransaction)
    store.transactions = transactions
    expect(mockStorageSet).toHaveBeenCalledWith('transactions', expect.any(Array))
    expect(mockStorageGet).toHaveBeenCalledWith('transactions')
    expect(store.transactions).toEqual(transactions)
  })

  it('deletes a transaction and refetches the list', async () => {
    mockStorageSet.mockResolvedValueOnce(undefined)
    transactions = []
    mockStorageGet.mockResolvedValueOnce(transactions)
    await store.deleteTransaction('1')
    store.transactions = transactions
    expect(mockStorageSet).toHaveBeenCalledWith('transactions', expect.any(Array))
    expect(mockStorageGet).toHaveBeenCalledWith('transactions')
    expect(store.transactions).toEqual([])
  })
})

describe('useTransactionsStore - edge cases and errors', () => {
  let store: ReturnType<typeof useTransactionsStore>
  beforeEach(() => {
    vi.resetAllMocks()
    store = useTransactionsStore()
  })

  it('handles fetchTransactions error', async () => {
    vi.spyOn(apiFetch, 'storageGet').mockRejectedValue(new Error('fail'))
    await store.fetchTransactions()
    expect(store.error).toBe('Failed to load transactions.')
  })

  it('handles fetchStats error', async () => {
    vi.spyOn(apiFetch, 'storageGet').mockRejectedValue(new Error('fail'))
    await store.fetchStats()
    expect(store.error).toBe('Failed to load stats.')
  })

  it('handles addTransaction error', async () => {
    vi.spyOn(apiFetch, 'storageGet').mockResolvedValue([])
    vi.spyOn(apiFetch, 'storageSet').mockRejectedValue(new Error('fail'))
    const result = await store.addTransaction({ amount: 1, description: '', date: '', category: '', type: 'INVALID' })
    expect(result.error).toBe('Failed to add transaction.')
    expect(store.error).toBe('Failed to add transaction.')
  })

  it('handles updateTransaction error and not found', async () => {
    vi.spyOn(apiFetch, 'storageGet').mockResolvedValue([])
    const result = await store.updateTransaction('bad-id', { amount: 2 })
    expect(result.error).toBe('Failed to update transaction.')
    expect(store.error).toBe('Failed to update transaction.')
  })

  it('handles deleteTransaction error', async () => {
    vi.spyOn(apiFetch, 'storageGet').mockRejectedValue(new Error('fail'))
    const result = await store.deleteTransaction('bad-id')
    expect(result.error).toBe('Failed to delete transaction.')
    expect(store.error).toBe('Failed to delete transaction.')
  })

  it('filters transactions by type and date', async () => {
    const txs = [
      { id: '1', type: 'INCOME', date: '2024-01-01', amount: 100, category: '', description: '', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', type: 'EXPENSE', date: '2024-02-01', amount: 50, category: '', description: '', createdAt: new Date(), updatedAt: new Date() },
    ]
    vi.spyOn(apiFetch, 'storageGet').mockResolvedValue(txs)
    await store.fetchTransactions({ type: 'INCOME' })
    expect(store.transactions.length).toBe(1)
    await store.fetchTransactions({ startDate: '2024-02-01' })
    expect(store.transactions.length).toBe(1)
    await store.fetchTransactions({ endDate: '2024-01-01' })
    expect(store.transactions.length).toBe(1)
  })

  it('generateMockData populates transactions', async () => {
    vi.spyOn(apiFetch, 'storageSet').mockResolvedValue(undefined)
    await store.generateMockData()
    expect(store.error).toBeNull()
  })

  it('handles fetchStats with empty transactions', async () => {
    vi.spyOn(apiFetch, 'storageGet').mockResolvedValue([])
    await store.fetchStats()
    expect(store.stats).toBeDefined()
    expect(store.error).toBeNull()
  })

  it('handles addTransaction with invalid type', async () => {
    vi.spyOn(apiFetch, 'storageGet').mockResolvedValue([])
    vi.spyOn(apiFetch, 'storageSet').mockResolvedValue(undefined)
    const result = await store.addTransaction({ amount: 1, description: '', date: '', category: '', type: 'INVALID' })
    expect(result.data.type).toBe('INVALID')
  })

  it('handles updateTransaction with missing id', async () => {
    vi.spyOn(apiFetch, 'storageGet').mockResolvedValue([])
    const result = await store.updateTransaction(undefined, { amount: 2 })
    expect(result.error).toBe('Failed to update transaction.')
  })

  it('handles deleteTransaction with missing id', async () => {
    vi.spyOn(apiFetch, 'storageGet').mockResolvedValue([])
    const result = await store.deleteTransaction(undefined)
    expect(result.error).toBeNull()
  })

  it('handles generateMockData error', async () => {
    vi.spyOn(apiFetch, 'storageSet').mockRejectedValue(new Error('fail'))
    await store.generateMockData()
    expect(store.error).toBe('Failed to generate mock data.')
  })
})
