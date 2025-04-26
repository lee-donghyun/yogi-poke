import { test as base, Page } from "@playwright/test";

export const test = base
  .extend<{ app: Page }>({
    app: async ({ browser }, use) => {
      const context = await browser.newContext();
      await context.routeFromHAR("tests/har/localhost.har", {
        url: "**/api/**",
        notFound: "abort",
      });

      const page = await context.newPage();
      await page.evaluate(() => {
        // ky 버그
        // @see https://github.com/microsoft/playwright/issues/6479#issuecomment-2079000370
        Request.prototype.clone = function () {
          return this;
        };
      });

      await page.goto("/");
      await page.evaluate(() => {
        self.localStorage.setItem("IS_PWA", "1");
        self.localStorage.setItem("LOCALE", "ko");
      });
      await page.reload();
      await use(page);
    },
  })
  .extend<{ auth: { authorize: (valid?: boolean) => Promise<void> } }>({
    auth: async ({ app }, use) => {
      await app.route("**/api/user/my-info", async (route) => {
        const token = route.request().headers()["authorization"];
        if (token === "VALID") {
          return route.fulfill();
        }
        return route.fulfill({ status: 403 });
      });

      const authorize = async (valid: boolean = true) => {
        await app.evaluate((valid) => {
          localStorage.setItem("TOKEN", valid ? "VALID" : "INVALID");
        }, valid);
        await app.reload();
      };
      await use({ authorize });
    },
  });

export { expect } from "@playwright/test";
