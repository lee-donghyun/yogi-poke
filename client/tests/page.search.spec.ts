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
  test("검색어 입력", async ({ app }) => {
    await app.getByTestId("검색어").click();
    await app.getByTestId("검색어").fill("d");
    expect(app.url()).toContain("/search?q=d");

    await expect(
      app.getByTestId("유저 컨테이너").locator("button"),
    ).toHaveCount(1);
  });
  test("검색어 삭제", async ({ app }) => {
    await app.getByTestId("검색어").click();
    await app.getByTestId("검색어").fill("d");
    expect(app.url()).toContain("/search?q=d");
    await app.getByTestId("검색어").fill("");
    expect(new URL(app.url()).searchParams.get("q")).toBeFalsy();

    await expect(
      app.getByTestId("유저 컨테이너").locator("button"),
    ).toHaveCount(5);
  });
  test("검색어 입력 후 유저 선택", async ({ app }) => {
    await app.getByTestId("검색어").click();
    await app.getByTestId("검색어").fill("d");

    await expect(
      app.getByTestId("유저 컨테이너").locator("button"),
    ).toHaveCount(1);

    await expect(app.getByTestId("콕찌르기 버튼")).toBeDisabled();

    await app.getByTestId("유저 컨테이너").locator("button").first().click();

    await expect(app.getByTestId("콕찌르기 버튼")).toBeEnabled();
  });

  test("유저 선택 후 콕찌르기 시트", async ({ app }) => {
    await expect(
      app.getByTestId("유저 컨테이너").locator("button"),
    ).toHaveCount(5);

    await app.getByTestId("유저 컨테이너").locator("button").first().click();

    await app.getByTestId("콕찌르기 버튼").click();

    await expect(
      app.getByTestId("콕찌르기 버튼 컨테이너").locator("button"),
    ).toHaveCount(4);
  });

  test("유저 선택 후 콕찌르기 시트 - 그림 찌르기", async ({ app }) => {
    await expect(
      app.getByTestId("유저 컨테이너").locator("button"),
    ).toHaveCount(5);

    await app.getByTestId("유저 컨테이너").locator("button").first().click();

    await app.getByTestId("콕찌르기 버튼").click();
    await expect(
      app.getByTestId("콕찌르기 버튼 컨테이너").locator("button"),
    ).toHaveCount(4);
    await app
      .getByTestId("콕찌르기 버튼 컨테이너")
      .locator("button")
      .nth(0)
      .click();
    await expect(app.getByTestId("그림 찌르기")).toBeInViewport();
  });

  test("유저 선택 후 콕찌르기 시트 - 내 위치 찌르기", async ({ app }) => {
    await expect(
      app.getByTestId("유저 컨테이너").locator("button"),
    ).toHaveCount(5);

    await app.getByTestId("유저 컨테이너").locator("button").first().click();

    await app.getByTestId("콕찌르기 버튼").click();
    await expect(
      app.getByTestId("콕찌르기 버튼 컨테이너").locator("button"),
    ).toHaveCount(4);
    await app
      .getByTestId("콕찌르기 버튼 컨테이너")
      .locator("button")
      .nth(1)
      .click();
    await expect(app.getByTestId("내 위치 찌르기")).toBeInViewport();
  });

  test("유저 선택 후 콕찌르기 시트 - 이모지", async ({ app }) => {
    await expect(
      app.getByTestId("유저 컨테이너").locator("button"),
    ).toHaveCount(5);

    await app.getByTestId("유저 컨테이너").locator("button").first().click();

    await app.getByTestId("콕찌르기 버튼").click();
    await expect(
      app.getByTestId("콕찌르기 버튼 컨테이너").locator("button"),
    ).toHaveCount(4);
    await app
      .getByTestId("콕찌르기 버튼 컨테이너")
      .locator("button")
      .nth(2)
      .click();
    await expect(app.getByTestId("이모티콘 찌르기")).toBeInViewport();
  });

  test("유저 선택 후 콕찌르기 시트 - 바로 콕 찌르기", async ({ app }) => {
    await expect(
      app.getByTestId("유저 컨테이너").locator("button"),
    ).toHaveCount(5);

    await app.getByTestId("유저 컨테이너").locator("button").first().click();

    await app.getByTestId("콕찌르기 버튼").click();
    await expect(
      app.getByTestId("콕찌르기 버튼 컨테이너").locator("button"),
    ).toHaveCount(4);
    const [request] = await Promise.all([
      app.waitForRequest("**/api/mate/poke"),
      app
        .getByTestId("콕찌르기 버튼 컨테이너")
        .locator("button")
        .nth(3)
        .click(),
    ]);
    expect(request.method()).toBe("POST");
  });
});
