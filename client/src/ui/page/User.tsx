import { Trans, useLingui } from "@lingui/react/macro";
import dayjs, { isDayjs } from "dayjs";
import { useRouter } from "router2";
import useSWRMutation from "swr/mutation";

import { useLocalStorage } from "~/hook/base/useLocalStorage.ts";
import { useRelatedPokeList } from "~/hook/domain/useRelatedPokeList.ts";
import { useUserPofile } from "~/hook/domain/useUserProfile.ts";
import { useUserRelatedPokeList } from "~/hook/domain/useUserRelatedPokeList.ts";
import { LIKE_PERSIST_KEY } from "~/service/const.ts";
import { isVerifiedUser } from "~/service/util.ts";
import { Image } from "~/ui/base/Image";
import { StackedNavigation } from "~/ui/base/Navigation.tsx";
import { Stat } from "~/ui/base/Stat.tsx";
import { Timer } from "~/ui/base/Timer.tsx";
import { Block } from "~/ui/icon/Block.tsx";
import { CheckBadge } from "~/ui/icon/CheckBadge.tsx";
import { Star, StarSolid } from "~/ui/icon/Star.tsx";
import { PokeSheet } from "~/ui/overlay/PokeSheet.tsx";
import { useAuthNavigator, useUser } from "~/ui/provider/Auth.tsx";
import { useNotification } from "~/ui/provider/Notification.tsx";
import { useStackedLayer } from "~/ui/provider/StackedLayerProvider.tsx";

export const User = () => {
  useAuthNavigator({ goToAuth: true });
  const { t } = useLingui();
  const { client, myInfo, refreshUser } = useUser();
  const overlay = useStackedLayer();
  const { params } = useRouter();
  const userEmail = params[":userId"];
  const push = useNotification();
  const { mutate: mutateRelatedPokes } = useRelatedPokeList();

  const { data, mutate: mutateUser } = useUserPofile(userEmail);

  const {
    data: pokes,
    isLoading,
    mutate: mutateUserPoke,
  } = useUserRelatedPokeList(userEmail);

  const mutateAll = () =>
    Promise.allSettled([
      refreshUser(),
      mutateRelatedPokes(),
      mutateUser(),
      mutateUserPoke(),
    ]);

  const { isMutating: isBlockLoading, trigger: triggerBlock } = useSWRMutation(
    `relation/${userEmail}`,
    (api) =>
      client
        .patch(api, { json: { isAccepted: false } })
        .then(() => mutateAll())
        .then(() => {
          push({ content: t`사용자를 차단했습니다.` });
          history.back();
        }),
    {
      onError: () => {
        push({ content: t`다시 시도해주세요.` });
      },
    },
  );

  const [likes, setLikes] = useLocalStorage<number[]>(LIKE_PERSIST_KEY, []);
  const isLiked = typeof data?.id === "number" && likes.includes(data.id);
  const lastPoked =
    pokes?.[0]?.fromUserId === myInfo?.id ? dayjs(pokes?.[0]?.createdAt) : null;
  const isPokable = lastPoked ? dayjs().diff(lastPoked, "hour") >= 24 : true;

  return (
    <div className="min-h-dvh">
      <StackedNavigation
        actions={[
          <button
            className="text-zinc-400 active:opacity-60"
            disabled={isBlockLoading}
            key="block"
            onClick={() => {
              const targetUserName = data?.name;
              if (confirm(t`${targetUserName}님을 차단할까요?`)) {
                void triggerBlock();
              }
            }}
            type="button"
          >
            <Block />
          </button>,
        ]}
        onBack={() => {
          history.back();
        }}
        title={`@${userEmail}`}
      />
      <div className="p-5 pt-16">
        <div className="flex pt-5">
          <Image
            alt={t`프로필 이미지`}
            size={80}
            src={data?.profileImageUrl ?? "/asset/default_user_profile.png"}
          />
          <div className="flex flex-1 items-center pl-5">
            <Stat label={t`모든 콕!`} value={data?.totalPokes} />
            <Stat label={t`내가 콕!`} value={data?.pokes} />
            <Stat label={t`나를 콕!`} value={data?.pokeds} />
          </div>
        </div>
        <div className="pt-7">
          <div className="flex items-end justify-between">
            <p className="flex items-center text-xl font-bold">
              @{userEmail}
              {data && isVerifiedUser(data) && (
                <span className="ml-1 text-blue-500">
                  <CheckBadge />
                </span>
              )}
            </p>
          </div>
          <p className="mt-1">{data?.name ?? <span className="block h-6" />}</p>
        </div>
        <div className="flex gap-2 pt-5">
          <button
            className="block flex-1 rounded-2xl bg-black p-2 text-white duration-300 active:opacity-60 disabled:bg-zinc-300"
            disabled={!isPokable || isLoading}
            onClick={() => {
              overlay(PokeSheet, { targetUserEmail: userEmail });
            }}
          >
            <Trans>콕! 찌르기</Trans> 👉
          </button>
          <button
            className="rounded-2xl bg-zinc-100 px-2 active:opacity-60"
            key="edit"
            onClick={() => {
              if (isLiked) {
                setLikes(likes.filter((id) => id !== data.id));
              } else if (data) {
                setLikes([...likes, data.id]);
              }
            }}
            type="button"
          >
            <span className="block scale-[80%] text-zinc-500">
              {isLiked ? (
                <span className="text-yellow-500">
                  <StarSolid />
                </span>
              ) : (
                <Star />
              )}
            </span>
          </button>
        </div>
        {isDayjs(lastPoked) && !isPokable && (
          <p className="mt-1 text-center text-sm text-zinc-500">
            <b className="font-medium">
              <Timer to={lastPoked} />
            </b>{" "}
            <Trans>후에 찌를 수 있어요</Trans>
          </p>
        )}
      </div>
    </div>
  );
};
