import { useRef } from "react";
import useSWR from "swr";

import { CircleXIcon } from "../component/icon/CircleX";
import { Navigation } from "../component/Navigation";
import { UserListItem } from "../component/UserListItem";
import { useCreatedAt } from "../hook/useCreatedAt";
import { useLocalStorage } from "../hook/useLocalStorage";
import { useRouter } from "../lib/router2";
import { LIKE_PERSIST_KEY } from "../service/const";
import { User } from "../service/dataType";
import { DomainBottomNavigation } from "./MyPage";

export const Like = () => {
  const { navigate } = useRouter();
  const [likes] = useLocalStorage(LIKE_PERSIST_KEY, []);
  const noLikes = likes.length === 0;
  const { data } = useSWR<User[]>(!noLikes ? ["/user", { ids: likes }] : null);
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
              key={user.email + dataUpdatedAt}
              animation={prev.current === data ? null : { delayTimes: i }}
              selected={false}
              userEmail={user.email}
              userName={user.name}
              userProfileImageUrl={user.profileImageUrl}
              onClick={() => {
                navigate({ pathname: `/user/${user.email}` });
              }}
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
