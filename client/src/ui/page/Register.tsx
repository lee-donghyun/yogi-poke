import { Trans, useLingui } from "@lingui/react/macro";
import { HTTPError } from "ky";
import { useCallback, useState } from "react";
import { useRouter } from "router2";
import useSWRMutation from "swr/mutation";

import { usePasskey } from "~/hook/domain/usePasskey.ts";
import { getPushNotificationSubscription } from "~/service/util.ts";
import { validator } from "~/service/validator.ts";
import { StackedNavigation } from "~/ui/base/Navigation.tsx";
import { useAuthNavigator, useUser } from "~/ui/provider/Auth.tsx";
import { useNotification } from "~/ui/provider/Notification.tsx";

const cx = {
  // eslint-disable-next-line lingui/no-unlocalized-strings
  formItem: "flex flex-col gap-2 h-32 duration-300",
  // eslint-disable-next-line lingui/no-unlocalized-strings
  helper: "text-sm text-zinc-600",
  // eslint-disable-next-line lingui/no-unlocalized-strings
  input: "border border-zinc-200 rounded-sm text-zinc-800 p-2",
  label: "text-lg",
};

interface Form {
  email: string;
  name: string;
  password: string;
}
const stepFieldNameMap = {
  1: "email",
  2: "name",
  3: "password",
} as const;
export const Register = () => {
  useAuthNavigator({ goToApp: "/search" });
  const push = useNotification();
  const { t } = useLingui();
  const { params, replace } = useRouter();
  const { client, patchUser, registerToken } = useUser();
  const { register: registerPasskey } = usePasskey();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { isMutating, trigger } = useSWRMutation(
    "user/register",
    (api, { arg }: { arg: { referrerId: null | number } & Form }) =>
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
      onError: (err: HTTPError) => {
        switch (err.response.status) {
          case 409:
            push({ content: t`이미 사용중인 아이디입니다.` });
            break;
          default:
            push({ content: t`다시 시도해주세요.` });
            break;
        }
      },
      throwOnError: false,
    },
  );
  const [data, setData] = useState<Form>({
    email: "",
    name: "",
    password: "",
  });

  const onChange = useCallback(
    (key: keyof Form) => (e: { target: { value: string } }) => {
      setData((p) => ({ ...p, [key]: e.target.value }));
    },
    [],
  );

  const onSubmit = () => {
    if (step < 3) {
      const nextStep = (step + 1) as 1;
      setStep(nextStep);
      document.getElementById(stepFieldNameMap[nextStep])?.focus();
    } else {
      void trigger({
        ...data,
        referrerId: params.tag ? Number(params.tag) : null,
      });
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
        title={t`회원가입`}
      />
      <div className="h-40"></div>
      <form
        className="flex flex-col p-5 duration-300"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        id="register"
        style={{ transform: `translateY(${(step - 3) * 128}px)` }}
      >
        <div
          className={cx.formItem}
          style={step > 2 ? undefined : { opacity: 0, pointerEvents: "none" }}
        >
          <label className={cx.label} htmlFor="password">
            <Trans>비밀번호</Trans>
          </label>
          <input
            data-testid="비밀번호"
            className={cx.input}
            disabled={isMutating}
            id="password"
            name="password"
            onChange={onChange("password")}
            onFocus={() => {
              setStep(3);
            }}
            type="password"
          />
          {step === 3 && hasError && (
            <p className={cx.helper}>{translatedCurrentFieldError}</p>
          )}
        </div>
        <div
          className={cx.formItem}
          style={step > 1 ? undefined : { opacity: 0, pointerEvents: "none" }}
        >
          <label className={cx.label} htmlFor="name">
            <Trans>이름</Trans>
          </label>
          <input
            data-testid="이름"
            className={cx.input}
            disabled={isMutating}
            id="name"
            name="name"
            onChange={onChange("name")}
            onFocus={() => {
              setStep(2);
            }}
            type="text"
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
            data-testid="이메일"
            autoCapitalize="off"
            className={cx.input}
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
        <button disabled={isMutating || hasError} />
      </form>
      <div className="fixed inset-x-0 bottom-0 bg-linear-to-b from-transparent to-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <button
          className="block h-12 w-full rounded-2xl bg-black text-white duration-300 active:opacity-60 disabled:bg-zinc-300"
          disabled={isMutating || hasError}
          onClick={onSubmit}
          data-testid="회원가입 버튼"
          form="register"
        >
          {step === 3 ? t`회원가입` : t`다음`}
        </button>
      </div>
    </div>
  );
};
