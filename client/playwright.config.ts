import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    locale: "ko-KR",
  },

  projects: [
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

  webServer: {
    command: "TEST=true pnpm run build && pnpm run preview",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
});
