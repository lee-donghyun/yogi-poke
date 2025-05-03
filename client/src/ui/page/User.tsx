import { CheckBadgeIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Trans, useLingui } from "@lingui/react/macro";
import dayjs, { isDayjs } from "dayjs";
import { useRouter } from "router2";
import { preload } from "swr";
import useSWRMutation from "swr/mutation";

import { useRelatedPokeList } from "~/hook/domain/useRelatedPokeList.ts";
import { SWR_KEY_USER, useUserPofile } from "~/hook/domain/useUserProfile.ts";
import { useUserRelatedPokeList } from "~/hook/domain/useUserRelatedPokeList.ts";
import { createFetcher } from "~/service/swr/fetcher";
import { isVerifiedUser } from "~/service/util.ts";
import { Image } from "~/ui/base/Image";
import { StackedNavigation } from "~/ui/base/Navigation.tsx";
import { PreloadablePage } from "~/ui/base/PreloadLink";
import { Stat } from "~/ui/base/Stat.tsx";
import { Timer } from "~/ui/base/Timer.tsx";
import { PokeSheet } from "~/ui/overlay/PokeSheet.tsx";
import { UserRelationSheet } from "~/ui/overlay/UserRelationSheet";
import { useAuthNavigator, useUser } from "~/ui/provider/Auth.tsx";
import { useNotification } from "~/ui/provider/Notification.tsx";
import { useStackedLayer } from "~/ui/provider/StackedLayerProvider.tsx";

export const User: PreloadablePage = () => {
  useAuthNavigator({ goToAuth: true });

  const { params } = useRouter();
  const userEmail = params[":userId"];

  const { t } = useLingui();
  const overlay = useStackedLayer();
  const push = useNotification();

  const { client, myInfo, refreshUser } = useUser();

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

  const { isMutating: isFollowLoading, trigger: triggerFollow } =
    useSWRMutation(
      `relation/${userEmail}`,
      (api) =>
        client
          .patch(api, { json: { isFollowing: true } })
          .then(() => mutateAll())
          .then(() => {
            push({
              content: t`사용자를 팔로우했습니다.`,
            });
          }),
      {
        onError: () => {
          push({ content: t`다시 시도해주세요.` });
        },
      },
    );

  const lastPoked =
    pokes?.[0]?.fromUserId === myInfo?.id ? dayjs(pokes?.[0]?.createdAt) : null;
  const isPokable = lastPoked ? dayjs().diff(lastPoked, "hour") >= 24 : true;

  return (
    <div className="min-h-dvh">
      <StackedNavigation
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
            transitionName={userEmail}
          />
          <ul className="grid flex-1 grid-cols-3 items-center pl-5">
            <li>
              <Stat label={t`모든 콕!`} value={data?.totalPokes} />
            </li>
            <li>
              <Stat label={t`내가 콕!`} value={data?.pokes} />
            </li>
            <li>
              <Stat label={t`나를 콕!`} value={data?.pokeds} />
            </li>
          </ul>
        </div>
        <div className="pt-7">
          <div className="flex items-end justify-between">
            <p className="flex items-center text-xl font-bold">
              @{userEmail}
              {data && isVerifiedUser(data) && (
                <span className="ml-1 text-blue-500">
                  <CheckBadgeIcon className="size-5" />
                </span>
              )}
            </p>
          </div>
          <p className="mt-1">{data?.name ?? <span className="block h-6" />}</p>
        </div>
        <div className="flex gap-2 pt-5">
          <button
            className="block flex-2 rounded-2xl border bg-black p-2 font-medium text-white duration-300 active:opacity-60 disabled:bg-zinc-300"
            disabled={!isPokable || isLoading}
            onClick={() => {
              overlay(PokeSheet, { targetUserEmail: userEmail });
            }}
          >
            <Trans>콕! 찌르기</Trans> 👉
          </button>
          <button
            className={`flex flex-1 items-center justify-center rounded-2xl border p-2 font-medium duration-300 active:opacity-60 disabled:bg-zinc-300 ${data?.isFollowing ? "border-black" : "border-transparent bg-zinc-100"}`}
            disabled={isFollowLoading}
            onClick={() => {
              if (data?.isFollowing) {
                overlay(UserRelationSheet, { targetUserEmail: userEmail });
                return;
              }
              void triggerFollow();
            }}
            type="button"
          >
            {data?.isFollowing ? (
              <>
                <Trans>팔로잉</Trans>
                <ChevronDownIcon className="ml-0.5 size-5" />
              </>
            ) : (
              <Trans>팔로우</Trans>
            )}
          </button>
        </div>
        {isDayjs(lastPoked) && !isPokable && (
          <p className="mt-1 text-center text-sm text-zinc-500">
            <strong className="font-medium">
              <Timer to={lastPoked} />
            </strong>{" "}
            <Trans>후에 찌를 수 있어요</Trans>
          </p>
        )}
      </div>
    </div>
  );
};

User.preload = async (history, client) => {
  const { params } = history;
  const userEmail = params[":userId"];
  if (typeof userEmail !== "string") {
    return;
  }
  await preload(SWR_KEY_USER(userEmail), createFetcher(client));
};
