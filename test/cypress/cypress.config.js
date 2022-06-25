const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3030/test/front",
    viewportHeight: 600,
    viewportWidth: 1000,
    component: {
      viewportHeight: 500,
      viewportWidth: 500,
    },
    video: false,
    specPattern: [
      "**/*.spec.js"
    ],
  },
});
