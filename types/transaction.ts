export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  category: string
  type: TransactionType
  createdAt?: Date
  updatedAt?: Date
}

export type TransactionFormData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & {
  category: TransactionCategory | ''
}

export type TransactionCategory
  = | 'Salary'
    | 'Freelance'
    | 'Investments'
    | 'Gifts'
    | 'Food & Dining'
    | 'Transportation'
    | 'Shopping'
    | 'Bills & Utilities'
    | 'Healthcare'
    | 'Travel'
    | 'Education'
    | 'Other'

export const TRANSACTION_CATEGORIES = {
  INCOME: [
    'Salary',
    'Freelance',
    'Investments',
    'Gifts',
    'Other',
  ] as const,
  EXPENSE: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Other',
  ] as const,
}
