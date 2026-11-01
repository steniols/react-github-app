// E2E tests. They start their own API (NODE_ENV=test, test database) and client,
// so they don't touch the development servers or data. Requires `npm run db`.
const { defineConfig, devices } = require("@playwright/test");

const API_PORT = 8013;
const CLIENT_PORT = 3010;

module.exports = defineConfig({
  testDir: "./e2e",
  globalSetup: require.resolve("./e2e/global-setup"),
  // Tests share the logged user and its data, so run them in order
  fullyParallel: false,
  workers: 1,
  timeout: 90000,
  expect: { timeout: 15000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${CLIENT_PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node server.js",
      port: API_PORT,
      env: { NODE_ENV: "test", PORT: String(API_PORT) },
      reuseExistingServer: false,
    },
    {
      command: "npm --prefix client run dev",
      port: CLIENT_PORT,
      env: {
        APP_URL: `http://localhost:${CLIENT_PORT}`,
        API_PROXY_TARGET: `http://localhost:${API_PORT}`,
      },
      reuseExistingServer: false,
    },
  ],
});
