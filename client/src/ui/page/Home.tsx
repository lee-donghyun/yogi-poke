import { Link, useRouter } from "router2";

import { ChevronRight } from "../icon/ChevronRight.tsx";
import { useUser } from "../provider/Auth.tsx";
import {
  createDraggableSheet,
  useStackedLayer,
} from "../provider/StackedLayerProvider.tsx";

const INSTAGRAM_REDIRECT_URI =
  "https://api.instagram.com/oauth/authorize?client_id=2580089718840571&redirect_uri=https://yogi-poke-api.is-not-a.store/auth/instagram&scope=user_profile&response_type=code";

const PrivateLoginSheet = createDraggableSheet(({ close }) => {
  const { params } = useRouter();
  return (
    <div className="p-6 pt-0">
      <p className="border-b border-zinc-100 pb-6 pt-4 text-lg font-semibold text-zinc-800">
        Instagram없이 로그인
      </p>
      <div className="flex flex-col gap-4 pt-6">
        <Link
          className="block"
          onClick={close}
          pathname="/register"
          query={params}
          replace
        >
          <button className="block h-12 w-full rounded-2xl bg-zinc-800 px-4 text-start font-semibold text-white duration-200 active:opacity-60 disabled:opacity-60">
            회원가입
          </button>
        </Link>
        <Link className="block" onClick={close} pathname="/sign-in" replace>
          <button className="block h-12 w-full rounded-2xl bg-zinc-100 px-4 text-start font-semibold text-zinc-900 duration-200 active:opacity-60 disabled:opacity-60">
            로그인
          </button>
        </Link>
      </div>
    </div>
  );
});

export const Home = () => {
  const { navigate } = useRouter();
  const { isLoggedIn } = useUser();
  const overlay = useStackedLayer();

  if (isLoggedIn) {
    navigate({ pathname: "/search" }, { replace: true });
  }
  return (
    <div>
      <img alt="" className="mx-auto mt-20 size-60" src="/asset/icon.jpg" />
      <div className="fixed inset-x-0 bottom-0 flex flex-col gap-5 p-5">
        <button
          className="flex items-center gap-4 rounded-2xl border border-zinc-200 p-4 duration-300 active:opacity-60"
          onClick={() => window.open(INSTAGRAM_REDIRECT_URI)}
          type="button"
        >
          <img
            alt="인스타그램 아이콘"
            className="size-9 rounded-lg"
            src="/asset/instagram.png"
          />
          <p className="flex-1 text-left text-black">Instagram으로 시작하기</p>
          <span className="text-zinc-200">
            <ChevronRight />
          </span>
        </button>
        <button
          className="rounded-2xl p-2 text-sm text-zinc-400 duration-300 active:opacity-60"
          onClick={() => overlay(PrivateLoginSheet)}
        >
          Instagram없이 로그인
        </button>
      </div>
    </div>
  );
};
