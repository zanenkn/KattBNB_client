const { defineConfig } = require('cypress');

module.exports = defineConfig({
  "chromeWebSecurity": false,
  "retries": {
    "runMode": 3,
    "openMode": 3
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    experimentalRunAllSpecs: true
  }
});