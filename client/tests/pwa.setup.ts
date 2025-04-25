import { test as setup } from "@playwright/test";
import path from "path";

const authFile = path.join(import.meta.dirname, "./storageState.json");

setup("pwa 설정", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("IS_PWA", "1");
  });
  await page.context().storageState({ path: authFile });
});
