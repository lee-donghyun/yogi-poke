import { test as base, Page } from "@playwright/test";

export const test = base.extend<{
  app: Page;
  auth: { authorize: (valid?: boolean) => Promise<void> };
}>({
  app: async ({ page }, use) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("IS_PWA", "1");
    });
    await page.evaluate(() => {
      // ky 버그
      // @see https://github.com/microsoft/playwright/issues/6479#issuecomment-2079000370
      Request.prototype.clone = function () {
        return this;
      };
    });

    await use(page);
  },
  auth: async ({ page }, use) => {
    await page.route("**/api/user/my-info", async (route) => {
      const token = route.request().headers()["authorization"];
      if (token === "VALID") {
        return route.fulfill();
      }
      return route.abort();
    });

    const authorize = async (valid: boolean = true) => {
      await page.evaluate((valid) => {
        localStorage.setItem("TOKEN", valid ? "VALID" : "INVALID");
      }, valid);
      await page.reload();
    };
    await use({ authorize });
  },
});

export { expect } from "@playwright/test";
