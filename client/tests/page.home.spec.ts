import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("패스키가 없을 때", () => {
  test("조건부 로그인 버튼 렌더링", async ({ page }) => {
    await expect(page.getByTestId("로그인 방법 선택")).toMatchAriaSnapshot(`
    - group "로그인 방법 선택":
      - button "아이디로 로그인":
        - paragraph: 아이디로 로그인
    `);
  });
  test("아이디로 로그인 시트 열기", async ({ page }) => {
    await page.getByTestId("패스키 없이 로그인 버튼").click();
    await expect(page.getByTestId("아이디로 로그인 시트")).toMatchAriaSnapshot(`
    - heading "아이디로 로그인" [level=2]
    - navigation "로그인 방법 선택":
      - link "회원가입":
        - /url: /register?
      - link "로그인":
        - /url: /sign-in
    `);
  });
});

test.describe("패스키가 있을 때", () => {
  test.beforeEach("패스키 생성", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("PASSKEY_USER_ID", "1");
      globalThis.PublicKeyCredential = function () {
        throw new Error("PublicKeyCredential is not supported");
      } as any;
    });
    await page.reload();
  });
  test("조건부 로그인 버튼 렌더링", async ({ page }) => {
    await expect(page.getByTestId("로그인 방법 선택")).toMatchAriaSnapshot(`
    - group "로그인 방법 선택":
      - button "Passkey로 시작하기":
        - paragraph: Passkey로 시작하기
      - button "아이디로 로그인"
    `);
  });
  test("아이디로 로그인 시트 열기", async ({ page }) => {
    await page.getByTestId("패스키가 있지만, 패스키 없이 로그인 버튼").click();
    await expect(page.getByTestId("아이디로 로그인 시트")).toMatchAriaSnapshot(`
    - heading "아이디로 로그인" [level=2]
    - navigation "로그인 방법 선택":
      - link "회원가입":
        - /url: /register?
      - link "로그인":
        - /url: /sign-in
    `);
  });
});
