export const UserListItem = ({
  userEmail,
  userName,
  selected,
  userProfileImageUrl,
  onClick,
  animation,
}: {
  userEmail: string;
  userName: string;
  userProfileImageUrl: string | null;
  animation: {
    delayTimes: number;
  } | null;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg p-2 text-start duration-75 active:scale-[98%] active:bg-yellow-50 ${
        selected ? "bg-yellow-200" : ""
      } ${animation ? "from-right opacity-0" : ""}`}
      style={
        animation
          ? {
              animationDelay: `${animation.delayTimes * 50}ms`,
              transform: "translateX(120px)",
            }
          : undefined
      }
    >
      <div className="flex">
        <img
          alt=""
          className="mt-1 h-8 w-8 min-w-[2rem] rounded-full bg-zinc-200 object-cover"
          src={userProfileImageUrl ?? "/asset/default_user_profile.png"}
        />
        <div className="ml-3 flex-1">
          <p className="relative font-medium">@{userEmail}</p>
          <p className="text-sm text-zinc-800">{userName}</p>
        </div>
      </div>
    </button>
  );
};
