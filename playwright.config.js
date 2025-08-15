// Playwright Configuration

module.exports = {
  testDir: ".",
  testMatch: "*.spec.js",
  timeout: 30000,
  retries: 1,
  workers: 2,

  use: {
    baseURL: "http://localhost:8000",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "webkit",
      use: { browserName: "webkit" },
    },
  ],

  reporter: [["html"], ["line"]],

  webServer: {
    command: "python3 -m http.server 8000",
    port: 8000,
    reuseExistingServer: true,
  },
};
