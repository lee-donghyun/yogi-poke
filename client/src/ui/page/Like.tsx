import { useRef } from "react";
import { useRouter } from "router2";
import useSWR from "swr";

import { useCreatedAt } from "../../hook/base/useCreatedAt.ts";
import { useLocalStorage } from "../../hook/base/useLocalStorage.ts";
import { LIKE_PERSIST_KEY } from "../../service/const.ts";
import { isVerifiedUser, User } from "../../service/dataType.ts";
import { Navigation } from "../base/Navigation.tsx";
import { DomainBottomNavigation } from "../domain/DomainBottomNavigation.tsx";
import { UserListItem } from "../domain/UserListItem.tsx";
import { CircleXIcon } from "../icon/CircleX.tsx";

export const Like = () => {
  const { navigate } = useRouter();
  const [likes] = useLocalStorage(LIKE_PERSIST_KEY, []);
  const { data } = useSWR<User[]>(
    !(likes.length === 0) ? ["/user", { ids: likes }] : null,
  );
  const noLikes = likes.length === 0 || data?.length === 0;
  const dataUpdatedAt = useCreatedAt(data);
  const prev = useRef(data);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="p-5">
        <p className="pt-32 text-2xl font-bold text-zinc-800">즐겨찾기</p>
        <div className="mt-5 flex flex-col" style={{ height: 300 }}>
          {data?.map((user, i) => (
            <UserListItem
              animation={prev.current === data ? null : { delayTimes: i }}
              isVerifiedUser={isVerifiedUser(user)}
              key={user.email + dataUpdatedAt}
              onClick={() => {
                navigate({ pathname: `/user/${user.email}` });
              }}
              selected={false}
              userEmail={user.email}
              userName={user.name}
              userProfileImageUrl={user.profileImageUrl}
            />
          ))}
          {noLikes && (
            <div className="from-bottom flex flex-col items-center pt-16 text-zinc-600">
              <span className="text-zinc-400">
                <CircleXIcon />
              </span>
              <p className="pt-6 text-center">
                자주 콕 찌르는 상대를
                <br />
                즐겨찾기해보세요.
              </p>
            </div>
          )}
        </div>
      </div>
      <DomainBottomNavigation />
    </div>
  );
};
