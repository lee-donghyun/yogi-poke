import { AxiosError } from "axios";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

import { useNotification } from "../component/Notification";
import { releaseToken } from "../component/PwaProvider";
import { createLayer } from "../component/StackedLayerProvider";
import { yogiPokeApi } from "../service/api";
import { validator } from "../service/validator";

const cx = {
  formItem: "flex flex-col gap-2 h-32 duration-300 mt-5",
  label: "text-lg",
  input: "border rounded text-zinc-800 p-2",
  helper: "text-sm text-zinc-600",
};
export const Quit = createLayer(({ close }) => {
  const push = useNotification();
  const [password, setPassword] = useState("");

  const { trigger, isMutating } = useSWRMutation(
    "/user/quit",
    (api, { arg }: { arg: { password: string } }) => yogiPokeApi.post(api, arg),
    {
      onSuccess: () => {
        releaseToken();
        location.pathname = "/";
      },
      onError: (err: AxiosError) => {
        switch (err.response?.status) {
          case 409:
            push({ content: "이미 사용중인 아이디입니다." });
            break;
          default:
            push({ content: "다시 시도해주세요." });
            break;
        }
      },
      throwOnError: false,
    },
  );

  const passwordError = validator.password(password);
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
          취소
        </button>
        <p className="text-center font-medium">요기콕콕! 계정 삭제</p>
        <span></span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-zinc-600">
          계정 삭제는 영구적입니다. 요기콕콕! 게정을 삭제하시면 회원님의 모든
          활동이 영구 삭제됩니다.
        </p>
        <div className={cx.formItem}>
          <label className={cx.label} htmlFor="password">
            비밀번호
          </label>
          <input
            className={cx.input}
            disabled={isMutating}
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          {typeof passwordError === "string" && (
            <p className={cx.helper}>{passwordError}</p>
          )}
        </div>
        <div className="flex-1"></div>
        <button
          className="block w-full rounded-full bg-black p-3 text-white duration-300 active:opacity-60 disabled:bg-zinc-300"
          disabled={typeof passwordError === "string"}
          onClick={() => void trigger({ password })}
          type="button"
        >
          계속
        </button>
      </div>
    </div>
  );
});
