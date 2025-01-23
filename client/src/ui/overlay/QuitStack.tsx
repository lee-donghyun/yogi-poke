import { Trans, useLingui } from "@lingui/react/macro";
import { HTTPError } from "ky";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

import { validator } from "../../service/validator.ts";
import { ModalNavigation } from "../base/Navigation.tsx";
import { createStackedPage } from "../base/StackedPage.tsx";
import { useUser } from "../provider/Auth.tsx";
import { useNotification } from "../provider/Notification.tsx";
import { releaseToken } from "../provider/PwaProvider.tsx";

const cx = {
  // eslint-disable-next-line lingui/no-unlocalized-strings
  formItem: "flex flex-col gap-2 h-32 duration-300 mt-5",
  // eslint-disable-next-line lingui/no-unlocalized-strings
  helper: "text-sm text-zinc-600",
  // eslint-disable-next-line lingui/no-unlocalized-strings
  input: "border rounded text-zinc-800 p-2",
  label: "text-lg",
};
export const QuitStack = createStackedPage(({ close }) => {
  const push = useNotification();
  const { t } = useLingui();
  const [password, setPassword] = useState("");
  const { client } = useUser();

  const { isMutating, trigger } = useSWRMutation(
    "user/my-info",
    (api, { arg }: { arg: { password: string } }) =>
      client.delete(api, { searchParams: arg }),
    {
      onError: (err: HTTPError) => {
        switch (err.response?.status) {
          default:
            push({ content: t`다시 시도해주세요.` });
            break;
        }
      },
      onSuccess: () => {
        releaseToken();
        location.pathname = "/";
      },
      throwOnError: false,
    },
  );

  const passwordError = validator.password(password);
  const hasError = passwordError !== null;
  const translatedPasswordError = hasError && t(passwordError);

  return (
    <div>
      <ModalNavigation
        left={{
          disabled: isMutating,
          label: t`취소`,
          onClick: close,
        }}
        right={{
          disabled: typeof passwordError === "string" || isMutating,
          label: t`계속`,
          onClick: () => void trigger({ password }),
        }}
        title={t`요기콕콕! 계정 삭제`}
      />
      <div className="h-16"></div>
      <div className="p-5">
        <p className="py-5 text-zinc-600">
          <Trans>
            계정 삭제는 영구적입니다. 요기콕콕! 게정을 삭제하시면 회원님의 모든
            활동이 영구 삭제됩니다.
          </Trans>
        </p>
        <div className={cx.formItem}>
          <label className={cx.label} htmlFor="password">
            <Trans>비밀번호</Trans>
          </label>
          <input
            className={cx.input}
            disabled={isMutating}
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          {hasError && <p className={cx.helper}>{translatedPasswordError}</p>}
        </div>
      </div>
    </div>
  );
});
