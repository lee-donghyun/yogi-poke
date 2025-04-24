import { test, expect } from "@playwright/test";

const baseUrl = "http://127.0.0.1:5173/?is-pwa=1";

test.beforeEach("set base url", async ({ page }) => {
  await page.goto(baseUrl);
});

test.describe("패스키가 없을 때", () => {
  test("로그인", async ({ page }) => {
    await expect(page.getByTestId("로그인 방법 선택")).toMatchAriaSnapshot(`
    - group "로그인 방법 선택":
      - button "아이디로 로그인":
        - paragraph: 아이디로 로그인
    `);
    await page.getByTestId("패스키 없이 로그인 버튼").click();
    await expect(page.getByTestId("아이디로 로그인 시트")).toMatchAriaSnapshot(`
    - heading "아이디로 로그인" [level=2]
    - navigation "로그인 방법 선택":
      - link "회원가입":
        - /url: /register?is-pwa=1
      - link "로그인":
        - /url: /sign-in
    `);
  });
  test("회원가입", async ({ page }) => {});
});

test.describe("패스키가 있을 때", () => {
  test.beforeEach("패스키 생성", async ({ page }) => {
    await page.evaluate(() => localStorage.setItem("PASSKEY_USER_ID", "1"));
  });
  test("로그인", async ({ page }) => {});
});
