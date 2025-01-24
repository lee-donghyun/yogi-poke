import { useLingui } from "@lingui/react/macro";
import { lazy, Suspense } from "react";

import { createDraggableSheet } from "~/ui/base/DraggableSheet.tsx";
import { useUser } from "~/ui/provider/Auth.tsx";
import { useNotification } from "~/ui/provider/Notification.tsx";

const QRCodeSVG = lazy(() =>
  import("qrcode.react").then((mod) => ({ default: mod.QRCodeSVG })),
);

export const SharedProfileSheet = createDraggableSheet(({ close }) => {
  const push = useNotification();
  const { t } = useLingui();
  const { myInfo } = useUser();

  const myEmail = myInfo?.email;
  const shareUrl = `https://yogi-poke.vercel.app/me/${myEmail}`;

  return (
    <div className="pt-8 pb-20">
      <div className="flex size-full flex-col items-center">
        <Suspense
          fallback={
            <div className="size-52 animate-pulse rounded-md bg-zinc-100 shadow-lg" />
          }
        >
          <QRCodeSVG
            bgColor="#fff"
            className="rounded-2xl shadow-lg"
            fgColor="#000"
            size={208}
            value={shareUrl}
          />
        </Suspense>
        <p className="pt-5 text-xl font-bold text-black">@{myEmail}</p>
        <div className="flex w-52 gap-3 pt-8">
          {[
            navigator?.share && {
              key: "share",
              onClick: () => {
                close();
                void navigator.share({
                  title: t`(@${myEmail}) - 요기콕콕! 프로필 공유`,
                  url: shareUrl,
                });
              },
              text: t`공유하기`,
            },
            navigator?.clipboard?.writeText && {
              key: "copy",
              onClick: () => {
                void navigator?.clipboard.writeText(shareUrl).then(() => {
                  push({ content: t`클립보드에 복사되었습니다.` });
                });
              },
              text: t`복사하기`,
            },
          ]
            .filter(Boolean)
            .map(
              (props: { key: string; onClick: () => void; text: string }) => (
                <button
                  className="block flex-1 rounded-md border-2 border-black bg-white px-2 py-1 text-sm font-medium active:opacity-60"
                  key={props.key}
                  onClick={props.onClick}
                  type="button"
                >
                  {props.text}
                </button>
              ),
            )}
        </div>
      </div>
    </div>
  );
});
