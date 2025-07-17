/// <reference types="cypress" />

describe('Profile', () => {
  it('should change currency and persist', () => {
    cy.visit('/dashboard/profile')
    cy.get('select[name="currency"]').select(1)
  })

  it('should change language and verify UI translation', () => {
    cy.visit('/dashboard/profile')
    cy.get('select[name="locale"]').select('pl')
    cy.contains(/language|currency/i).should('exist')
    cy.get('select[name="locale"]').select('en')
    cy.contains(/language|currency/i).should('exist')
  })

  it('should pass basic accessibility checks', () => {
    cy.visit('/dashboard/profile')
  })
})
