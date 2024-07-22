import { AxiosError } from "axios";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { useUser } from "../component/Auth";
import { useNotification } from "../component/Notification";
import { useStackedLayer } from "../component/StackedLayerProvider";
import { yogiPokeApi } from "../service/api";
import { MyInfo } from "../service/dataType";
import { useRelatedPokeList } from "./useRelatedPokeList";
import { SWR_KEY_USER } from "./useUserProfile";
import { SWR_KEY_MATE_POKE } from "./useUserRelatedPokeList";

interface PokeError {
  status: number;
  email: string;
}

interface NormalPokePayload {
  type: "normal";
}

interface EmojiPokePayload {
  type: "emoji";
  message: string;
}
interface PokePayload {
  email: string;
  payload: NormalPokePayload | EmojiPokePayload;
}

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
  const { mutate: mutateRelatedPokeList } = useRelatedPokeList();
  const { mutate: globalMutate } = useSWRConfig();
  return useSWRMutation(
    "/mate/poke",
    (key, { arg }: { arg: PokePayload }) =>
      yogiPokeApi
        .post(key, arg)
        .then(() => arg.email)
        .catch((err: AxiosError) => {
          throw new Error("failed to poke", {
            cause: { status: err.response?.status, email: arg.email },
          });
        }),
    {
      onError: (err: Error) => {
        const cause = (err as { cause: PokeError }).cause;
        switch (cause.status) {
          case 409: {
            push({
              content:
                "이미 콕! 찔렀습니다. 상대방이 반응할때까지 기다려보세요.",
            });
            return;
          }
          case 403: {
            push({
              content: `${cause.email}님을 콕! 찌를 수 없습니다.`,
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
        void refreshUser();
        void mutateRelatedPokeList();
        void globalMutate(SWR_KEY_USER(email));
        void globalMutate(SWR_KEY_MATE_POKE(email));
        onSuccess({ stack, push, meta: { email, myInfo } });
      },
    },
  );
};
