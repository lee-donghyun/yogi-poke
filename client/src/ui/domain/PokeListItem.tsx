import { Link } from "router2";

import { Poke, User } from "../../service/dataType.ts";
import { getReadableDateOffset } from "../../service/util.ts";
import { type Line } from "../base/Canvas.tsx";
import { CheckBadge } from "../icon/CheckBadge.tsx";
import { useStackedLayer } from "../provider/StackedLayerProvider.tsx";
import { PokeSheet } from "./PokeSheet.tsx";

interface PocketListItemProps {
  animation: {
    delayTimes: number;
  } | null;
  date: string;
  isVerifiedUser: boolean;
  payload: Poke["payload"];
  targetUser: User;
  type: "poke" | "poked";
}

const NormalPokeBody = ({ targetUserName }: { targetUserName: string }) => (
  <p className="text-sm text-zinc-800">
    회원님이 <span className="font-semibold">{targetUserName}</span>
    님을 콕 찔렀습니다
  </p>
);

const NormalPokedBody = ({ targetUserName }: { targetUserName: string }) => (
  <p className="text-sm text-zinc-800">
    <span className="font-semibold">{targetUserName}</span>님이 회원님을 콕
    찔렀습니다
  </p>
);

const EmojiPokeBody = ({
  message,
  targetUserName,
}: {
  message: string;
  targetUserName: string;
}) => (
  <p className="text-sm text-zinc-800">
    회원님이 <span className="font-semibold">{targetUserName}</span>
    님에게 메세지를 보냈습니다: {message}
  </p>
);

const EmojiPokedBody = ({
  message,
  targetUserName,
}: {
  message: string;
  targetUserName: string;
}) => (
  <p className="text-sm text-zinc-800">
    <span className="font-semibold">{targetUserName}</span>님이 회원님에게
    메세지를 보냈습니다: {message}
  </p>
);

const DrawingPokeBody = ({
  targetUserName,
}: {
  lines: Line[];
  targetUserName: string;
}) => (
  <p className="text-sm text-zinc-800">
    회원님이 <span className="font-semibold">{targetUserName}</span>
    님에게 그림을 보냈습니다:{" "}
    <button
      className="inline-flex items-center justify-center rounded-md bg-zinc-100 px-1 align-middle font-medium"
      type="button"
    >
      보기
    </button>
  </p>
);

const DrawingPokedBody = ({
  targetUserName,
}: {
  lines: Line[];
  targetUserName: string;
}) => (
  <p className="text-sm text-zinc-800">
    <span className="font-semibold">{targetUserName}</span>님이 회원님에게
    그림을 보냈습니다:{" "}
    <button
      className="inline-flex items-center justify-center rounded-md bg-zinc-100 px-1 align-middle font-medium"
      type="button"
    >
      보기
    </button>
  </p>
);

export const PokeListItem = ({
  animation,
  date,
  isVerifiedUser,
  payload,
  targetUser,
  type,
}: PocketListItemProps) => {
  const overlay = useStackedLayer();
  return (
    <div
      {...(animation && {
        className: "from-bottom opacity-0",
        style: {
          animationDelay: `${animation.delayTimes * 50}ms`,
          transform: "translateY(60px)",
        },
      })}
    >
      <div className="flex">
        <img
          alt={`${targetUser.name} 프로필 이미지`}
          className="mt-1 h-8 w-8 min-w-[2rem] rounded-full bg-zinc-200 object-cover"
          src={targetUser.profileImageUrl ?? "/asset/default_user_profile.png"}
        />
        <div className="ml-4 flex-1">
          <p className="relative">
            <Link
              className="flex items-center font-medium"
              pathname={`/user/${targetUser.email}`}
              role="link"
            >
              @{targetUser.email}
              {isVerifiedUser && (
                <span className="ml-0.5 scale-90 text-blue-500">
                  <CheckBadge />
                </span>
              )}
            </Link>
            <span className="absolute right-0 top-1 text-xs font-normal text-zinc-400">
              {getReadableDateOffset(date)}
            </span>
          </p>
          {payload.type === "normal" && type === "poke" && (
            <NormalPokeBody targetUserName={targetUser.name} />
          )}
          {payload.type === "normal" && type === "poked" && (
            <NormalPokedBody targetUserName={targetUser.name} />
          )}
          {payload.type === "emoji" && type === "poke" && (
            <EmojiPokeBody
              message={payload.message}
              targetUserName={targetUser.name}
            />
          )}
          {payload.type === "emoji" && type === "poked" && (
            <EmojiPokedBody
              message={payload.message}
              targetUserName={targetUser.name}
            />
          )}
          {payload.type === "drawing" && type === "poke" && (
            <DrawingPokeBody
              lines={payload.lines}
              targetUserName={targetUser.name}
            />
          )}
          {payload.type === "drawing" && type === "poked" && (
            <DrawingPokedBody
              lines={payload.lines}
              targetUserName={targetUser.name}
            />
          )}
          {type === "poked" && (
            <button
              className="mt-1.5 w-full rounded-lg bg-zinc-100 p-1 text-sm font-medium text-zinc-900 active:opacity-60 disabled:opacity-60"
              onClick={() =>
                overlay(PokeSheet, { targetUserEmail: targetUser.email })
              }
            >
              나도 콕! 찌르기 👉
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
