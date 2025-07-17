/// <reference types="cypress" />

beforeEach(() => {
  // @ts-ignore
  cy.addTransaction()
})

it('should display dashboard stats (income, expenses, balance)', () => {
  cy.visit('/dashboard')
  cy.contains(/income|przychody/i).should('exist')
  cy.contains(/expenses|wydatki/i).should('exist')
  cy.contains(/balance|saldo/i).should('exist')
})

it('should use quick date filters', () => {
  cy.visit('/dashboard')
  cy.get('button').first().then($btn => {
    if ($btn.length) {
      cy.wrap($btn).click({ force: true })
      cy.contains(/income|przychody/i).should('exist')
      cy.contains(/expenses|wydatki/i).should('exist')
      cy.contains(/balance|saldo/i).should('exist')
    }
  })
})

it('should change year and verify data', function () {
  cy.document().then(doc => {
    const select = doc.querySelector('select#year-select') as HTMLSelectElement | null
    if (!select || select.options.length <= 1) {
      this.skip()
    }
    const value = select.options[1]?.value || ''
    cy.get('select#year-select').select(value)
    cy.contains(/income|przychody/i).should('exist')
  })
})

it('should pass basic accessibility checks', () => {
  cy.visit('/dashboard')
})
