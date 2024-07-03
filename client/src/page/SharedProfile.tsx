import { QRCodeSVG } from "qrcode.react";

import { useUser } from "../component/Auth";
import { useNotification } from "../component/Notification";

export const SharedProfile = ({ close }: { close: () => void }) => {
  const push = useNotification();
  const { myInfo } = useUser();
  const shareUrl = `${import.meta.env.BASE_URL}/me/${myInfo?.email}`;
  return (
    <div className="relative min-h-[calc(100vh-env(safe-area-inset-bottom)-env(safe-area-inset-top))] bg-black">
      <div
        className="relative z-10 grid bg-black p-5"
        style={{ gridTemplateColumns: "80px 1fr 80px" }}
      >
        <button
          className="justify-self-start text-zinc-400 disabled:opacity-60"
          onClick={close}
          type="button"
        >
          취소
        </button>
        <p className="text-center font-medium text-white">프로필 공유</p>
        <span></span>
      </div>
      <div className="absolute inset-0 z-0 flex size-full flex-col items-center justify-center gap-5">
        <p className="text-lg font-bold text-white">@{myInfo?.email}</p>
        <QRCodeSVG
          bgColor="#000000"
          className="rounded-md"
          fgColor="#ffffff"
          size={208}
          value={shareUrl}
        />
        <div className="flex w-52 gap-3">
          {[
            navigator?.share && {
              key: "share",
              text: "공유하기",
              onClick: () => {
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
                    className: "text-white",
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
                  className="block flex-1 rounded-md border-2 px-2 py-1 text-sm text-white"
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
};
