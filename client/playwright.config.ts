import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    locale: "ko-KR",
  },

  /* Configure projects for major browsers */
  projects: [
    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome Pixel 5",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Chrome Pixel 7",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "Mobile Safari iPhone 14",
      use: { ...devices["iPhone 14 Pro"] },
    },
    {
      name: "Mobile Safari iPhone 14 Pro Max",
      use: { ...devices["iPhone 14 Pro Max"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm run dev --host",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
  },
});
