import { XCircleIcon } from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { useRouter } from "router2";

import { User } from "~/service/dataType.ts";
import { dataUpdatedAtMiddleware } from "~/service/swr/middleware.dataUpdatedAt.ts";
import { createShouldAnimateMiddleware } from "~/service/swr/middleware.shouldAnimate.ts";
import { useSWRMiddleware } from "~/service/swr/middleware.ts";
import { isVerifiedUser } from "~/service/util.ts";
import { Navigation } from "~/ui/base/Navigation.tsx";
import { DomainBottomNavigation } from "~/ui/domain/DomainBottomNavigation.tsx";
import { UserListItem } from "~/ui/domain/UserListItem.tsx";
import { useAuthNavigator } from "~/ui/provider/Auth";

type Key = [string, { email: string; isFollowing: boolean }] | null;
const isEqualKey = (a: Key, b: Key) =>
  a?.[0] === b?.[0] && a?.[1].isFollowing === b?.[1].isFollowing;
const middlewares = [
  createShouldAnimateMiddleware(isEqualKey),
  dataUpdatedAtMiddleware,
];
export const Like = () => {
  useAuthNavigator({ goToAuth: true });
  const { push } = useRouter();

  const { data, dataUpdatedAt, shouldAnimate } = useSWRMiddleware<
    User[],
    typeof middlewares,
    Key
  >(["user", { email: "", isFollowing: true }], { use: middlewares });

  return (
    <div className="min-h-dvh">
      <Navigation />
      <div className="p-5">
        <p className="pt-32 text-2xl font-bold text-zinc-800">
          <Trans>팔로잉</Trans>
        </p>
        <div className="mt-5 flex flex-col" style={{ height: 300 }}>
          {data?.map((user, i) => (
            <UserListItem
              animation={shouldAnimate ? { delayTimes: i } : null}
              isVerifiedUser={isVerifiedUser(user)}
              key={user.email + dataUpdatedAt}
              onClick={() => {
                push({ pathname: `/user/${user.email}` });
              }}
              selected={false}
              userEmail={user.email}
              userName={user.name}
              userProfileImageUrl={user.profileImageUrl}
            />
          ))}
          {data?.length == 0 && (
            <div className="animate-from-bottom flex flex-col items-center pt-16 text-zinc-600">
              <span className="text-zinc-400">
                <XCircleIcon className="size-6" />
              </span>
              <p className="pt-6 text-center">
                <Trans>
                  자주 콕 찌르는 상대를
                  <br />
                  즐겨찾기해보세요.
                </Trans>
              </p>
            </div>
          )}
        </div>
      </div>
      <DomainBottomNavigation />
    </div>
  );
};
