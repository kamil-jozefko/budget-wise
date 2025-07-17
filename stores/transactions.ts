import { defineStore } from 'pinia'
import { storageGet, storageSet } from '~/composables/useApiFetch'
import type { Transaction } from '~/types/transaction'

function generateId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`
}

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [] as Transaction[],
    stats: {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
    },
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async init() {
      await this.fetchTransactions()
      await this.fetchStats()
    },
    async fetchTransactions(filters = {}) {
      this.loading = true
      this.error = null
      try {
        let txs: Transaction[] = (await storageGet('transactions')) || []
        if (filters.type) {
          txs = txs.filter(t => t.type === filters.type)
        }
        if (filters.startDate) {
          txs = txs.filter(t => t.date >= filters.startDate)
        }
        if (filters.endDate) {
          txs = txs.filter(t => t.date <= filters.endDate)
        }
        this.transactions = txs
      }
      catch {
        this.error = 'Failed to load transactions.'
      }
      finally {
        this.loading = false
      }
    },
    async fetchStats() {
      this.loading = true
      this.error = null
      try {
        const txs: Transaction[] = (await storageGet('transactions')) || []
        const totalIncome = txs.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
        const totalExpenses = txs.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)
        this.stats = {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
        }
      }
      catch {
        this.error = 'Failed to load stats.'
      }
      finally {
        this.loading = false
      }
    },
    async addTransaction(transactionData: Omit<Transaction, 'id' | 'userId'>) {
      this.loading = true
      this.error = null
      try {
        const txs: Transaction[] = (await storageGet('transactions')) || []
        const newTx: Transaction = {
          ...transactionData,
          id: generateId(),
          type: transactionData.type as 'INCOME' | 'EXPENSE',
        }
        txs.push(newTx)
        await storageSet('transactions', txs)
        await this.fetchTransactions()
        await this.fetchStats()
        return { data: newTx, error: null }
      }
      catch {
        this.error = 'Failed to add transaction.'
        return { data: null, error: this.error }
      }
      finally {
        this.loading = false
      }
    },
    async updateTransaction(id: string, updates: Partial<Transaction>) {
      this.loading = true
      this.error = null
      try {
        const txs: Transaction[] = (await storageGet('transactions')) || []
        const idx = txs.findIndex(t => t.id === id)
        if (idx === -1) throw new Error('Not found')
        txs[idx] = { ...txs[idx], ...updates, updatedAt: new Date() }
        await storageSet('transactions', txs)
        await this.fetchTransactions()
        await this.fetchStats()
        return { data: txs[idx], error: null }
      }
      catch {
        this.error = 'Failed to update transaction.'
        return { data: null, error: this.error }
      }
      finally {
        this.loading = false
      }
    },
    async deleteTransaction(id: string) {
      this.loading = true
      this.error = null
      try {
        let txs: Transaction[] = (await storageGet('transactions')) || []
        txs = txs.filter(t => t.id !== id)
        await storageSet('transactions', txs)
        await this.fetchTransactions()
        await this.fetchStats()
        return { data: true, error: null }
      }
      catch {
        this.error = 'Failed to delete transaction.'
        return { data: null, error: this.error }
      }
      finally {
        this.loading = false
      }
    },
    async generateMockData() {
      this.loading = true
      this.error = null
      try {
        const now = new Date()
        const start = new Date(now.getFullYear() - 1, now.getMonth(), 1)
        const end = new Date(now.getFullYear(), now.getMonth(), 1)
        const dummyTransactions = []
        const expenseCategories = [
          'Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Healthcare', 'Travel', 'Education', 'Other',
        ]
        const current = new Date(start)
        while (current <= end) {
          dummyTransactions.push({
            id: generateId(),
            amount: 2000 + Math.floor(Math.random() * 2000),
            description: 'Monthly Salary',
            date: current.toISOString().slice(0, 10),
            category: 'Salary',
            type: 'INCOME',
            createdAt: new Date(current),
            updatedAt: new Date(current),
          })
          const numExpenses = 2 + Math.floor(Math.random() * 3)
          for (let i = 0; i < numExpenses; i++) {
            const day = 1 + Math.floor(Math.random() * 27)
            const expenseDate = new Date(current.getFullYear(), current.getMonth(), day)
            dummyTransactions.push({
              id: generateId(),
              amount: 20 + Math.floor(Math.random() * 500),
              description: expenseCategories[i % expenseCategories.length],
              date: expenseDate.toISOString().slice(0, 10),
              category: expenseCategories[i % expenseCategories.length],
              type: 'EXPENSE',
              createdAt: new Date(expenseDate),
              updatedAt: new Date(expenseDate),
            })
          }
          current.setMonth(current.getMonth() + 1)
        }
        await storageSet('transactions', dummyTransactions)
        await this.fetchTransactions()
        await this.fetchStats()
      }
      catch {
        this.error = 'Failed to generate mock data.'
      }
      finally {
        this.loading = false
      }
    },
  },
})
