import { usePoke } from "../hook/usePoke";
import { useRouter } from "../lib/router2";
import { eventPokeProps } from "../service/event/firstFive";
import { getReadableDateOffset } from "../service/util";

export const PokeListItem = ({
  type,
  targetUserEmail,
  targetUserName,
  targetUserProfileImageUrl,
  date,
  animation,
}: {
  type: "poke" | "poked";
  targetUserName: string;
  targetUserEmail: string;
  targetUserProfileImageUrl: string | null;
  date: string;
  animation: {
    delayTimes: number;
  } | null;
}) => {
  const { trigger, isMutating } = usePoke(eventPokeProps);
  const { navigate } = useRouter();
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
          alt={`${targetUserName} 프로필 이미지`}
          className="mt-1 h-8 w-8 min-w-[2rem] rounded-full bg-zinc-200 object-cover"
          src={targetUserProfileImageUrl ?? "/asset/default_user_profile.png"}
        />
        <div className="ml-4 flex-1">
          <p className="relative font-medium">
            <span
              onClick={() => navigate({ pathname: `/user/${targetUserEmail}` })}
              role="link"
            >
              @{targetUserEmail}
            </span>
            <span className="absolute right-0 top-1 text-xs font-normal text-zinc-400">
              {getReadableDateOffset(date)}
            </span>
          </p>
          <p className="text-sm text-zinc-800">
            {
              {
                poked: (
                  <>
                    <span className="font-semibold">{targetUserName}</span>님이
                    회원님을 콕 찔렀습니다
                  </>
                ),
                poke: (
                  <>
                    회원님이{" "}
                    <span className="font-semibold">{targetUserName}</span>님을
                    콕 찔렀습니다
                  </>
                ),
              }[type]
            }
          </p>
          {type === "poked" && (
            <button
              className="mt-1.5 w-full rounded-md border border-zinc-600 p-1 text-sm text-zinc-900 disabled:opacity-60"
              disabled={isMutating}
              onClick={() => trigger({ email: targetUserEmail })}
            >
              나도 콕! 찌르기 👉
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
