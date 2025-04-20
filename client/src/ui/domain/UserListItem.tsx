import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { PreloadLink } from "~/ui/base/PreloadLink";

interface UserListItemProps {
  animation: {
    delayTimes: number;
  } | null;
  isVerifiedUser: boolean;
  onClick: () => void;
  selected: boolean;
  userEmail: string;
  userName: string;
  userProfileImageUrl: null | string;
}

export const UserListItem = ({
  animation,
  isVerifiedUser,
  onClick,
  selected,
  userEmail,
  userName,
  userProfileImageUrl,
}: UserListItemProps) => {
  return (
    <button
      className={`rounded-2xl p-2 text-start duration-75 active:scale-[98%] active:bg-yellow-50 ${
        selected ? "bg-yellow-200" : ""
      } ${animation ? "animate-from-right opacity-0" : ""}`}
      onClick={onClick}
      style={
        animation
          ? {
              animationDelay: `${animation.delayTimes * 50}ms`,
              transform: "translateX(120px)",
            }
          : undefined
      }
      type="button"
    >
      <div className="flex">
        <img
          alt=""
          className="mt-1 h-8 w-8 min-w-[2rem] rounded-full bg-zinc-200 object-cover"
          src={userProfileImageUrl ?? "/asset/default_user_profile.png"}
        />
        <div className="ml-3 flex-1">
          <p className="flex items-center font-medium">
            @{userEmail}
            {isVerifiedUser && (
              <span className="ml-0.5 text-blue-500">
                <CheckBadgeIcon className="size-[1.125rem]" />
              </span>
            )}
          </p>
          <p className="text-sm text-zinc-800">{userName}</p>
        </div>
        {selected && (
          <PreloadLink
            className="self-center p-1 text-zinc-400"
            pathname={`/user/${userEmail}`}
            role="button"
          >
            <ChevronRightIcon className="size-6" />
          </PreloadLink>
        )}
      </div>
    </button>
  );
};
