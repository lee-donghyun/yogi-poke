import { useRouter } from "router2";

import { BottomNavigation } from "../base/BottomNavigation.tsx";
import { Search } from "../icon/Search.tsx";
import { Star } from "../icon/Star.tsx";
import { useUser } from "../provider/Auth.tsx";

export const DomainBottomNavigation = () => {
  const { path, replace } = useRouter();
  const { myInfo } = useUser();
  const onClick = (pathname: string) => {
    if (pathname === path) {
      window.scrollTo({ behavior: "smooth", top: 0 });
    } else {
      replace({ pathname });
    }
  };
  return (
    <BottomNavigation
      menus={[
        <button
          className={`flex flex-1 justify-center ${path === "/search" ? "text-black" : "text-zinc-400"}`}
          key="search"
          onClick={() => onClick("/search")}
        >
          <Search />
        </button>,
        <button
          className={`flex flex-1 justify-center ${path === "/like" ? "text-black" : "text-zinc-400"}`}
          key="like"
          onClick={() => onClick("/like")}
        >
          <Star />
        </button>,
        <button
          className="flex flex-1 justify-center"
          key="myPage"
          onClick={() => onClick("/my-page")}
        >
          <img
            alt=""
            className={`h-6 w-6 rounded-full border-[1.5px] bg-zinc-200 object-cover ${path === "/my-page" ? "border-black" : "border-transparent"}`}
            src={myInfo?.profileImageUrl ?? "/asset/default_user_profile.png"}
          />
        </button>,
      ]}
    />
  );
};
