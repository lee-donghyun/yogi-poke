import { Page } from "@playwright/test";
import { expect, test } from "./fixture";

test.beforeEach("로그인, 컴포넌트 접근", async ({ app, auth }) => {
  await auth.authorize();
  await app.goto("/search");
});

const openSheet = async (app: Page) => {
  await app.getByTestId("유저 컨테이너").locator("button").first().click();
  await app.getByTestId("콕찌르기 버튼").click();

  await app
    .getByTestId("콕찌르기 버튼 컨테이너")
    .locator("button")
    .nth(0)
    .click();
  await expect(
    app.getByTestId("그림 찌르기").locator(".konvajs-content"),
  ).toBeInViewport();
};

const drawLine = async (app: Page) => {
  const { height, width, x, y } = (await app
    .getByTestId("그림 찌르기")
    .locator(".konvajs-content")
    .boundingBox())!;
  await app.mouse.move(x + width / 10, y + height / 10);
  await app.mouse.down();
  await app.mouse.move(x + width - width / 10, y + height - height / 10, {
    steps: 15,
  });
  await app.mouse.up();
};

test.describe("콕 찌르기", () => {
  test("그림 그리기", async ({ app }) => {
    await openSheet(app);
    await drawLine(app);
  });
  test("찌르기 버튼 활성화", async ({ app }) => {
    await openSheet(app);
    await expect(app.getByTestId("찌르기 버튼")).toBeDisabled();
    await drawLine(app);
    await expect(app.getByTestId("찌르기 버튼")).toBeEnabled();
  });
  test("초기화 버튼 로직", async ({ app }) => {
    await openSheet(app);
    await expect(app.getByTestId("그림 지우기")).not.toBeVisible();
    await drawLine(app);
    await expect(app.getByTestId("그림 지우기")).toBeVisible();
    await app.getByTestId("그림 지우기").click();
    await expect(app.getByTestId("그림 지우기")).not.toBeVisible();
    await expect(app.getByTestId("찌르기 버튼")).toBeDisabled();
  });
  test("보내기 버튼", async ({ app }) => {
    await openSheet(app);
    await drawLine(app);

    const [request] = await Promise.all([
      app.waitForRequest("**/api/mate/poke"),
      app.getByTestId("찌르기 버튼").click(),
    ]);

    expect(request.method()).toBe("POST");
    expect(request.postDataJSON()).toMatchObject({
      payload: {
        lines: expect.any(Array),
        type: "drawing",
      },
    });
  });
});
