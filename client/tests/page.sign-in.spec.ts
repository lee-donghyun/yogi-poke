import { test, expect, Page } from "@playwright/test";

test.beforeEach("set base url", async ({ page }) => {
  await page.goto("/sign-in");
  await page.route("**/api/user/sign-in", async (route) => {
    await route.fulfill({
      body: "bearer token",
    });
  });
});

const checkSignInRequest = async (page: Page) => {
  const [request] = await Promise.all([
    page.waitForRequest("**/api/user/sign-in"),
    page.getByTestId("로그인 버튼").click(),
  ]);

  expect(request.method()).toBe("POST");
  expect(request.postDataJSON()).toEqual({
    email: "testing",
    password: "testing",
  });
};

test.describe("회원가입", () => {
  test("마우스로 회원가입", async ({ page }) => {
    await expect(page.getByTestId("이메일")).toBeFocused();
    await expect(page.getByTestId("로그인 버튼")).toBeDisabled();
    await page.getByTestId("이메일").fill("testing");
    await expect(page.getByTestId("로그인 버튼")).toBeEnabled();
    await page.getByTestId("로그인 버튼").click();

    await expect(page.getByTestId("비밀번호")).toBeFocused();
    await expect(page.getByTestId("로그인 버튼")).toBeDisabled();
    await page.getByTestId("비밀번호").fill("testing");
    await expect(page.getByTestId("로그인 버튼")).toBeEnabled();

    await checkSignInRequest(page);
  });
  test("키보드로 회원가입", async ({ page }) => {
    await expect(page.getByTestId("이메일")).toBeFocused();
    await expect(page.getByTestId("로그인 버튼")).toBeDisabled();
    await page.getByTestId("이메일").fill("testing");
    await expect(page.getByTestId("로그인 버튼")).toBeEnabled();
    await page.keyboard.press("Enter");

    await expect(page.getByTestId("비밀번호")).toBeFocused();
    await expect(page.getByTestId("로그인 버튼")).toBeDisabled();
    await page.getByTestId("비밀번호").fill("testing");
    await expect(page.getByTestId("로그인 버튼")).toBeEnabled();

    await checkSignInRequest(page);
  });
  test("유저 입력 검증", async ({ page }) => {
    await page.getByTestId("이메일").click();
    await page.getByTestId("이메일").fill("유효하지 않은 id");
    expect(page.getByTestId("로그인 버튼")).toBeDisabled();
    await page.getByTestId("이메일").click();
    await page.getByTestId("이메일").fill("testing");
    expect(page.getByTestId("로그인 버튼")).toBeEnabled();
    await page.getByTestId("로그인 버튼").click();

    await page.getByTestId("비밀번호").fill("testing");
    expect(page.getByTestId("로그인 버튼")).toBeEnabled();
    await page.getByTestId("비밀번호").fill("");
    expect(page.getByTestId("로그인 버튼")).toBeDisabled();
    await page.getByTestId("비밀번호").fill("testing");

    await checkSignInRequest(page);
  });

  test("숨김 요소에 대해 aria-hidden 테스트", async ({ page }) => {
    await expect(page.getByTestId("회원가입 폼")).toMatchAriaSnapshot(`
    - text: 아이디
    - textbox "아이디"
    - paragraph: 소문자 알파벳과 숫자, 언더바(_)만 사용가능합니다.
    `);
    await page.getByTestId("이메일").click();
    await page.getByTestId("이메일").fill("testing");
    await page.getByTestId("로그인 버튼").click();
    await expect(page.getByTestId("회원가입 폼")).toMatchAriaSnapshot(`
    - text: 비밀번호
    - textbox "비밀번호"
    - paragraph: 6자리 이상 입력해주세요.
    - text: 아이디
    - textbox "아이디": testing
    `);
    await page.getByTestId("비밀번호").click();
    await page.getByTestId("비밀번호").fill("testing");

    await checkSignInRequest(page);
  });
});
