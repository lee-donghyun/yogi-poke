import { Link, useRouter } from "router2";

import { useUser } from "../component/Auth";

export const Home = () => {
  const { navigate, params } = useRouter();
  const { isLoggedIn } = useUser();

  if (isLoggedIn) {
    navigate({ pathname: "/search" }, { replace: true });
  }
  return (
    <div>
      <img alt="" className="mx-auto mt-20 size-60" src="/asset/icon.jpg" />
      <div className="fixed inset-x-0 bottom-0 flex flex-col gap-5 p-5">
        <Link replace pathname="/register" query={params}>
          <button className="block w-full rounded-full bg-black p-4 text-white duration-300 active:opacity-60">
            회원가입
          </button>
        </Link>
        <Link replace pathname="/sign-in">
          <button className="block w-full rounded-full border p-4 duration-300 active:bg-zinc-200 disabled:bg-zinc-300">
            로그인
          </button>
        </Link>
      </div>
    </div>
  );
};
