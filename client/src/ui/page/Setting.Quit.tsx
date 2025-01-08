import { Trans, useLingui } from "@lingui/react/macro";
import { HTTPError } from "ky";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

import { validator } from "../../service/validator.ts";
import { useUser } from "../provider/Auth.tsx";
import { useNotification } from "../provider/Notification.tsx";
import { releaseToken } from "../provider/PwaProvider.tsx";
import { createLayer } from "../provider/StackedLayerProvider.tsx";

const cx = {
  formItem: "flex flex-col gap-2 h-32 duration-300 mt-5",
  helper: "text-sm text-zinc-600",
  input: "border rounded text-zinc-800 p-2",
  label: "text-lg",
};
export const Quit = createLayer(({ close }) => {
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
    <div className="flex min-h-[calc(100vh-env(safe-area-inset-bottom)-env(safe-area-inset-top))] flex-col bg-white">
      <div
        className="z-10 grid bg-white p-5"
        style={{ gridTemplateColumns: "80px 1fr 80px" }}
      >
        <button
          className="justify-self-start text-zinc-600 disabled:opacity-60"
          disabled={isMutating}
          onClick={close}
          type="button"
        >
          <Trans>취소</Trans>
        </button>
        <p className="text-center font-medium">
          <Trans>요기콕콕! 계정 삭제</Trans>
        </p>
        <span></span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-zinc-600">
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
        <div className="flex-1"></div>
        <button
          className="block w-full rounded-full bg-black p-3 text-white duration-300 active:opacity-60 disabled:bg-zinc-300"
          disabled={typeof passwordError === "string"}
          onClick={() => void trigger({ password })}
          type="button"
        >
          <Trans>계속</Trans>
        </button>
      </div>
    </div>
  );
});
