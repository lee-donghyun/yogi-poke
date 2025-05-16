import { Trans, useLingui } from "@lingui/react/macro";
import { useCallback, useState } from "react";
import { useRouter } from "router2";
import useSWRMutation from "swr/mutation";

import { usePasskey } from "~/hook/domain/usePasskey.ts";
import { client } from "~/service/api.ts";
import { getPushNotificationSubscription } from "~/service/util.ts";
import { validator } from "~/service/validator.ts";
import { StackedNavigation } from "~/ui/base/Navigation.tsx";
import { useAuthNavigator, useUser } from "~/ui/provider/Auth.tsx";
import { useNotification } from "~/ui/provider/Notification.tsx";

const cx = {
  formItem: "flex flex-col gap-2 h-32 duration-300",

  helper: "text-sm text-zinc-600",
  input:
    "border border-zinc-200 rounded-sm text-zinc-800 p-2 disabled:bg-zinc-100",
  label: "text-lg",
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
  useAuthNavigator({ goToApp: "/search" });
  const push = useNotification();
  const { t } = useLingui();
  const { replace } = useRouter();
  const { patchUser, registerToken } = useUser();
  const { register: registerPasskey } = usePasskey();

  const [step, setStep] = useState<1 | 2>(1);
  const { isMutating, trigger } = useSWRMutation(
    "user/sign-in",
    (api, { arg }: { arg: Form }) =>
      client
        .post(api, { json: arg })
        .text()
        .then((token) => registerToken(token))
        .then(({ id: userId, token }) => {
          getPushNotificationSubscription()
            .then((pushSubscription) => patchUser({ pushSubscription }, token))
            .then(() => {
              push({ content: t`이제 콕 찔리면 알림이 울립니다.` });
            })
            .catch(console.error);
          registerPasskey({ token, useAutoRegister: true, userId })
            .then(() => {
              push({ content: t`Passkey가 등록되었습니다.` });
            })
            .catch(console.error);
        }),
    {
      onError: () => {
        push({ content: t`다시 시도해주세요.` });
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
  const hasError = currentFieldError !== null;
  const translatedCurrentFieldError = hasError && t(currentFieldError);

  return (
    <div className="min-h-dvh">
      <StackedNavigation
        onBack={() => {
          replace({ pathname: "/" });
        }}
        title={t`로그인`}
      />
      <div className="h-40"></div>
      <form
        className="flex flex-col p-5 duration-300"
        data-testid="회원가입 폼"
        id="sign-in"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        style={{ transform: `translateY(${(step - 2) * 128}px)` }}
      >
        <div
          aria-hidden={step < 2}
          className={cx.formItem}
          style={step < 2 ? { opacity: 0, pointerEvents: "none" } : undefined}
        >
          <label className={cx.label} htmlFor="password">
            <Trans>비밀번호</Trans>
          </label>
          <input
            className={cx.input}
            data-testid="비밀번호"
            disabled={isMutating}
            id="password"
            name="password"
            onChange={onChange("password")}
            onFocus={() => {
              setStep(2);
            }}
            type="password"
          />
          {step === 2 && hasError && (
            <p className={cx.helper}>{translatedCurrentFieldError}</p>
          )}
        </div>
        <div className={cx.formItem}>
          <label className={cx.label} htmlFor="email">
            <Trans>아이디</Trans>
          </label>
          <input
            autoCapitalize="off"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            className={cx.input}
            data-testid="이메일"
            disabled={isMutating}
            id="email"
            name="email"
            onChange={onChange("email")}
            onFocus={() => {
              setStep(1);
            }}
            type="text"
          />
          {step === 1 && hasError && (
            <p className={cx.helper}>{translatedCurrentFieldError}</p>
          )}
        </div>
      </form>
      <div className="fixed inset-x-0 bottom-0 bg-linear-to-b from-transparent to-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <button
          className="block h-12 w-full rounded-2xl bg-black text-white duration-300 active:opacity-60 disabled:bg-zinc-300"
          data-testid="로그인 버튼"
          disabled={isMutating || hasError}
          form="sign-in"
          onClick={onSubmit}
        >
          {step === 2 ? t`로그인` : t`다음`}
        </button>
      </div>
    </div>
  );
};
