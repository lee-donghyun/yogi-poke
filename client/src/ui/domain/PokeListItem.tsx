import { useRouter } from "router2";

import { Poke, User } from "../../service/dataType.ts";
import { getReadableDateOffset } from "../../service/util.ts";
import { CheckBadge } from "../icon/CheckBadge.tsx";
import { useStackedLayer } from "../provider/StackedLayerProvider.tsx";
import { PokeSheet } from "./PokeSheet.tsx";

interface PocketListItemProps {
  type: "poke" | "poked";
  targetUser: User;
  date: string;
  animation: {
    delayTimes: number;
  } | null;
  payload: Poke["payload"];
  isVerifiedUser: boolean;
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
  targetUserName,
  message,
}: {
  targetUserName: string;
  message: string;
}) => (
  <p className="text-sm text-zinc-800">
    회원님이 <span className="font-semibold">{targetUserName}</span>
    님에게 메세지를 보냈습니다: {message}
  </p>
);

const EmojiPokedBody = ({
  targetUserName,
  message,
}: {
  targetUserName: string;
  message: string;
}) => (
  <p className="text-sm text-zinc-800">
    <span className="font-semibold">{targetUserName}</span>님이 회원님에게
    메세지를 보냈습니다: {message}
  </p>
);

export const PokeListItem = ({
  type,
  targetUser,
  date,
  animation,
  payload,
  isVerifiedUser,
}: PocketListItemProps) => {
  const { navigate } = useRouter();
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
            <span
              className="flex items-center font-medium"
              role="link"
              onClick={() => {
                navigate({ pathname: `/user/${targetUser.email}` });
              }}
            >
              @{targetUser.email}
              {isVerifiedUser && (
                <span className="ml-0.5 scale-90 text-blue-500">
                  <CheckBadge />
                </span>
              )}
            </span>
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
          {type === "poked" && (
            <button
              className="mt-1.5 w-full rounded-md border border-zinc-600 p-1 text-sm text-zinc-900 disabled:opacity-60"
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
