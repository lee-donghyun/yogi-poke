import { Link } from "router2";

import { CheckBadge } from "../icon/CheckBadge.tsx";
import { ChevronRight } from "../icon/ChevronRight.tsx";

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
      className={`rounded-lg p-2 text-start duration-75 active:scale-[98%] active:bg-yellow-50 ${
        selected ? "bg-yellow-200" : ""
      } ${animation ? "from-right opacity-0" : ""}`}
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
              <span className="ml-0.5 scale-90 text-blue-500">
                <CheckBadge />
              </span>
            )}
          </p>
          <p className="text-sm text-zinc-800">{userName}</p>
        </div>
        {selected && (
          <Link
            className="self-center p-1 text-zinc-400"
            pathname={`/user/${userEmail}`}
            role="button"
          >
            <ChevronRight />
          </Link>
        )}
      </div>
    </button>
  );
};
