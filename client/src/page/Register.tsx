import { useCallback, useState } from "react";
import useSWRMutation from "swr/mutation";
import { yogiPokeApi } from "../service/api";

const cx = {
  formItem: "flex flex-col gap-2 h-32 duration-300",
  label: "text-lg",
  input: "border rounded text-zinc-800 p-2",
  helper: "text-sm text-zinc-600",
};

type Form = {
  email: string;
  name: string;
  password: string;
};
const stepFieldNameMap = {
  1: "email",
  2: "name",
  3: "password",
} as const;
const validator = {
  email: (email: string) =>
    !/^[a-z,_,0-9]+$/.test(email)
      ? "소문자 알파벳과 숫자, 언더바(_)만 사용가능합니다."
      : null,
  name: (name: string) =>
    name.length === 0 ? "1자리 이상 입력해주세요." : null,
  password: (password: string) =>
    password.length < 6 ? "6자리 이상 입력해주세요." : null,
} as const;
export const Register = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { trigger, isMutating } = useSWRMutation(
    "/user/register",
    (api, { arg }: { arg: Form }) => yogiPokeApi.post(api, arg)
  );
  const [data, setData] = useState<Form>({
    email: "",
    name: "",
    password: "",
  });

  const onChange = useCallback(
    (key: keyof Form) => (e: { target: { value: string } }) =>
      setData((p) => ({ ...p, [key]: e.target.value })),
    []
  );

  const onSubmit = () => {
    if (step < 3) {
      const nextStep = (step + 1) as 1;
      setStep(nextStep);
      document.getElementById(stepFieldNameMap[nextStep])?.focus();
    } else {
      trigger(data);
    }
  };

  const currentKey = stepFieldNameMap[step];
  const currentFieldError = validator[currentKey](data[currentKey]);

  return (
    <div className="min-h-screen">
      <div className="text-4xl font-extrabold p-20 text-center">
        <p className={`-rotate-12 ${isMutating && "animate-spin"}`}>
          요기콕콕!
        </p>
      </div>
      <form
        style={{ transform: `translateY(${(step - 3) * 128}px)` }}
        className="flex flex-col p-5 duration-300"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div
          className={cx.formItem}
          style={step > 2 ? undefined : { pointerEvents: "none", opacity: 0 }}
        >
          <label className={cx.label} htmlFor="password">
            비밀번호
          </label>
          <input
            onFocus={() => setStep(3)}
            disabled={isMutating}
            className={cx.input}
            type="password"
            id="password"
            name="password"
            onChange={onChange("password")}
          />
          {step === 3 && typeof currentFieldError === "string" && (
            <p className={cx.helper}>{currentFieldError}</p>
          )}
        </div>
        <div
          className={cx.formItem}
          style={step > 1 ? undefined : { pointerEvents: "none", opacity: 0 }}
        >
          <label className={cx.label} htmlFor="name">
            이름
          </label>
          <input
            className={cx.input}
            onFocus={() => setStep(2)}
            disabled={isMutating}
            type="text"
            id="name"
            name="name"
            onChange={onChange("name")}
          />
          {step === 2 && typeof currentFieldError === "string" && (
            <p className={cx.helper}>{currentFieldError}</p>
          )}
        </div>
        <div className={cx.formItem}>
          <label className={cx.label} htmlFor="email">
            아이디
          </label>
          <input
            className={cx.input}
            onFocus={() => setStep(1)}
            disabled={isMutating}
            type="text"
            id="email"
            name="email"
            onChange={onChange("email")}
          />
          {step === 1 && typeof currentFieldError === "string" && (
            <p className={cx.helper}>{currentFieldError}</p>
          )}
        </div>
      </form>
      <div className="h-96"></div>
      <div className="sticky inset-0 top-auto p-5 bg-gradient-to-b from-transparent to-white">
        <button
          disabled={isMutating || typeof currentFieldError === "string"}
          className="block w-full bg-black rounded text-white p-4 disabled:bg-zinc-300 duration-300"
          onClick={onSubmit}
        >
          {step === 3 ? "회원가입" : "다음"}
        </button>
      </div>
    </div>
  );
};
