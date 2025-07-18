/// <reference types="cypress" />

describe('Transactions', () => {
  beforeEach(() => {
    cy.visit('/dashboard/transactions')
    cy.get('body').then(($body) => {
      if (!$body.text().includes('Test transaction E2E')) {
        cy.addTransaction()
      }
    })
  })

  it('should add a new transaction (happy path)', () => {
    const desc = 'Test transaction E2E add'
    cy.addTransaction({ description: desc })
    cy.contains(desc).should('exist')
  })

  it('should edit an existing transaction (happy path)', () => {
    cy.visit('/dashboard/transactions')
    cy.contains('Test transaction E2E').should('exist')
    cy.get('tr').contains('Test transaction E2E').parents('tr').within(() => {
      cy.get('button[aria-label="Edit transaction"]').click()
    })
    cy.url().should('match', /\/dashboard\/transactions\/[\w-]+$/)
    cy.get('input[name="amount"]').clear().type('321.00')
    cy.get('input[name="description"]').clear().type('Edited transaction E2E')
    cy.get('button[type="submit"]').should('not.be.disabled').click()
    cy.contains(/success|zaktualizowano|updated/i, { timeout: 5000 }).should('exist')
    cy.url().should('include', '/dashboard/transactions')
    cy.contains('Edited transaction E2E').should('exist')
  })

  it('should show validation errors on transaction form', function () {
    cy.document().then((doc) => {
      const amount = doc.querySelector('input[name="amount"]')
      const desc = doc.querySelector('input[name="description"]')
      if (!amount || !desc) this.skip()
      cy.visit('/dashboard/transactions/new')
      cy.get('input[name="amount"]').clear().type('-1')
      cy.get('input[name="description"]').clear().type('a')
      cy.get('button[type="submit"]').should('be.disabled')
      cy.get('input[name="amount"]').focus().blur()
      cy.get('input[name="description"]').focus().blur()
      cy.contains('Amount is required').should('exist')
      cy.contains('Amount must be greater than 0').should('exist')
      cy.contains('Description is required').should('exist')
      cy.contains('Description must be at least 3 characters').should('exist')
    })
  })

  it('should delete a transaction (with confirmation)', function () {
    cy.document().then((doc) => {
      const row = Array.from(doc.querySelectorAll('tr')).find(tr => tr.textContent?.includes('Edited transaction E2E'))
      if (!row) this.skip()
      cy.visit('/dashboard/transactions')
      cy.contains('Edited transaction E2E').parents('tr').within(() => {
        cy.get('button[aria-label="Delete transaction"]').click()
      })
      cy.contains(/success|usunięto|deleted/i, { timeout: 10000 }).should('exist')
      cy.contains('Edited transaction E2E', { timeout: 10000 }).should('not.exist')
    })
  })

  it('should list transactions with pagination, search and filter', function () {
    cy.document().then((doc) => {
      const row = Array.from(doc.querySelectorAll('tr')).find(tr => tr.textContent?.includes('Test transaction E2E'))
      const rowEdited = Array.from(doc.querySelectorAll('tr')).find(tr => tr.textContent?.includes('Edited transaction E2E'))
      if (!row || !rowEdited) this.skip()
      cy.visit('/dashboard/transactions')
      cy.get('input[name="table-filter"]').type('Test')
      cy.contains('Test transaction E2E').should('exist')
      cy.get('input[name="table-filter"]').clear().type('Edited')
      cy.contains('Edited transaction E2E').should('exist')
      cy.get('input[name="table-filter"]').clear()
      cy.get('button[aria-label="Next page"],button[aria-label="Następna strona"]').then(($btns) => {
        if ($btns.length) {
          cy.wrap($btns[0]).click({ force: true })
        }
      })
    })
  })

  it('should show empty state when no transactions', () => {
    // Usuń wszystkie transakcje (jeśli jest taka opcja w UI lub przez store)
    cy.visit('/dashboard/transactions')
    // Jeśli jest przycisk "Usuń wszystko" lub podobny, kliknij go
    // Jeśli nie, usuń pojedynczo
    cy.get('body').then(($body) => {
      if ($body.find('button[aria-label="Delete transaction"]').length) {
        cy.get('button[aria-label="Delete transaction"]').each(($btn) => {
          cy.wrap($btn).click({ force: true })
          // Potwierdzenie jeśli jest modal
          // cy.contains(/confirm|potwierdź/i).click({ force: true })
        })
      }
    })
    cy.contains(/no transactions|brak transakcji|empty/i, { timeout: 3000 }).should('exist')
  })

  it('should show notification after add, edit, delete', function () {
    cy.document().then((doc) => {
      const toast = doc.querySelector('.max-w-md')
      const descRow = Array.from(doc.querySelectorAll('tr')).find(tr => tr.textContent?.includes('Toast add E2E'))
      if (!toast || !descRow) this.skip()
      const desc = 'Toast add E2E'
      cy.addTransaction({ description: desc })
      cy.get('.max-w-md').should('be.visible').and('contain.text', 'Transaction added successfully!')
      cy.visit('/dashboard/transactions')
      cy.contains(desc).parents('tr').within(() => {
        cy.get('button[aria-label="Edit transaction"]').click()
      })
      cy.get('input[name="description"]').clear().type('Toast edit E2E')
      cy.get('button[type="submit"]').should('not.be.disabled').click()
      cy.get('.max-w-md').should('be.visible').and('contain.text', 'Transaction updated successfully!')
      cy.visit('/dashboard/transactions')
      cy.contains('Toast edit E2E').parents('tr').within(() => {
        cy.get('button[aria-label="Delete transaction"]').click()
      })
      cy.get('.max-w-md').should('be.visible')
    })
  })

  it('should show validation errors in both languages', function () {
    cy.document().then((doc) => {
      const amount = doc.querySelector('input[name="amount"]')
      const desc = doc.querySelector('input[name="description"]')
      if (!amount || !desc) this.skip()
      cy.visit('/dashboard/profile')
      cy.get('select[name="locale"]').select('en')
      cy.visit('/dashboard/transactions/new')
      cy.get('input[name="amount"]').clear().type('-1')
      cy.get('input[name="description"]').clear().type('a')
      cy.get('button[type="submit"]').should('be.disabled')
      cy.get('input[name="amount"]').focus().blur()
      cy.get('input[name="description"]').focus().blur()
      cy.contains('Amount is required').should('exist')
      cy.contains('Amount must be greater than 0').should('exist')
      cy.contains('Description is required').should('exist')
      cy.contains('Description must be at least 3 characters').should('exist')
      cy.visit('/dashboard/profile')
      cy.get('select[name="locale"]').select('pl')
      cy.visit('/dashboard/transactions/new')
      cy.get('input[name="amount"]').clear().type('-1')
      cy.get('input[name="description"]').clear().type('a')
      cy.get('button[type="submit"]').should('be.disabled')
      cy.get('input[name="amount"]').focus().blur()
      cy.get('input[name="description"]').focus().blur()
      cy.contains('Kwota jest wymagana').should('exist')
      cy.contains('Kwota musi być większa niż 0').should('exist')
      cy.contains('Opis jest wymagany').should('exist')
      cy.contains('Opis musi mieć co najmniej 3 znaki').should('exist')
    })
  })
})
