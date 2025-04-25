import { expect, test } from "./fixture";

test.beforeEach("로그인, 페이지 접근", async ({ app, auth }) => {
  await auth.authorize();
  await app.goto("/search");
});

test.describe("로그인 페이지로 리다이렉트", () => {
  test("유효하지 않은 토큰일 때", async ({ auth, app }) => {
    await auth.authorize(false);
    await app.waitForURL((url) => url.pathname === "/sign-in");
    expect(new URL(app.url()).pathname).toBe("/sign-in");
  });
});

test.describe("검색", () => {
  test("로딩", async ({ app }) => {
    await expect(
      app.getByTestId("유저 컨테이너").locator("button"),
    ).toHaveCount(5);
  });
});
