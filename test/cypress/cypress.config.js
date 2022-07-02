const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultCommandTimeout: 5000,
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      // e2e testing node events setup code
    },
    baseUrl: "http://localhost:3030/test/front",
    viewportHeight: 600,
    viewportWidth: 1000,
    specPattern: [
      "**/*.spec.js"
    ],
  },
});
