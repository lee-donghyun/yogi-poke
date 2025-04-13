import { Trans, useLingui } from "@lingui/react/macro";
import { useRef, useState } from "react";
import useSWRMutation from "swr/mutation";

import { ModalNavigation } from "~/ui/base/Navigation.tsx";
import { createStackedPage } from "~/ui/base/StackedPage.tsx";
import { useUser } from "~/ui/provider/Auth.tsx";
import { useNotification } from "~/ui/provider/Notification.tsx";

interface Form {
  name: string;
  profileImageUrl: null | string;
}

const FORM_NAME = {
  NAME: "name",
  PROFILE_IMAGE: "profileImageUrl",
};

export const UpdateMyInfoStack = createStackedPage(({ close, titleId }) => {
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
    <div>
      <ModalNavigation
        left={{
          disabled: isMutating,
          label: t`취소`,
          onClick: close,
        }}
        right={{
          disabled: isMutating,
          label: t`완료`,
          onClick: () => formRef.current && void trigger(formRef.current),
        }}
        title={t`프로필 편집`}
        titleId={titleId}
      />
      <div className="h-16"></div>
      <form
        className="h-full overflow-y-scroll p-5"
        onSubmit={(e) => e.preventDefault()}
        ref={formRef}
      >
        <div className="flex justify-center">
          <label className="flex flex-col items-center gap-2">
            <img
              alt={t`프로필 이미지`}
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
            className="rounded-none border-b border-zinc-200 p-2 text-zinc-800 outline-hidden focus:border-black"
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
