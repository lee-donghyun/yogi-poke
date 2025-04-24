import { Trans, useLingui } from "@lingui/react/macro";
import { Link, useRouter } from "router2";

import { createDraggableSheet } from "~/ui/base/DraggableSheet";

export const PrivateLoginSheet = createDraggableSheet(({ close, titleId }) => {
  const { params } = useRouter();
  const { t } = useLingui();
  return (
    <div className="p-6 pt-0" data-testid="아이디로 로그인 시트">
      <h2
        className="border-b border-zinc-100 pt-4 pb-6 text-lg font-semibold text-zinc-800"
        id={titleId}
      >
        <Trans>아이디로 로그인</Trans>
      </h2>
      <nav
        aria-label={t`로그인 방법 선택`}
        className="flex flex-col gap-4 pt-6"
      >
        <Link
          className="flex h-12 items-center rounded-2xl bg-zinc-800 px-4 font-semibold text-white duration-200 active:opacity-60 disabled:opacity-60"
          onClick={close}
          pathname="/register"
          query={params}
          replace
        >
          <Trans>회원가입</Trans>
        </Link>
        <Link
          className="flex h-12 items-center rounded-2xl bg-zinc-100 px-4 font-semibold text-zinc-900 duration-200 active:opacity-60 disabled:opacity-60"
          onClick={close}
          pathname="/sign-in"
          replace
        >
          <Trans>로그인</Trans>
        </Link>
      </nav>
    </div>
  );
});
