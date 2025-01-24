import { useRouter } from "router2";

import { BottomNavigation } from "~/ui/base/BottomNavigation.tsx";
import { Search } from "~/ui/icon/Search.tsx";
import { Star } from "~/ui/icon/Star.tsx";
import { useUser } from "~/ui/provider/Auth.tsx";

enum Path {
  LIKE = "/like",
  MY_PAGE = "/my-page",
  SEARCH = "/search",
}

const cx = {
  button:
    // eslint-disable-next-line lingui/no-unlocalized-strings
    "flex flex-1 justify-center p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
};

export const DomainBottomNavigation = () => {
  const { path, replace } = useRouter();
  const { myInfo } = useUser();
  const onClick = (pathname: Path) => {
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
          className={`${cx.button} ${path === Path.SEARCH ? "text-black" : "text-zinc-400"}`}
          key={Path.SEARCH}
          onClick={() => onClick(Path.SEARCH)}
        >
          <Search />
        </button>,
        <button
          className={`${cx.button} ${path === Path.LIKE ? "text-black" : "text-zinc-400"}`}
          key={Path.LIKE}
          onClick={() => onClick(Path.LIKE)}
        >
          <Star />
        </button>,
        <button
          className={cx.button}
          key={Path.MY_PAGE}
          onClick={() => onClick(Path.MY_PAGE)}
        >
          <img
            alt=""
            className={`size-6 rounded-full border-[1.5px] bg-zinc-200 object-cover ${path === Path.MY_PAGE ? "border-black" : "border-transparent"}`}
            src={myInfo?.profileImageUrl ?? "/asset/default_user_profile.png"}
          />
        </button>,
      ]}
    />
  );
};
