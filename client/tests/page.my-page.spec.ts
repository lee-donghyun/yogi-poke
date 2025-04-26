import { expect, test } from "./fixture";

test.beforeEach("로그인, 페이지 접근", async ({ app, auth }) => {
  await auth.authorize();
  await app.goto("/my-page");
});

test.describe("로그인 페이지로 리다이렉트", () => {
  test("유효하지 않은 토큰일 때", async ({ auth, app }) => {
    await auth.authorize(false);
    await app.waitForURL((url) => url.pathname === "/sign-in");
    expect(new URL(app.url()).pathname).toBe("/sign-in");
  });
});

test.describe("콕 찌르기", () => {
  test("기록 로드", async ({ app }) => {
    await expect
      .poll(() => app.getByTestId("콕찌르기 기록").locator("> li").count())
      .toBeGreaterThan(10);
  });
  test("나도 콕 찌르기", async ({ app }) => {
    await app.getByTestId("나도 콕 찌르기").first().click();
    await expect(app.getByTestId("콕찌르기 시트")).toBeInViewport();
  });
  test("받은 그림 보기", async ({ app }) => {
    await app.getByTestId("받은 그림 보기").first().click();
    await expect(app.getByTestId("그림 보기")).toBeInViewport();
  });
  test("보낸 그림 보기", async ({ app }) => {
    await app.getByTestId("보낸 그림 보기").first().click();
    await expect(app.getByTestId("그림 보기")).toBeInViewport();
  });
  test("받은 위치 보기", async ({ app }) => {
    await app.getByTestId("받은 위치 보기").first().click();
    await expect(app.getByTestId("위치 보기")).toBeInViewport();
  });
  test("보낸 위치 보기", async ({ app }) => {
    await app.getByTestId("보낸 위치 보기").first().click();
    await expect(app.getByTestId("위치 보기")).toBeInViewport();
  });
});
