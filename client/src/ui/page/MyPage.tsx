import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, SparklesIcon } from "@heroicons/react/24/outline";
import { Trans, useLingui } from "@lingui/react/macro";
import { useRouter } from "router2";

import { useRelatedPokeList } from "~/hook/domain/useRelatedPokeList.ts";
import { DELETED_USER } from "~/service/const.ts";
import { isVerifiedUser } from "~/service/util.ts";
import { Image } from "~/ui/base/Image";
import { Navigation } from "~/ui/base/Navigation.tsx";
import { Stat } from "~/ui/base/Stat.tsx";
import { DomainBottomNavigation } from "~/ui/domain/DomainBottomNavigation.tsx";
import { PokeListItem } from "~/ui/domain/PokeListItem.tsx";
import { MenuSheet } from "~/ui/overlay/MenuSheet.tsx";
import { SharedProfileSheet } from "~/ui/overlay/SharedProfileSheet.tsx";
import { UpdateMyInfoStack } from "~/ui/overlay/UpdateMyInfoStack.tsx";
import { useAuthNavigator, useUser } from "~/ui/provider/Auth.tsx";
import { useStackedLayer } from "~/ui/provider/StackedLayerProvider.tsx";

const cx = {
  actionButton:
    // eslint-disable-next-line lingui/no-unlocalized-strings
    "flex-1 rounded-xl border px-2 py-1 text-sm font-medium text-zinc-800 duration-300 active:opacity-60",
};

export const MyPage = () => {
  useAuthNavigator({ goToAuth: true });
  const { replace } = useRouter();
  const overlay = useStackedLayer();
  const { t } = useLingui();
  const { myInfo } = useUser({ revalidateIfHasToken: true });

  const { data, intersectorRef, isFreshData } = useRelatedPokeList();

  return (
    <>
      <Navigation
        actions={[
          <button
            className="active:opacity-60"
            key="alert"
            onClick={() => {
              overlay(MenuSheet);
            }}
            type="button"
          >
            <Bars3Icon className="size-6" />
          </button>,
        ]}
      />
      <main className="min-h-dvh p-5 pt-16">
        <div className="flex pt-5">
          <Image
            alt={t`프로필 이미지`}
            size={80}
            src={myInfo?.profileImageUrl ?? "/asset/default_user_profile.png"}
          />
          <ul className="grid flex-1 grid-cols-3 items-center pl-5">
            <li>
              <Stat
                label={t`모든 콕!`}
                value={myInfo && myInfo.pokes + myInfo.pokeds}
              />
            </li>
            <li>
              <Stat label={t`내가 콕!`} value={myInfo?.pokes} />
            </li>
            <li>
              <Stat label={t`나를 콕!`} value={myInfo?.pokeds} />
            </li>
          </ul>
        </div>
        <div className="pt-7">
          <h1 className="flex items-center text-xl font-bold">
            @{myInfo?.email}
            {myInfo && isVerifiedUser(myInfo) && (
              <span className="ml-1 text-blue-500">
                <CheckBadgeIcon className="size-5" />
              </span>
            )}
          </h1>
          <p className="mt-1">{myInfo?.name ?? <div className="h-6" />}</p>
        </div>
        <div className="flex gap-2 pt-5">
          <button
            className={cx.actionButton}
            onClick={() => {
              overlay(UpdateMyInfoStack);
            }}
            type="button"
          >
            <Trans>프로필 편집</Trans>
          </button>
          <button
            className={cx.actionButton}
            onClick={() => {
              overlay(SharedProfileSheet);
            }}
            type="button"
          >
            <Trans>프로필 공유</Trans>
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          {data?.[0].length === 0 && (
            <div className="animate-from-bottom flex flex-col items-center pt-10 text-zinc-700">
              <SparklesIcon className="size-6" />
              <p className="pt-6">
                <Trans>처음으로 콕 찔러보세요!</Trans>
              </p>
              <button
                className="mt-12 rounded-full bg-black p-3 text-white active:opacity-60 disabled:bg-zinc-300"
                onClick={() => {
                  replace({ pathname: "/search" });
                }}
              >
                <Trans>콕 찌르기</Trans>
                {" 👉"}
              </button>
            </div>
          )}
          {data?.flatMap((pokes, pageIndex) =>
            pokes.map(
              (
                {
                  createdAt,
                  fromUserId,
                  id,
                  payload,
                  relation: { fromUser, toUser },
                },
                index,
              ) => {
                const type = fromUserId === myInfo?.id ? "poke" : "poked";
                const targetUser = {
                  poke: toUser,
                  poked: fromUser,
                }[type];
                const animation = isFreshData(pageIndex)
                  ? { delayTimes: index }
                  : null;
                const isVerified = targetUser
                  ? isVerifiedUser(targetUser)
                  : false;
                return (
                  <PokeListItem
                    animation={animation}
                    date={createdAt}
                    isVerifiedUser={isVerified}
                    key={id}
                    payload={payload}
                    targetUser={targetUser ?? DELETED_USER}
                    type={type}
                  />
                );
              },
            ),
          )}
          <div className="h-24" ref={intersectorRef}></div>
        </div>
      </main>
      <DomainBottomNavigation />
    </>
  );
};
