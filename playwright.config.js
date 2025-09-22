// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',          
  timeout: 30 * 1000,           // 30 seconds per test
  expect: {
    timeout: 5000,              // timeout for expect assertions
  },
  fullyParallel: true,          // run tests in parallel
  retries: 1,                   // retry once on failure
  reporter: [['list'], ['html', { open: 'never' }], ['allure-playwright'] ], // test reports
  use: {
    baseURL: 'http://localhost:3000', // your app URL
    headless: false,            // set true to run headless
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
