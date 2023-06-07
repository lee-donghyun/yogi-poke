import { useRef, useState } from "react";
import { useUser } from "../component/Auth";
import useSWRMutation from "swr/mutation";
import { yogiPokeApi } from "../service/api";
import { useNotification } from "../component/Notification";

type Form = {
  name: string;
  profileImageUrl: string | null;
};

const FORM_NAME = {
  PROFILE_IMAGE: "profileImageUrl",
  NAME: "name",
};

export const UpdateMyInfo = ({ close }: { close: () => void }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const push = useNotification();
  const { myInfo, patchUser } = useUser();
  const [data, setData] = useState<Form>(
    myInfo ?? { name: "", profileImageUrl: null }
  );

  const { trigger, isMutating } = useSWRMutation(
    "/util/image",
    async (key, { arg: form }: { arg: HTMLFormElement }) => {
      const formData = new FormData(form);
      const profileImageUrl =
        data.profileImageUrl !== myInfo?.profileImageUrl
          ? await yogiPokeApi.post(key, formData).then((res) => res.data)
          : data.profileImageUrl;
      await patchUser({
        profileImageUrl,
        name: data.name,
      });
    },
    {
      onError: () => push({ content: "다시 시도해주세요." }),
      onSuccess: () => close(),
    }
  );

  return (
    <div className="min-h-screen">
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
        <p className="text-center font-medium">내 정보 수정</p>
        <button
          className="justify-self-end disabled:opacity-60"
          disabled={isMutating}
          onClick={() => formRef.current && trigger(formRef.current)}
          type="button"
        >
          완료
        </button>
      </div>
      <form ref={formRef} className="h-full overflow-y-scroll p-5">
        <div className="flex justify-center">
          <label className="flex flex-col items-center gap-2">
            <img
              className="h-20 w-20 rounded-full bg-zinc-200 object-cover"
              src={data.profileImageUrl ?? "/asset/default_user_profile.png"}
            />
            <p className="text-sm font-medium text-zinc-800">사진 수정</p>
            <input
              accept="image/png,image/jpg,image/jpeg"
              className="hidden"
              id="profileImage"
              name={FORM_NAME.PROFILE_IMAGE}
              type="file"
              onChange={(e) => {
                const profileImageUrl = URL.createObjectURL(
                  e.target.files?.item(0) as File
                );
                setData((p) => ({ ...p, profileImageUrl }));
              }}
            />
          </label>
        </div>
        <div
          className="grid items-center gap-3 pt-8 text-sm"
          style={{ gridTemplateColumns: "80px 1fr" }}
        >
          <label htmlFor="name">이름</label>
          <input
            className="rounded-none border-b p-2 text-zinc-800 outline-none focus:border-black"
            id="name"
            type="text"
            value={data.name}
            onChange={({ target: { value: name } }) =>
              setData((p) => ({ ...p, name }))
            }
          />
        </div>
      </form>
    </div>
  );
};
