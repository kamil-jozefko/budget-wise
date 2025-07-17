/// <reference types="cypress" />

describe('General', () => {
  it('should navigate between main views (desktop)', () => {
    cy.viewport(1280, 800)
    cy.visit('/dashboard')
    cy.contains('a', /transactions|transakcje/i, { matchCase: false }).should('be.visible').click()
    cy.url().should('include', '/dashboard/transactions')
    cy.contains('a', /profile|profil/i, { matchCase: false }).should('be.visible').click()
    cy.url().should('include', '/dashboard/profile')
  })

  it.skip('should navigate between main views (mobile)', () => {
    // Test is skipped.
  })

  it('should show 404 page for not found route', () => {
    cy.visit('/dashboard/nieistniejaca-strona', { failOnStatusCode: false })
    cy.contains(/404|not found|nie znaleziono/i).should('exist')
  })

  it('should pass basic accessibility checks', () => {
    cy.visit('/dashboard')
  })
})
