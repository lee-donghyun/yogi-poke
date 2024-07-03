import { useCallback, useState } from "react";
import { useRouter } from "router2";
import useSWRMutation from "swr/mutation";

import { useUser } from "../component/Auth";
import { StackedNavigation } from "../component/Navigation";
import { useNotification } from "../component/Notification";
import { yogiPokeApi } from "../service/api";
import { getPushNotificationSubscription } from "../service/util";
import { validator } from "../service/validator";

const cx = {
  formItem: "flex flex-col gap-2 h-32 duration-300",
  label: "text-lg",
  input: "border rounded text-zinc-800 p-2 disabled:bg-zinc-100",
  helper: "text-sm text-zinc-600",
};

interface Form {
  email: string;
  password: string;
}
const stepFieldNameMap = {
  1: "email",
  2: "password",
} as const;
export const SignIn = () => {
  const push = useNotification();
  const { navigate, params } = useRouter();
  const { registerToken, isLoggedIn, patchUser } = useUser();

  const [step, setStep] = useState<1 | 2>(1);
  const { trigger, isMutating } = useSWRMutation(
    "/user/sign-in",
    (api, { arg }: { arg: Form }) =>
      yogiPokeApi
        .post(api, arg)
        .then(({ data }: { data: string }) => registerToken(data))
        .then(() => {
          const redirect = params.returnUrl;
          navigate({ pathname: redirect || "/my-page" }, { replace: true });

          getPushNotificationSubscription()
            .then((pushSubscription) => patchUser({ pushSubscription }))
            .then(() => {
              push({ content: "이제 콕 찔리면 알림이 울립니다." });
            })
            .catch(console.error);
        }),
    {
      onError: () => {
        push({ content: "다시 시도해주세요." });
      },
      throwOnError: false,
    },
  );
  const [data, setData] = useState<Form>({
    email: "",
    password: "",
  });

  const onChange = useCallback(
    (key: keyof Form) => (e: { target: { value: string } }) => {
      setData((p) => ({ ...p, [key]: e.target.value }));
    },
    [],
  );

  const onSubmit = () => {
    if (step < 2) {
      const nextStep = (step + 1) as 1;
      setStep(nextStep);
      document.getElementById(stepFieldNameMap[nextStep])?.focus();
    } else {
      void trigger(data);
    }
  };

  const currentKey = stepFieldNameMap[step];
  const currentFieldError = validator[currentKey](data[currentKey]);

  if (isLoggedIn) {
    navigate({ pathname: "/search" }, { replace: true });
  }
  return (
    <div className="min-h-screen">
      <StackedNavigation
        title="로그인"
        onBack={() => {
          navigate({ pathname: "/" }, { replace: true });
        }}
      />
      <div className="h-40"></div>
      <form
        className="flex flex-col p-5 duration-300"
        style={{ transform: `translateY(${(step - 2) * 128}px)` }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div
          className={cx.formItem}
          style={step > 1 ? undefined : { pointerEvents: "none", opacity: 0 }}
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
            type="password"
            onFocus={() => {
              setStep(2);
            }}
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
            type="text"
            onFocus={() => {
              setStep(1);
            }}
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
          {step === 2 ? "로그인" : "다음"}
        </button>
      </div>
    </div>
  );
};
