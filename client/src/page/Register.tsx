import { useCallback, useState } from "react";
import useSWRMutation from "swr/mutation";
import { useNotification } from "../component/Notification";
import { yogiPokeApi } from "../service/api";
import { validator } from "../service/validator";
import { useUser } from "../component/Auth";
import { useRouter } from "../lib/router2";

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
export const Register = () => {
  const push = useNotification();
  const { navigate, params } = useRouter();
  const { registerToken, isLoggedIn } = useUser();

  if (isLoggedIn) {
    const redirect = params.returnUrl;
    navigate({ pathname: redirect || "/my-page" }, { replace: true });
  }

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { trigger, isMutating } = useSWRMutation(
    "/user/register",
    (api, { arg }: { arg: Form }) =>
      yogiPokeApi
        .post(api, arg)
        .then(({ data }) => registerToken(data))
        .then(() => {
          const redirect = params.returnUrl;
          navigate({ pathname: redirect || "/my-page" }, { replace: true });
        }),
    {
      onError: (err) => {
        switch (err?.response?.status) {
          case 409:
            push({ content: "이미 사용중인 계정입니다." });
            break;
          default:
            push({ content: "다시 시도해주세요." });
            break;
        }
      },
      throwOnError: false,
    }
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
      <div className="p-20 text-center text-4xl font-extrabold">
        <p className={`-rotate-12 ${isMutating && "animate-spin"}`}>
          요기콕콕!👉
        </p>
      </div>
      <form
        className="flex flex-col p-5 duration-300"
        style={{ transform: `translateY(${(step - 3) * 128}px)` }}
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
            className={cx.input}
            disabled={isMutating}
            id="password"
            name="password"
            onChange={onChange("password")}
            onFocus={() => setStep(3)}
            type="password"
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
            disabled={isMutating}
            id="name"
            name="name"
            onChange={onChange("name")}
            onFocus={() => setStep(2)}
            type="text"
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
            disabled={isMutating}
            id="email"
            name="email"
            onChange={onChange("email")}
            onFocus={() => setStep(1)}
            type="text"
          />
          {step === 1 && typeof currentFieldError === "string" && (
            <p className={cx.helper}>{currentFieldError}</p>
          )}
        </div>
        <button
          disabled={isMutating || typeof currentFieldError === "string"}
        />
      </form>
      <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <button
          className="block w-full rounded-full bg-black p-4 text-white duration-300 active:opacity-60 disabled:bg-zinc-300"
          disabled={isMutating || typeof currentFieldError === "string"}
          onClick={onSubmit}
        >
          {step === 3 ? "회원가입" : "다음"}
        </button>
      </div>
    </div>
  );
};
