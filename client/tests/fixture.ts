import { test as base, Page } from "@playwright/test";

export const test = base
  .extend<{ app: Page }>({
    app: async ({ page, context }, use) => {
      await context.routeFromHAR("tests/har/localhost.har", {
        url: "**/api/**",
        notFound: "abort",
      });
      await context.route("https://static.is-not-a.store/**", (route) =>
        route.abort(),
      );

      await page.evaluate(() => {
        // ky 버그
        // @see https://github.com/microsoft/playwright/issues/6479#issuecomment-2079000370
        Request.prototype.clone = function () {
          return this;
        };
      });

      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.evaluate(async () => {
        self.localStorage.setItem("IS_PWA", "1");
        self.localStorage.setItem("LOCALE", "ko");
      });
      await page.reload({ waitUntil: "domcontentloaded" });

      await use(page);

      await context.unrouteAll();
    },
  })
  .extend<{ auth: Auth }>({
    auth: async ({ app }, use) => {
      await app.route("**/api/user/my-info", async (route) => {
        const token = route.request().headers()["authorization"];
        if (token === "VALID") {
          return route.fallback();
        }
        return route.fulfill({ status: 403 });
      });
      const auth = new Auth(app);

      await use(auth);
    },
  });

class Auth {
  constructor(private page: Page) {}

  async authorize() {
    await this.page.evaluate(async () => {
      localStorage.setItem("TOKEN", "VALID");
    });
    await this.page.reload();
  }
  async unauthorize() {
    await this.page.evaluate(async () => {
      localStorage.setItem("TOKEN", "INVALID");
    });
    await this.page.reload();
  }
}

export { expect } from "@playwright/test";
