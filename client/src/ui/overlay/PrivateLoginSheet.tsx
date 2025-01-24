import { Trans } from "@lingui/react/macro";
import { Link, useRouter } from "router2";

import { createDraggableSheet } from "~/ui/base/DraggableSheet";

export const PrivateLoginSheet = createDraggableSheet(({ close }) => {
  const { params } = useRouter();
  return (
    <div className="p-6 pt-0">
      <p className="border-b border-zinc-100 pb-6 pt-4 text-lg font-semibold text-zinc-800">
        <Trans>아이디로 로그인</Trans>
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
            <Trans>회원가입</Trans>
          </button>
        </Link>
        <Link className="block" onClick={close} pathname="/sign-in" replace>
          <button className="block h-12 w-full rounded-2xl bg-zinc-100 px-4 text-start font-semibold text-zinc-900 duration-200 active:opacity-60 disabled:opacity-60">
            <Trans>로그인</Trans>
          </button>
        </Link>
      </div>
    </div>
  );
});
