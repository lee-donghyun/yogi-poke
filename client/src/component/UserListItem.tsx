export const UserListItem = ({
  userEmail,
  userName,
  listIndex,
  selected,
  userProfileImageUrl,
  onClick,
}: {
  userEmail: string;
  userName: string;
  userProfileImageUrl: string | null;
  listIndex: number;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`from-right rounded-lg p-2 text-start opacity-0 duration-75 active:bg-blue-50 ${
        selected ? "bg-yellow-100" : ""
      }`}
      style={{
        animationDelay: `${listIndex * 50}ms`,
        transform: "translateX(120px)",
      }}
    >
      <div className="flex">
        <img
          alt=""
          className="mt-1 h-8 w-8 min-w-[2rem] rounded-full bg-zinc-200"
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
