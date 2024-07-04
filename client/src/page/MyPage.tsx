import { useCallback, useRef } from "react";
import { useRouter } from "router2";
import useSWRInfinite from "swr/infinite";

import { useUser } from "../component/Auth";
import { DomainBottomNavigation } from "../component/BottomNavigation.DomainBottomNavigation";
import { ArrowUpOnSquare } from "../component/icon/ArrowUpOnSquare";
import { Blink } from "../component/icon/Blink";
import { Edit } from "../component/icon/Edit";
import { Menu } from "../component/icon/Menu";
import { Setting } from "../component/icon/Setting";
import { Navigation } from "../component/Navigation";
import { PokeListItem } from "../component/PokeListItem";
import {
  createDraggableSheet,
  useStackedLayer,
} from "../component/StackedLayerProvider";
import { Stat } from "../component/Stat";
import { useIntersectionObserver } from "../hook/useIntersectionObserver";
import { SharedProfile } from "./SharedProfile";
import { UpdateMyInfo } from "./UpdateMyInfo";

const MenuSheet = createDraggableSheet(({ close }) => {
  const { navigate } = useRouter();
  return (
    <div className="p-3 pb-32">
      <ul>
        <li>
          <button
            className="flex w-full items-center gap-3 rounded-xl px-2 py-3 duration-150 active:scale-[98%] active:bg-zinc-100"
            onClick={() => {
              close();
              setTimeout(() => {
                navigate({ pathname: "/setting" });
              }, 200);
            }}
          >
            <Setting />
            <span>설정</span>
          </button>
        </li>
      </ul>
    </div>
  );
});

interface Poke {
  id: number;
  createdAt: string;
  fromUserId: number;
  toUserId: number;
  relation: Relation;
}

interface Relation {
  fromUserId: number;
  toUserId: number;
  isAccepted: boolean;
  fromUser: User;
  toUser: User;
}

interface User {
  email: string;
  id: number;
  name: string;
  profileImageUrl: null | string;
}

const POKE_LIST_LIMIT = 20;

export const MyPage = () => {
  const { navigate } = useRouter();
  const overlay = useStackedLayer();
  const { myInfo } = useUser({
    revalidateIfHasToken: true,
    assertAuth: true,
  });

  const { data, setSize, error, isLoading } = useSWRInfinite<Poke[], unknown>(
    (index, previous) =>
      index === 0 || (previous && previous.length === POKE_LIST_LIMIT)
        ? ["/mate/poke", { limit: POKE_LIST_LIMIT, page: index + 1 }]
        : null,
  );
  const loadMore = useCallback(
    () => !isLoading && !error && void setSize((prev) => prev + 1),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, setSize, !!error],
  );
  const intersectorRef = useIntersectionObserver(loadMore);
  const prevData = useRef(data);

  return (
    <div className="min-h-screen">
      <Navigation
        actions={[
          <button
            key="alert"
            className="active:opacity-60"
            type="button"
            onClick={() => {
              overlay(MenuSheet);
            }}
          >
            <Menu />
          </button>,
        ]}
      />
      <div className="p-5">
        <div className="flex justify-center pt-16">
          <img
            className="h-24 w-24 rounded-full bg-zinc-200 object-cover"
            src={myInfo?.profileImageUrl ?? "/asset/default_user_profile.png"}
          />
        </div>
        <div className="mt-10">
          <div className="flex items-end justify-between">
            <p className="text-xl font-bold">@{myInfo?.email}</p>
            <div className="flex gap-2">
              <button
                className="active:opacity-60"
                type="button"
                onClick={() => {
                  overlay(UpdateMyInfo);
                }}
              >
                <span className="block scale-[80%] text-zinc-500">
                  <Edit />
                </span>
              </button>
              <button
                className="active:opacity-60"
                type="button"
                onClick={() => {
                  overlay(SharedProfile);
                }}
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
          <Stat label="내가 콕! 찌른 횟수" value={myInfo?.pokes ?? 0} />
          <div className="h-12 w-px bg-zinc-200"></div>
          <Stat label="내가 콕! 찔린 횟수" value={myInfo?.pokeds ?? 0} />
        </div>
        <div className="mt-10 flex flex-col gap-4">
          {(error || data?.[0].length === 0) && (
            <div className="flex flex-col items-center pt-10 text-zinc-700">
              <Blink />
              <p className="pt-6">처음으로 콕 찔러보세요!</p>
              <button
                className="mt-12 rounded-full bg-black p-3 text-white active:opacity-60 disabled:bg-zinc-300"
                onClick={() => {
                  navigate({ pathname: "/search" }, { replace: true });
                }}
              >
                콕 찌르기 👉
              </button>
            </div>
          )}
          {data
            ?.map((pokes, pageIndex) =>
              pokes.map(
                ({ createdAt, id, relation: { fromUser, toUser } }, index) => {
                  const type = fromUser.id === myInfo?.id ? "poke" : "poked";
                  const targetUser = {
                    poke: toUser,
                    poked: fromUser,
                  }[type];
                  const animation =
                    pageIndex + 1 > (prevData.current?.length ?? 0)
                      ? { delayTimes: index }
                      : null;
                  return (
                    <PokeListItem
                      key={id}
                      animation={animation}
                      date={createdAt}
                      targetUserEmail={targetUser.email}
                      targetUserName={targetUser.name}
                      targetUserProfileImageUrl={targetUser.profileImageUrl}
                      type={type}
                    />
                  );
                },
              ),
            )
            .flat()}
          <div ref={intersectorRef} className="h-24"></div>
        </div>
      </div>
      <DomainBottomNavigation />
    </div>
  );
};
