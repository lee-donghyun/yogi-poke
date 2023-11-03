import { AxiosError } from "axios";
import useSWRMutation from "swr/mutation";

import { useUser } from "../component/Auth";
import { useNotification } from "../component/Notification";
import { useStackedLayer } from "../component/StackedLayerProvider";
import { yogiPokeApi } from "../service/api";
import { MyInfo } from "../service/type";

export const usePoke = (
  {
    onSuccess,
  }: {
    onSuccess: (helper: {
      meta: { email: string; myInfo: MyInfo | null };
      stack: ReturnType<typeof useStackedLayer>;
      push: ReturnType<typeof useNotification>;
    }) => void;
  } = {
    onSuccess: (helper) => {
      helper.push({ content: `${helper.meta.email}님을 콕! 찔렀습니다.` });
    },
  },
) => {
  const stack = useStackedLayer();
  const push = useNotification();
  const { refreshUser, myInfo } = useUser();
  return useSWRMutation(
    "/mate/poke",
    (key, { arg }: { arg: { email: string } }) =>
      yogiPokeApi
        .post(key, arg)
        .then(() => arg.email)
        .catch((err: AxiosError) => {
          throw { status: err.response?.status, email: arg.email };
        }),
    {
      onError: (err) => {
        switch (err?.status) {
          case 409: {
            push({
              content:
                "이미 콕! 찔렀습니다. 상대방이 반응할때까지 기다려보세요.",
            });
            return;
          }
          case 403: {
            push({
              content: `${err.email}님을 콕! 찌를 수 없습니다.`,
            });
            return;
          }
          default: {
            push({ content: "다시 시도해주세요." });
            return;
          }
        }
      },
      onSuccess: (email) => {
        refreshUser();
        onSuccess({ stack, push, meta: { email, myInfo } });
      },
    },
  );
};
