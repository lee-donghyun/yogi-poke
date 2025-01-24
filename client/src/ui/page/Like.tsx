import { Trans } from "@lingui/react/macro";
import { useRouter } from "router2";

import { useLocalStorage } from "~/hook/base/useLocalStorage.ts";
import { LIKE_PERSIST_KEY } from "~/service/const.ts";
import { User } from "~/service/dataType.ts";
import { dataUpdatedAtMiddleware } from "~/service/swr/middleware.dataUpdatedAt.ts";
import { createShouldAnimateMiddleware } from "~/service/swr/middleware.shouldAnimate.ts";
import { useSWRMiddleware } from "~/service/swr/middleware.ts";
import { isVerifiedUser } from "~/service/util.ts";
import { Navigation } from "~/ui/base/Navigation.tsx";
import { DomainBottomNavigation } from "~/ui/domain/DomainBottomNavigation.tsx";
import { UserListItem } from "~/ui/domain/UserListItem.tsx";
import { CircleXIcon } from "~/ui/icon/CircleX.tsx";

type Key = [string, string] | null;
const isEqualKey = (a: Key, b: Key) => a?.[0] === b?.[0] && a?.[1] === b?.[1];
const middlewares = [
  createShouldAnimateMiddleware(isEqualKey),
  dataUpdatedAtMiddleware,
];
export const Like = () => {
  const { push } = useRouter();
  const [likes] = useLocalStorage<number[]>(LIKE_PERSIST_KEY, []);

  const { data, dataUpdatedAt, shouldAnimate } = useSWRMiddleware<
    User[],
    typeof middlewares,
    Key
  >(
    !(likes.length === 0)
      ? ["user", likes.map((id) => `ids[]=${id}`).join("&")]
      : null,
    { use: middlewares },
  );
  const noLikes = likes.length === 0 || data?.length === 0;

  return (
    <div className="min-h-dvh">
      <Navigation />
      <div className="p-5">
        <p className="pt-32 text-2xl font-bold text-zinc-800">
          <Trans>즐겨찾기</Trans>
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
          {noLikes && (
            <div className="animate-from-bottom flex flex-col items-center pt-16 text-zinc-600">
              <span className="text-zinc-400">
                <CircleXIcon />
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
