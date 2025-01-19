import { Trans, useLingui } from "@lingui/react/macro";
import { useRouter } from "router2";

import { useRelatedPokeList } from "../../hook/domain/useRelatedPokeList.ts";
import { DELETED_USER } from "../../service/const.ts";
import { isVerifiedUser } from "../../service/util.ts";
import { BACKDROP_ANIMATION_DURATION } from "../base/Backdrop.tsx";
import { createDraggableSheet } from "../base/DraggableSheet.tsx";
import { Navigation } from "../base/Navigation.tsx";
import { Stat } from "../base/Stat.tsx";
import { DomainBottomNavigation } from "../domain/DomainBottomNavigation.tsx";
import { PokeListItem } from "../domain/PokeListItem.tsx";
import { ArrowUpOnSquare } from "../icon/ArrowUpOnSquare.tsx";
import { Blink } from "../icon/Blink.tsx";
import { CheckBadge } from "../icon/CheckBadge.tsx";
import { Edit } from "../icon/Edit.tsx";
import { Menu } from "../icon/Menu.tsx";
import { Setting } from "../icon/Setting.tsx";
import { useAuthNavigator, useUser } from "../provider/Auth.tsx";
import { useStackedLayer } from "../provider/StackedLayerProvider.tsx";
import { SharedProfile } from "./SharedProfile.tsx";
import { UpdateMyInfo } from "./UpdateMyInfo.tsx";

const MenuSheet = createDraggableSheet(({ close }) => {
  const { push } = useRouter();
  return (
    <div className="p-3 pb-32">
      <ul>
        <li>
          <button
            className="flex w-full items-center gap-3 rounded-xl px-2 py-3 duration-150 active:scale-[98%] active:bg-zinc-100"
            onClick={() => {
              close();
              setTimeout(() => {
                push({ pathname: "/setting" });
              }, BACKDROP_ANIMATION_DURATION);
            }}
          >
            <Setting />
            <span>
              <Trans>설정</Trans>
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
});

export const MyPage = () => {
  useAuthNavigator({ goToAuth: true });
  const { replace } = useRouter();
  const overlay = useStackedLayer();
  const { t } = useLingui();
  const { myInfo } = useUser({ revalidateIfHasToken: true });

  const { data, error, intersectorRef, isFreshData } = useRelatedPokeList();

  return (
    <div className="min-h-dvh">
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
            <Menu />
          </button>,
        ]}
      />
      <div className="p-5">
        <div className="flex justify-center pt-16">
          <img
            alt={t`프로필 이미지`}
            className="h-24 w-24 rounded-full bg-zinc-200 object-cover"
            src={myInfo?.profileImageUrl ?? "/asset/default_user_profile.png"}
          />
        </div>
        <div className="mt-10">
          <div className="flex items-end justify-between">
            <p className="flex items-center text-xl font-bold">
              @{myInfo?.email}
              {myInfo && isVerifiedUser(myInfo) && (
                <span className="ml-1 text-blue-500">
                  <CheckBadge />
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <button
                className="active:opacity-60"
                onClick={() => {
                  overlay(UpdateMyInfo);
                }}
                type="button"
              >
                <span className="block scale-[80%] text-zinc-500">
                  <Edit />
                </span>
              </button>
              <button
                className="active:opacity-60"
                onClick={() => {
                  overlay(SharedProfile);
                }}
                type="button"
              >
                <span className="block scale-[80%] text-zinc-500">
                  <ArrowUpOnSquare />
                </span>
              </button>
            </div>
          </div>
          <p className="mt-1">{myInfo?.name ?? <div className="h-6" />}</p>
        </div>
        <div className="mt-10 flex items-center">
          <Stat
            label={t`모든 콕!`}
            value={myInfo && myInfo.pokes + myInfo.pokeds}
          />
          <div className="h-12 w-px bg-zinc-200"></div>
          <Stat label={t`내가 콕!`} value={myInfo?.pokes} />
          <div className="h-12 w-px bg-zinc-200"></div>
          <Stat label={t`나를 콕!`} value={myInfo?.pokeds} />
        </div>
        <div className="mt-10 flex flex-col gap-4">
          {(error || data?.[0].length === 0) && (
            <div className="flex flex-col items-center pt-10 text-zinc-700">
              <Blink />
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
      </div>
      <DomainBottomNavigation />
    </div>
  );
};
