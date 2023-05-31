export const PokeListItem = ({
  type,
  targetUserEmail,
  targetUserName,
  targetUserProfileImageUrl,
}: {
  type: "poke" | "poked";
  targetUserName: string;
  targetUserEmail: string;
  targetUserProfileImageUrl?: string;
  date: string;
}) => {
  return (
    <div>
      <div className="flex">
        <img
          alt={`${targetUserName} 프로필 이미지`}
          className="mt-1 h-8 w-8 min-w-[2rem] rounded-full bg-zinc-200"
          src={targetUserProfileImageUrl ?? "/asset/default_user_profile.png"}
        />
        <div className="ml-4 flex-1">
          <p className="relative font-medium">
            @{targetUserEmail}
            <span className="absolute right-0 top-1 text-xs font-normal text-zinc-400">
              1일 전
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
            <button className="mt-1 w-full rounded-md border border-zinc-600 p-1 text-sm">
              나도 콕! 찌르기 👉
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
