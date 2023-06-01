import useSWRInfinite from "swr/infinite";
import { useUser } from "../component/Auth";
import { BottomNavigation } from "../component/BottomNavigation";
import { Navigation } from "../component/Navigation";
import { useNotification } from "../component/Notification";
import { PokeListItem } from "../component/PokeListItem";
import { Link, useRouter } from "../lib/router2";
import { useIntersectionObserver } from "../hook/useIntersectionObserver";
import { useCallback } from "react";
import { getPushNotificationSubscription } from "../service/util";

const Stat = ({ label, value }: { value: number; label: string }) => {
  return (
    <div className="flex flex-1 flex-col items-center">
      <p className="text-xl font-extrabold">{value?.toLocaleString()}</p>
      <p>{label}</p>
    </div>
  );
};

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

const BellIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
  const push = useNotification();
  const { navigate } = useRouter();
  const { assertAuth, myInfo, patchUser } = useUser();
  assertAuth();

  const { data, setSize, error } = useSWRInfinite<Poke[]>((index, previous) => {
    if (index === 0 || (previous && previous.length === POKE_LIST_LIMIT)) {
      return ["/mate/poke", { limit: POKE_LIST_LIMIT, page: index + 1 }];
    }
    return null;
  });
  const loadMore = useCallback(() => setSize((prev) => prev + 1), [setSize]);
  const intersectorRef = useIntersectionObserver(loadMore);

  return (
    <div className="min-h-screen">
      <Navigation
        actions={[
          <button
            key="alert"
            className="active:opacity-60"
            type="button"
            onClick={() => {
              getPushNotificationSubscription()
                .then((pushSubscription) => patchUser({ pushSubscription }))
                .then(() =>
                  push({ content: "이제 콕 찔리면 알림이 울립니다." })
                )
                .catch(console.error);
            }}
          >
            <BellIcon />
          </button>,
          <button
            key="edit"
            className="active:opacity-60"
            type="button"
            onClick={() => {
              push({ content: "내 정보 수정을 하려면 관리자에게 문의하세요." });
            }}
          >
            <EditIcon />
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
          <p className="text-xl font-bold">@{myInfo?.email}</p>
          <p className="mt-1">{myInfo?.name}</p>
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
            ?.map((pokes) =>
              pokes.map(
                ({ createdAt, id, relation: { fromUser, toUser } }, index) => {
                  const type = fromUser.id === myInfo?.id ? "poke" : "poked";
                  const targetUser = {
                    poke: toUser,
                    poked: fromUser,
                  }[type];
                  return (
                    <PokeListItem
                      key={id}
                      date={createdAt}
                      listIndex={index}
                      targetUserEmail={targetUser.email}
                      targetUserName={targetUser.name}
                      targetUserProfileImageUrl={targetUser.profileImageUrl}
                      type={type}
                    />
                  );
                }
              )
            )
            .flat()}
          <div ref={intersectorRef} className="h-24"></div>
        </div>
      </div>
      <DomainBottomNavigation />
    </div>
  );
};
