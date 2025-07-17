/// <reference types="cypress" />

interface AddTransactionOptions {
  amount?: string
  description?: string
  date?: string
  type?: 'INCOME' | 'EXPENSE'
}

declare global {
  var addTransaction: (options?: AddTransactionOptions) => void
}

Cypress.Commands.add('addTransaction', ({ amount = '123.45', description = 'Test transaction E2E', date = '2024-07-17', type = 'INCOME' } = {}) => {
  cy.visit('/dashboard/transactions/new')
  cy.get('input[name="amount"]').clear().type(amount)
  cy.get('input[name="description"]').clear().type(description)
  cy.get('input[name="date"]').clear().type(date)
  cy.get('select[name="type"]').select(type)
  const expectedCategory = type === 'INCOME' ? 'Salary' : 'Food & Dining'
  cy.get('select[name="category"]').should('be.visible').then(($select) => {
    cy.wrap($select).find('option').should('contain.text', expectedCategory)
    cy.get('select[name="category"]').select(expectedCategory)
    cy.get('select[name="category"]').should('have.value', expectedCategory)
  })
  cy.get('button[type="submit"]').should('not.be.disabled').click()
  cy.contains(/success|dodano|added/i, { timeout: 5000 }).should('exist')
  cy.url().should('include', '/dashboard/transactions')
  cy.contains(description).should('exist')
})

Cypress.Commands.add('stubDateRange', () => {
  cy.window().then((win) => {
    // Only stub if not already defined
    if (!('dateRange' in win)) {
      // Provide a minimal stub for dateRange
      win.dateRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
        setRange: () => {},
      }
    }
  })
})
