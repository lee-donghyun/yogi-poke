import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { Trans, useLingui } from "@lingui/react/macro";

import { DELETED_USER } from "~/service/const.ts";
import { Poke, User } from "~/service/dataType.ts";
import { getReadableDateOffset } from "~/service/util.ts";
import { type Line } from "~/ui/base/Canvas.tsx";
import { PreloadLink } from "~/ui/base/PreloadLink";
import { PokeSheet } from "~/ui/overlay/PokeSheet.tsx";
import { ShowDrawingSheet } from "~/ui/overlay/ShowDrawingSheet.tsx";
import { ShowGeolocationSheet } from "~/ui/overlay/ShowGeolocationSheet.tsx";
import { useStackedLayer } from "~/ui/provider/StackedLayerProvider.tsx";

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

const cx = {
  watchButton:
    "inline-flex items-center justify-center rounded-lg bg-zinc-100 px-1 align-middle font-medium",
};

const NormalPokeBody = ({ targetUserName }: { targetUserName: string }) => (
  <p className="text-sm text-zinc-800">
    <Trans>
      회원님이 <span className="font-semibold">{targetUserName}</span>
      님을 콕 찔렀습니다
    </Trans>
  </p>
);

const NormalPokedBody = ({ targetUserName }: { targetUserName: string }) => (
  <p className="text-sm text-zinc-800">
    <Trans>
      <span className="font-semibold">{targetUserName}</span>님이 회원님을 콕
      찔렀습니다
    </Trans>
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
    <Trans>
      회원님이 <span className="font-semibold">{targetUserName}</span>
      님에게 메세지를 보냈습니다: {message}
    </Trans>
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
    <Trans>
      <span className="font-semibold">{targetUserName}</span>님이 회원님에게
      메세지를 보냈습니다: {message}
    </Trans>
  </p>
);

const DrawingPokeBody = ({
  lines,
  targetUserName,
}: {
  lines: Line[];
  targetUserName: string;
}) => {
  const overlay = useStackedLayer();
  const { t } = useLingui();
  return (
    <p className="text-sm text-zinc-800">
      <Trans>
        회원님이 <span className="font-semibold">{targetUserName}</span>
        님에게 그림을 보냈습니다:
      </Trans>{" "}
      <button
        className={cx.watchButton}
        data-testid="보낸 그림 보기"
        onClick={() =>
          overlay(ShowDrawingSheet, {
            lines,
            title: t`${targetUserName}님에게 보낸 그림`,
          })
        }
        type="button"
      >
        <Trans>보기</Trans>
      </button>
    </p>
  );
};

const DrawingPokedBody = ({
  lines,
  targetUserName,
}: {
  lines: Line[];
  targetUserName: string;
}) => {
  const overlay = useStackedLayer();
  const { t } = useLingui();
  return (
    <p className="text-sm text-zinc-800">
      <Trans>
        <span className="font-semibold">{targetUserName}</span>님이 회원님에게
        그림을 보냈습니다:
      </Trans>{" "}
      <button
        className={cx.watchButton}
        data-testid="받은 그림 보기"
        onClick={() =>
          overlay(ShowDrawingSheet, {
            lines,
            title: t`${targetUserName}님이 보낸 그림`,
          })
        }
        type="button"
      >
        <Trans>보기</Trans>
      </button>
    </p>
  );
};

const GeolocationPokeBody = ({
  position,
  targetUserName,
}: {
  position: { latitude: number; longitude: number };
  targetUserName: string;
}) => {
  const overlay = useStackedLayer();
  const { t } = useLingui();
  return (
    <p className="text-sm text-zinc-800">
      <Trans>
        회원님이 <span className="font-semibold">{targetUserName}</span>
        님에게 위치를 보냈습니다:
      </Trans>{" "}
      <button
        className={cx.watchButton}
        data-testid="보낸 위치 보기"
        onClick={() =>
          overlay(ShowGeolocationSheet, {
            position,
            title: t`${targetUserName}님에게 보낸 위치`,
          })
        }
        type="button"
      >
        <Trans>보기</Trans>
      </button>
    </p>
  );
};

const GeolocationPokedBody = ({
  position,
  targetUserName,
}: {
  position: { latitude: number; longitude: number };
  targetUserName: string;
}) => {
  const overlay = useStackedLayer();
  const { t } = useLingui();
  return (
    <p className="text-sm text-zinc-800">
      <Trans>
        <span className="font-semibold">{targetUserName}</span>님이 회원님에게
        위치를 보냈습니다:
      </Trans>{" "}
      <button
        className={cx.watchButton}
        data-testid="받은 위치 보기"
        onClick={() =>
          overlay(ShowGeolocationSheet, {
            position,
            title: t`${targetUserName}님이 보낸 위치`,
          })
        }
        type="button"
      >
        <Trans>보기</Trans>
      </button>
    </p>
  );
};

export const PokeListItem = ({
  animation,
  date,
  isVerifiedUser,
  payload,
  targetUser,
  type,
}: PocketListItemProps) => {
  const overlay = useStackedLayer();
  const { t } = useLingui();
  const targetUserName = targetUser.name;
  return (
    <li
      className="block"
      {...(animation && {
        className: "animate-from-bottom opacity-0 block",
        style: {
          animationDelay: `${animation.delayTimes * 50}ms`,
          transform: "translateY(60px)",
        },
      })}
    >
      <div className="flex">
        <img
          alt={t`${targetUserName} 프로필 이미지`}
          className="mt-1 h-8 w-8 min-w-[2rem] rounded-full bg-zinc-200 object-cover"
          src={targetUser.profileImageUrl ?? "/asset/default_user_profile.png"}
        />
        <div className="ml-4 flex-1">
          <p className="relative">
            <PreloadLink
              className="flex items-center font-medium"
              pathname={`/user/${targetUser.email}`}
              role="link"
            >
              @{targetUser.email}
              {isVerifiedUser && (
                <span className="ml-0.5 text-blue-500">
                  <CheckBadgeIcon className="size-[1.125rem]" />
                </span>
              )}
            </PreloadLink>
            <span className="absolute top-1 right-0 text-xs font-normal text-zinc-400">
              {t(getReadableDateOffset(date))}
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
          {payload.type === "geolocation" && type === "poke" && (
            <GeolocationPokeBody
              position={payload.position}
              targetUserName={targetUser.name}
            />
          )}
          {payload.type === "geolocation" && type === "poked" && (
            <GeolocationPokedBody
              position={payload.position}
              targetUserName={targetUser.name}
            />
          )}
          {type === "poked" && targetUser !== DELETED_USER && (
            <button
              className="mt-1.5 w-full rounded-xl bg-zinc-100 p-1 text-sm font-medium text-zinc-900 active:opacity-60 disabled:opacity-60"
              data-testid="나도 콕 찌르기"
              onClick={() =>
                overlay(PokeSheet, { targetUserEmail: targetUser.email })
              }
            >
              <Trans>나도 콕! 찌르기 👉</Trans>
            </button>
          )}
        </div>
      </div>
    </li>
  );
};
