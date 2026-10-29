// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { baseURL, isCI, allBrowsers } = require('./utils/environment');

const projects = [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }];
if (allBrowsers) {
  projects.push(
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  );
}

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects,
});
