import { useCallback, useRef } from "react";
import useSWRInfinite from "swr/infinite";

import { useUser } from "../component/Auth";
import { BottomNavigation } from "../component/BottomNavigation";
import { Star } from "../component/icon/Star";
import { Navigation } from "../component/Navigation";
import { PokeListItem } from "../component/PokeListItem";
import {
  createDraggableSheet,
  useStackedLayer,
} from "../component/StackedLayerProvider";
import { Stat } from "../component/Stat";
import { useIntersectionObserver } from "../hook/useIntersectionObserver";
import { Link, useRouter } from "../lib/router2";
import { UpdateMyInfo } from "./UpdateMyInfo";

const SearchIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BlinkIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SettingIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
            <SettingIcon />
            <span>설정</span>
          </button>
        </li>
      </ul>
    </div>
  );
});

export const DomainBottomNavigation = () => {
  const { path } = useRouter();
  const { myInfo } = useUser();
  return (
    <BottomNavigation
      menus={[
        <Link
          key="search"
          replace
          pathname="/search"
          className={`flex flex-1 justify-center ${
            path === "/search" ? "text-black" : "text-zinc-400"
          }`}
        >
          <SearchIcon />
        </Link>,
        <Link
          key="like"
          replace
          pathname="/like"
          className={`flex flex-1 justify-center ${
            path === "/like" ? "text-black" : "text-zinc-400"
          }`}
        >
          <Star />
        </Link>,
        <Link
          key="myPage"
          replace
          className="flex flex-1 justify-center"
          pathname="/my-page"
        >
          <img
            alt=""
            src={myInfo?.profileImageUrl ?? "/asset/default_user_profile.png"}
            className={`h-6 w-6 rounded-full border-[1.5px] bg-zinc-200 object-cover ${
              path === "/my-page" ? "border-black" : "border-transparent"
            }`}
          />
        </Link>,
      ]}
    />
  );
};
type Poke = {
  id: number;
  createdAt: string;
  fromUserId: number;
  toUserId: number;
  relation: Relation;
};

type Relation = {
  fromUserId: number;
  toUserId: number;
  isAccepted: boolean;
  fromUser: User;
  toUser: User;
};

type User = {
  email: string;
  id: number;
  name: string;
  profileImageUrl: null | string;
};

const POKE_LIST_LIMIT = 20;

export const MyPage = () => {
  const { navigate } = useRouter();
  const overlay = useStackedLayer();
  const { assertAuth, myInfo } = useUser({
    revalidateIfHasToken: true,
  });
  assertAuth();

  const { data, setSize, error, isLoading } = useSWRInfinite<Poke[]>(
    (index, previous) =>
      index === 0 || (previous && previous.length === POKE_LIST_LIMIT)
        ? ["/mate/poke", { limit: POKE_LIST_LIMIT, page: index + 1 }]
        : null,
  );
  const loadMore = useCallback(
    () => !isLoading && !error && setSize((prev) => prev + 1),
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
            <MenuIcon />
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
            <button
              key="edit"
              className="active:opacity-60"
              type="button"
              onClick={() => {
                overlay(UpdateMyInfo);
              }}
            >
              <span className="block scale-[80%] text-zinc-500">
                <EditIcon />
              </span>
            </button>
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
              <BlinkIcon />
              <p className="pt-6">처음으로 콕 찔러보세요!</p>
              <button
                className="mt-12 rounded-full bg-black p-3 text-white active:opacity-60 disabled:bg-zinc-300"
                onClick={() =>
                  navigate({ pathname: "/search" }, { replace: true })
                }
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
