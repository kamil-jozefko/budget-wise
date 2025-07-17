import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    video: true,
    specPattern: 'cypress/e2e/**/**/*.cy.ts',
    setupNodeEvents() {},
  },
})
