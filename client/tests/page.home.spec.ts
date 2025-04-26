import { test, expect } from "./fixture";

test.beforeEach(async ({ app }) => {
  await app.goto("/");
});

test.describe("패스키가 없을 때", () => {
  test("조건부 로그인 버튼 렌더링", async ({ app }) => {
    await expect(app.getByTestId("로그인 방법 선택")).toMatchAriaSnapshot(`
    - group "로그인 방법 선택":
      - button "아이디로 로그인":
        - paragraph: 아이디로 로그인
    `);
  });
  test("아이디로 로그인 시트 열기", async ({ app }) => {
    await app.getByTestId("패스키 없이 로그인 버튼").click();
    await expect(app.getByTestId("아이디로 로그인 시트")).toMatchAriaSnapshot(`
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
  test.beforeEach("패스키 생성", async ({ app }) => {
    await app.addInitScript(() => {
      localStorage.setItem("PASSKEY_USER_ID", "1");
      globalThis.PublicKeyCredential = function () {
        throw new Error("PublicKeyCredential is not supported");
      } as any;
    });
    await app.reload();
  });
  test("조건부 로그인 버튼 렌더링", async ({ app }) => {
    await expect(app.getByTestId("로그인 방법 선택")).toMatchAriaSnapshot(`
    - group "로그인 방법 선택":
      - button "Passkey로 시작하기":
        - paragraph: Passkey로 시작하기
      - button "아이디로 로그인"
    `);
  });
  test("아이디로 로그인 시트 열기", async ({ app }) => {
    await app.getByTestId("패스키가 있지만, 패스키 없이 로그인 버튼").click();
    await expect(app.getByTestId("아이디로 로그인 시트")).toMatchAriaSnapshot(`
    - heading "아이디로 로그인" [level=2]
    - navigation "로그인 방법 선택":
      - link "회원가입":
        - /url: /register?
      - link "로그인":
        - /url: /sign-in
    `);
  });
});

test.describe("토큰이 있을 때", () => {
  test("유효한 토큰일때", async ({ auth, app }) => {
    await auth.authorize();
    await app.waitForURL((url) => url.pathname === "/search");
    expect(new URL(app.url()).pathname).toBe("/search");
  });
  test("유효하지 않은 토큰일때", async ({ auth, app }) => {
    await auth.unauthorize();
    await app.waitForURL((url) => url.pathname === "/");
    expect(new URL(app.url()).pathname).toBe("/");
  });
});
