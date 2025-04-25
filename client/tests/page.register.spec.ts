import { test, expect } from "@playwright/test";

const baseUrl = "http://127.0.0.1:5173/register?is-pwa=1";

test.beforeEach("set base url", async ({ page }) => {
  await page.goto(baseUrl);
  await page.evaluate(() => {
    // ky 버그
    // @see https://github.com/microsoft/playwright/issues/6479#issuecomment-2079000370
    Request.prototype.clone = function () {
      return this;
    };
  });
  await page.route("**/api/user/register", async (route) => {
    await route.fulfill({
      body: "bearer token",
    });
  });
});

test.describe("회원가입", () => {
  test("마우스로 회원가입", async ({ page }) => {
    await expect(page.getByTestId("이메일")).toBeFocused();
    await expect(page.getByTestId("회원가입 버튼")).toBeDisabled();
    await page.getByTestId("이메일").fill("testing");
    await expect(page.getByTestId("회원가입 버튼")).toBeEnabled();
    await page.getByTestId("회원가입 버튼").click();

    await expect(page.getByTestId("이름")).toBeFocused();
    await expect(page.getByTestId("회원가입 버튼")).toBeDisabled();
    await page.getByTestId("이름").fill("testing");
    await expect(page.getByTestId("회원가입 버튼")).toBeEnabled();
    await page.getByTestId("회원가입 버튼").click();

    await expect(page.getByTestId("비밀번호")).toBeFocused();
    await expect(page.getByTestId("회원가입 버튼")).toBeDisabled();
    await page.getByTestId("비밀번호").fill("testing");
    await expect(page.getByTestId("회원가입 버튼")).toBeEnabled();

    const [request] = await Promise.all([
      page.waitForRequest("**/api/user/register"),
      page.getByTestId("회원가입 버튼").click(),
    ]);

    expect(request.method()).toBe("POST");
    expect(request.postDataJSON()).toEqual({
      email: "testing",
      name: "testing",
      password: "testing",
      referrerId: null,
    });
  });
  test("키보드로 회원가입", async ({ page }) => {
    await expect(page.getByTestId("이메일")).toBeFocused();
    await expect(page.getByTestId("회원가입 버튼")).toBeDisabled();
    await page.getByTestId("이메일").fill("testing");
    await expect(page.getByTestId("회원가입 버튼")).toBeEnabled();
    await page.keyboard.press("Enter");

    await expect(page.getByTestId("이름")).toBeFocused();
    await expect(page.getByTestId("회원가입 버튼")).toBeDisabled();
    await page.getByTestId("이름").fill("testing");
    await expect(page.getByTestId("회원가입 버튼")).toBeEnabled();
    await page.keyboard.press("Enter");

    await expect(page.getByTestId("비밀번호")).toBeFocused();
    await expect(page.getByTestId("회원가입 버튼")).toBeDisabled();
    await page.getByTestId("비밀번호").fill("testing");
    await expect(page.getByTestId("회원가입 버튼")).toBeEnabled();

    const [request] = await Promise.all([
      page.waitForRequest("**/api/user/register"),
      page.keyboard.press("Enter"),
    ]);

    expect(request.method()).toBe("POST");
    expect(request.postDataJSON()).toEqual({
      email: "testing",
      name: "testing",
      password: "testing",
      referrerId: null,
    });
  });
});
