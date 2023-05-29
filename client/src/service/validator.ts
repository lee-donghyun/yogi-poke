export const validator = {
  email: (email: string) =>
    !/^[a-z,_,0-9]+$/.test(email)
      ? "소문자 알파벳과 숫자, 언더바(_)만 사용가능합니다."
      : null,
  password: (password: string) =>
    password.length < 6 ? "6자리 이상 입력해주세요." : null,
  name: (name: string) =>
    name.length === 0 ? "1자리 이상 입력해주세요." : null,
} as const;
