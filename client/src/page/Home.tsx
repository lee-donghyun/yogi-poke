import { Link, useRouter } from "router2";

import { useUser } from "../component/Auth";
import { ChevronRight } from "../component/icon/ChevronRight";
import {
  createDraggableSheet,
  useStackedLayer,
} from "../component/StackedLayerProvider";

const INSTAGRAM_REDIRECT_URI =
  "https://api.instagram.com/oauth/authorize?client_id=483954204153950&redirect_uri=https://yogi-poke-api.is-not-a.store/auth/instagram&scope=user_profile&response_type=code";

const PrivateLoginSheet = createDraggableSheet(({ close }) => {
  const { params } = useRouter();
  return (
    <div className="p-5">
      <p className="text-lg font-semibold text-zinc-800">
        Instagram없이 로그인
      </p>
      <div className="mt-12 flex flex-col gap-5">
        <Link replace onClick={close} pathname="/register" query={params}>
          <button className="block w-full rounded-full bg-black p-4 text-white duration-300 active:opacity-60">
            회원가입
          </button>
        </Link>
        <Link replace onClick={close} pathname="/sign-in">
          <button className="block w-full rounded-full border p-4 duration-300 active:bg-zinc-200 disabled:bg-zinc-300">
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
