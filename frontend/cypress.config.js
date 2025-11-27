const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  video: false,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000,
});
