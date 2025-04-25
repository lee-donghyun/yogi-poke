import { test } from "./fixture";

test("로그인, 페이지 접근", async ({ auth }) => {
  await auth.authorize();
});
