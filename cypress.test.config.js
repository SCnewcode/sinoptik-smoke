const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  viewportHeight: 800,
  viewportWidth: 800,
  videoCompression: false,
  e2e: {
    setupNodeEvents(on, config) {},
  },
  env: {
           development: {
            baseUrl: "https://ua.sinoptik.ua/"
          },
  }

});