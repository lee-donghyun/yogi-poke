import { Trans, useLingui } from "@lingui/react/macro";
import { useRef, useState } from "react";
import useSWRMutation from "swr/mutation";

import { useUser } from "../provider/Auth.tsx";
import { useNotification } from "../provider/Notification.tsx";
import { createLayer } from "../provider/StackedLayerProvider.tsx";

interface Form {
  name: string;
  profileImageUrl: null | string;
}

const FORM_NAME = {
  NAME: "name",
  PROFILE_IMAGE: "profileImageUrl",
};

export const UpdateMyInfo = createLayer(({ close }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const push = useNotification();
  const { t } = useLingui();

  const { client, myInfo, patchUser } = useUser();
  const [data, setData] = useState<Form>(
    myInfo ?? { name: "", profileImageUrl: null },
  );

  const { isMutating, trigger } = useSWRMutation(
    "util/image",
    async (key, { arg: form }: { arg: HTMLFormElement }) => {
      const formData = new FormData(form);
      const profileImageUrl =
        (data.profileImageUrl !== myInfo?.profileImageUrl
          ? await client.post(key, { body: formData }).text()
          : data.profileImageUrl) ?? undefined;
      await patchUser({
        name: data.name,
        profileImageUrl,
      });
    },
    {
      onError: () => {
        push({ content: t`다시 시도해주세요.` });
      },
      onSuccess: () => {
        close();
      },
    },
  );

  return (
    <div className="min-h-[calc(100vh-env(safe-area-inset-bottom)-env(safe-area-inset-top))] bg-white">
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
          <Trans>프로필 편집</Trans>
        </p>
        <button
          className="justify-self-end disabled:opacity-60"
          disabled={isMutating}
          onClick={() => formRef.current && void trigger(formRef.current)}
          type="button"
        >
          <Trans>완료</Trans>
        </button>
      </div>
      <form
        className="h-full overflow-y-scroll p-5"
        onSubmit={(e) => e.preventDefault()}
        ref={formRef}
      >
        <div className="flex justify-center">
          <label className="flex flex-col items-center gap-2">
            <img
              alt="프로필 이미지"
              className="h-20 w-20 rounded-full bg-zinc-200 object-cover"
              src={data.profileImageUrl ?? "/asset/default_user_profile.png"}
            />
            <p className="text-sm font-medium text-zinc-800">
              <Trans>사진 수정</Trans>
            </p>
            <input
              accept="image/png,image/jpg,image/jpeg"
              className="hidden"
              id="profileImage"
              name={FORM_NAME.PROFILE_IMAGE}
              onChange={(e) => {
                const file = e.target.files?.item(0);
                if (!file) {
                  return;
                }
                if (file.size > 4_000_000) {
                  push({ content: t`더 작은 사진을 사용해주세요.` });
                  return;
                }
                const profileImageUrl = URL.createObjectURL(file);
                setData((p) => ({ ...p, profileImageUrl }));
              }}
              type="file"
            />
          </label>
        </div>
        <div
          className="grid items-center gap-3 pt-8 text-sm"
          style={{ gridTemplateColumns: "80px 1fr" }}
        >
          <label htmlFor="name">
            <Trans>이름</Trans>
          </label>
          <input
            className="rounded-none border-b p-2 text-zinc-800 outline-none focus:border-black"
            id="name"
            onChange={({ target: { value: name } }) => {
              setData((p) => ({ ...p, name }));
            }}
            type="text"
            value={data.name}
          />
        </div>
      </form>
    </div>
  );
});
