const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: './cypress/support/e2e.js',
    specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: './cypress/fixtures',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
}) 