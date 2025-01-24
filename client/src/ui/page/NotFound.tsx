import { Trans } from "@lingui/react/macro";
import { Link } from "router2";

export const NotFound = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <h1 className="pt-3 font-mono text-5xl font-medium">404</h1>
      <p className="pt-3 pb-7 text-lg text-zinc-600">
        <Trans>찾을 수 없는 페이지입니다.</Trans>
      </p>
      <Link pathname="/">
        <button className="rounded-xl bg-black p-4 text-white duration-300 active:opacity-60">
          <Trans>홈으로 이동</Trans>
        </button>
      </Link>
    </div>
  );
};
