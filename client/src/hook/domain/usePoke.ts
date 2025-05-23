import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import { HTTPError } from "ky";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { useRelatedPokeList } from "~/hook/domain/useRelatedPokeList.ts";
import { SWR_KEY_USER } from "~/hook/domain/useUserProfile.ts";
import { SWR_KEY_MATE_POKE } from "~/hook/domain/useUserRelatedPokeList.ts";
import { MyInfo } from "~/service/dataType.ts";
import { type Line } from "~/ui/base/Canvas.tsx";
import { useUser } from "~/ui/provider/Auth.tsx";
import { useNotification } from "~/ui/provider/Notification.tsx";
import { useStackedLayer } from "~/ui/provider/StackedLayerProvider.tsx";

interface DrawingPokePayload {
  lines: Line[];
  type: "drawing";
}

interface EmojiPokePayload {
  message: string;
  type: "emoji";
}

interface GeolocationPokePayload {
  position: { latitude: number; longitude: number };
  type: "geolocation";
}
interface NormalPokePayload {
  type: "normal";
}

interface PokeError {
  email: string;
  status: number;
}
interface PokePayload {
  email: string;
  payload:
    | DrawingPokePayload
    | EmojiPokePayload
    | GeolocationPokePayload
    | NormalPokePayload;
}

export const usePoke = (
  {
    onSuccess,
  }: {
    onSuccess: (helper: {
      meta: { email: string; myInfo: MyInfo | null };
      push: ReturnType<typeof useNotification>;
      stack: ReturnType<typeof useStackedLayer>;
      t: ReturnType<typeof useLingui>["t"];
    }) => void;
  } = {
    onSuccess: (helper) => {
      const userEmail = helper.meta.email;
      helper.push({ content: helper.t(msg`${userEmail}님을 콕! 찔렀습니다.`) });
    },
  },
) => {
  const stack = useStackedLayer();
  const push = useNotification();
  const { t } = useLingui();
  const { client, myInfo, refreshUser } = useUser();
  const { mutate: mutateRelatedPokeList } = useRelatedPokeList();
  const { mutate: globalMutate } = useSWRConfig();
  return useSWRMutation(
    "mate/poke",
    (key, { arg }: { arg: PokePayload }) =>
      client
        .post(key, { json: arg })
        .then(() => arg.email)
        .catch((err: HTTPError) => {
          throw new Error("failed to poke", {
            cause: { email: arg.email, status: err?.response?.status },
          });
        }),
    {
      onError: (err: Error) => {
        const cause = (err as { cause: PokeError }).cause;
        switch (cause.status) {
          case 403: {
            const userEmail = cause.email;
            push({
              content: t`${userEmail}님을 콕! 찌를 수 없습니다.`,
            });
            return;
          }
          case 409: {
            push({
              content: t`이미 콕! 찔렀습니다. 상대방이 반응할때까지 기다려보세요.`,
            });
            return;
          }
          default: {
            push({ content: t`다시 시도해주세요.` });
            return;
          }
        }
      },
      onSuccess: (email) => {
        void refreshUser();
        void mutateRelatedPokeList();
        void globalMutate(SWR_KEY_USER(email));
        void globalMutate(SWR_KEY_MATE_POKE(email));
        onSuccess({ meta: { email, myInfo }, push, stack, t });
      },
    },
  );
};
