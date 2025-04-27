import { Page } from "@playwright/test";
import { test, expect } from "./fixture";

test.beforeEach("set base url", async ({ app }) => {
  await app.goto("/register");
  await app.route("**/api/user/register", async (route) => {
    await route.fulfill({
      body: "bearer token",
    });
  });
});

const checkRegisterRequest = async (
  app: Page,
  payload: { referrerId: null | number } = { referrerId: null },
) => {
  const [request] = await Promise.all([
    app.waitForRequest("**/api/user/register"),
    app.getByTestId("회원가입 버튼").click(),
  ]);

  expect(request.method()).toBe("POST");
  expect(request.postDataJSON()).toEqual({
    email: "testing",
    name: "testing",
    password: "testing",
    ...payload,
  });
};

test.describe("회원가입", () => {
  test("마우스로 회원가입", async ({ app }) => {
    await expect(app.getByTestId("이메일")).toBeFocused();
    await expect(app.getByTestId("회원가입 버튼")).toBeDisabled();
    await app.getByTestId("이메일").fill("testing");
    await expect(app.getByTestId("회원가입 버튼")).toBeEnabled();
    await app.getByTestId("회원가입 버튼").click();

    await expect(app.getByTestId("이름")).toBeFocused();
    await expect(app.getByTestId("회원가입 버튼")).toBeDisabled();
    await app.getByTestId("이름").fill("testing");
    await expect(app.getByTestId("회원가입 버튼")).toBeEnabled();
    await app.getByTestId("회원가입 버튼").click();

    await expect(app.getByTestId("비밀번호")).toBeFocused();
    await expect(app.getByTestId("회원가입 버튼")).toBeDisabled();
    await app.getByTestId("비밀번호").fill("testing");
    await expect(app.getByTestId("회원가입 버튼")).toBeEnabled();

    await checkRegisterRequest(app);
  });
  test("키보드로 회원가입", async ({ app }) => {
    await expect(app.getByTestId("이메일")).toBeFocused();
    await expect(app.getByTestId("회원가입 버튼")).toBeDisabled();
    await app.getByTestId("이메일").fill("testing");
    await expect(app.getByTestId("회원가입 버튼")).toBeEnabled();
    await app.keyboard.press("Enter");

    await expect(app.getByTestId("이름")).toBeFocused();
    await expect(app.getByTestId("회원가입 버튼")).toBeDisabled();
    await app.getByTestId("이름").fill("testing");
    await expect(app.getByTestId("회원가입 버튼")).toBeEnabled();
    await app.keyboard.press("Enter");

    await expect(app.getByTestId("비밀번호")).toBeFocused();
    await expect(app.getByTestId("회원가입 버튼")).toBeDisabled();
    await app.getByTestId("비밀번호").fill("testing");
    await expect(app.getByTestId("회원가입 버튼")).toBeEnabled();

    await checkRegisterRequest(app);
  });
  test("유저 입력 검증", async ({ app }) => {
    await app.getByTestId("이메일").click();
    await app.getByTestId("이메일").fill("유효하지 않은 id");
    expect(app.getByTestId("회원가입 버튼")).toBeDisabled();
    await app.getByTestId("이메일").click();
    await app.getByTestId("이메일").fill("testing");
    expect(app.getByTestId("회원가입 버튼")).toBeEnabled();
    await app.getByTestId("회원가입 버튼").click();

    await app.getByTestId("이름").fill("유효한 이름");
    expect(app.getByTestId("회원가입 버튼")).toBeEnabled();
    await app.getByTestId("이름").fill("");
    expect(app.getByTestId("회원가입 버튼")).toBeDisabled();
    await app.getByTestId("이름").fill("testing");
    await app.getByTestId("회원가입 버튼").click();

    await app.getByTestId("비밀번호").fill("testing");
    expect(app.getByTestId("회원가입 버튼")).toBeEnabled();
    await app.getByTestId("비밀번호").fill("");
    expect(app.getByTestId("회원가입 버튼")).toBeDisabled();
    await app.getByTestId("비밀번호").fill("testing");

    await checkRegisterRequest(app);
  });

  test("숨김 요소에 대해 aria-hidden 테스트", async ({ app }) => {
    await expect(app.getByTestId("회원가입 폼")).toMatchAriaSnapshot(`
    - text: 아이디
    - textbox "아이디"
    - paragraph: 소문자 알파벳과 숫자, 언더바(_)만 사용가능합니다.
    `);
    await app.getByTestId("이메일").click();
    await app.getByTestId("이메일").fill("testing");
    await app.getByTestId("회원가입 버튼").click();
    await expect(app.getByTestId("회원가입 폼")).toMatchAriaSnapshot(`
    - text: 이름
    - textbox "이름"
    - paragraph: 1자리 이상 입력해주세요.
    - text: 아이디
    - textbox "아이디": testing
    `);
    await app.getByTestId("이름").click();
    await app.getByTestId("이름").fill("testing");
    await app.getByTestId("회원가입 버튼").click();
    await expect(app.getByTestId("회원가입 폼")).toMatchAriaSnapshot(`
    - text: 비밀번호
    - textbox "비밀번호"
    - paragraph: 6자리 이상 입력해주세요.
    - text: 이름
    - textbox "이름": testing
    - text: 아이디
    - textbox "아이디": testing
    `);
    await app.getByTestId("비밀번호").click();
    await app.getByTestId("비밀번호").fill("testing");

    await checkRegisterRequest(app);
  });

  test("referrerId가 있는 경우", async ({ app }) => {
    await app.goto("/register?tag=1");
    await app.getByTestId("이메일").click();
    await app.getByTestId("이메일").fill("testing");
    await app.getByTestId("회원가입 버튼").click();
    await app.getByTestId("이름").click();
    await app.getByTestId("이름").fill("testing");
    await app.getByTestId("회원가입 버튼").click();
    await app.getByTestId("비밀번호").click();
    await app.getByTestId("비밀번호").fill("testing");

    await checkRegisterRequest(app, { referrerId: 1 });
  });
});
