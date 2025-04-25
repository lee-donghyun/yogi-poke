import { test as setup } from "@playwright/test";
import path from "path";

const authFile = path.join(import.meta.dirname, "./storage-state.json");

setup("글로벌 셋업", async ({ page }) => {
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
  await page.context().storageState({ path: authFile });
});
