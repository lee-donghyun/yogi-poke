import { test as base, Page } from "@playwright/test";

export const test = base.extend<{
  app: Page;
  auth: { authorize: () => Promise<void> };
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
  auth: async ({ app }, use) => {
    const authorize = async () => {
      await app.evaluate(() => {
        localStorage.setItem("TOKEN", "bearer token");
      });
      await app.reload();
    };
    use({ authorize });
  },
});

export { expect } from "@playwright/test";
