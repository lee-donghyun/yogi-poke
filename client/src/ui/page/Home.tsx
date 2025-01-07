import { browserSupportsWebAuthn } from "@simplewebauthn/browser";
import { Link, useRouter } from "router2";

import { usePasskey } from "../../hook/domain/usePasskey.ts";
import { ChevronRight } from "../icon/ChevronRight.tsx";
import { Key } from "../icon/Key.tsx";
import { useAuthNavigator } from "../provider/Auth.tsx";
import { useNotification } from "../provider/Notification.tsx";
import {
  createDraggableSheet,
  useStackedLayer,
} from "../provider/StackedLayerProvider.tsx";

const PrivateLoginSheet = createDraggableSheet(({ close }) => {
  const { params } = useRouter();
  return (
    <div className="p-6 pt-0">
      <p className="border-b border-zinc-100 pb-6 pt-4 text-lg font-semibold text-zinc-800">
        아이디로 로그인
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
  useAuthNavigator({ goToApp: "/search" });
  const overlay = useStackedLayer();
  const push = useNotification();
  const { authenticate } = usePasskey();

  return (
    <div>
      <img alt="" className="mx-auto mt-20 size-60" src="/asset/icon.jpg" />
      <div className="fixed inset-x-0 bottom-0 flex flex-col gap-5 p-5">
        <button
          className="flex items-center gap-4 rounded-2xl bg-black p-4 duration-300 active:opacity-60 disabled:opacity-60"
          onClick={() => {
            if (!browserSupportsWebAuthn()) {
              push({
                content:
                  "이 기기는 Passkey를 지원하지 않습니다. 아이디로 로그인할 수 있습니다.",
              });
              return;
            }
            authenticate().catch((err) => {
              console.log(err);

              push({
                content:
                  "사용가능한 Passkey가 없습니다. 아이디로 로그인할 수 있습니다.",
              });
            });
          }}
          type="button"
        >
          <span className="text-zinc-100">
            <Key />
          </span>
          <p className="flex-1 text-left text-white">Passkey로 시작하기</p>
          <span className="text-zinc-500">
            <ChevronRight />
          </span>
        </button>
        <button
          className="rounded-2xl p-2 text-sm text-zinc-400 duration-300 active:opacity-60"
          onClick={() => overlay(PrivateLoginSheet)}
        >
          아이디로 로그인
        </button>
      </div>
    </div>
  );
};
