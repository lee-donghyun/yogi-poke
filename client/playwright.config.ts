import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    locale: "ko-KR",
  },

  projects: [
    {
      name: "PWA 설정",
      testMatch: /pwa\.setup\.ts/,
    },
    {
      name: "Mobile Chrome Pixel 5",
      use: { ...devices["Pixel 5"], storageState: "tests/storage-state.json" },
      dependencies: ["PWA 설정"],
    },
    {
      name: "Mobile Chrome Pixel 7",
      use: { ...devices["Pixel 7"], storageState: "tests/storage-state.json" },
      dependencies: ["PWA 설정"],
    },
    {
      name: "Mobile Safari iPhone 14",
      use: {
        ...devices["iPhone 14 Pro"],
        storageState: "tests/storage-state.json",
      },
      dependencies: ["PWA 설정"],
    },
    {
      name: "Mobile Safari iPhone 14 Pro Max",
      use: {
        ...devices["iPhone 14 Pro Max"],
        storageState: "tests/storage-state.json",
      },
      dependencies: ["PWA 설정"],
    },
  ],

  webServer: {
    command: "pnpm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
