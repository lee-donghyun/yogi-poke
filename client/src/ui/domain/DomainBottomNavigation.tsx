import { Link, useRouter } from "router2";

import { BottomNavigation } from "../base/BottomNavigation.tsx";
import { Search } from "../icon/Search.tsx";
import { Star } from "../icon/Star.tsx";
import { useUser } from "../provider/Auth.tsx";

export const DomainBottomNavigation = () => {
  const { path } = useRouter();
  const { myInfo } = useUser();
  return (
    <BottomNavigation
      menus={[
        <Link
          key="search"
          replace
          className={`flex flex-1 justify-center ${path === "/search" ? "text-black" : "text-zinc-400"}`}
          pathname="/search"
        >
          <Search />
        </Link>,
        <Link
          key="like"
          replace
          className={`flex flex-1 justify-center ${path === "/like" ? "text-black" : "text-zinc-400"}`}
          pathname="/like"
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
            className={`h-6 w-6 rounded-full border-[1.5px] bg-zinc-200 object-cover ${path === "/my-page" ? "border-black" : "border-transparent"}`}
            src={myInfo?.profileImageUrl ?? "/asset/default_user_profile.png"}
          />
        </Link>,
      ]}
    />
  );
};
