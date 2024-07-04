import { QRCodeSVG } from "qrcode.react";

import { useUser } from "../component/Auth";
import { useNotification } from "../component/Notification";
import { createDraggableSheet } from "../component/StackedLayerProvider";

export const SharedProfile = createDraggableSheet(({ close }) => {
  const push = useNotification();
  const { myInfo } = useUser();
  const shareUrl = `https://yogi-poke.vercel.app/me/${myInfo?.email}`;
  return (
    <div className="pb-20 pt-8">
      <div className="flex size-full flex-col items-center">
        <QRCodeSVG
          bgColor="#fff"
          className="rounded-md shadow-lg"
          fgColor="#000"
          size={208}
          value={shareUrl}
        />
        <p className="pt-5 text-xl font-bold text-black">@{myInfo?.email}</p>
        <div className="flex w-52 gap-3 pt-8">
          {[
            navigator?.share && {
              key: "share",
              text: "공유하기",
              onClick: () => {
                close();
                void navigator.share({
                  title: "프로필 공유",
                  text: `${myInfo?.email}의 프로필`,
                  url: shareUrl,
                });
              },
            },
            navigator?.clipboard?.writeText && {
              key: "copy",
              text: "복사하기",
              onClick: () => {
                void navigator?.clipboard.writeText(shareUrl).then(() => {
                  push({
                    content: "클립보드에 복사되었습니다.",
                  });
                });
              },
            },
          ]
            .filter(Boolean)
            .map(
              (props: { key: string; text: string; onClick: () => void }) => (
                <button
                  key={props.key}
                  className="block flex-1 rounded-md border-2 border-black bg-white px-2 py-1 text-sm font-medium active:opacity-60"
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
