import { msg } from "@lingui/core/macro";

export const validator = {
  email: (email: string) =>
    !/^[a-z,_,0-9]+$/.test(email)
      ? msg`소문자 알파벳과 숫자, 언더바(_)만 사용가능합니다.`
      : null,
  name: (name: string) =>
    name.length === 0 ? msg`1자리 이상 입력해주세요.` : null,
  password: (password: string) =>
    password.length < 6 ? msg`6자리 이상 입력해주세요.` : null,
} as const;
