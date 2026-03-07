// playwright.config.js
// Requires: NODE_PATH=/opt/node22/lib/node_modules (set in npm scripts)
// Browser binaries: ~/.cache/ms-playwright (installed with global playwright)

const { defineConfig } = require('playwright/test');

module.exports = defineConfig({
    testDir: './tests/e2e',

    // Fail fast — stop on first failure during CI-style runs
    // Use --reporter=list for readable local output
    reporter: 'list',

    use: {
        baseURL: 'http://localhost:8181',
        headless: true,
        // Give the canvas a moment to paint before assertions
        actionTimeout: 5000,
    },

    // Spin up http-server before any tests run, shut it down after
    webServer: {
        command: 'http-server . -p 8181 --silent',
        url: 'http://localhost:8181',
        reuseExistingServer: true,
        timeout: 8000,
    },

    // One retry for flaky timing-sensitive tests
    retries: 1,
});
