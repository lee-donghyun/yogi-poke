import { useUser } from "../component/Auth";
import { Navigation } from "../component/Navigation";
import { DomainBottomNavigation } from "./MyPage";

export const Search = () => {
  const { assertAuth } = useUser();
  assertAuth();
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="p-5">
        <p className="pt-52 text-2xl font-bold text-zinc-800">
          누구를 콕콕! 찌를까요?
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="flex items-center pt-10">
            <span className="text-xl font-bold">@</span>
            <input
              className="w-full border-b border-black py-2 text-xl font-bold placeholder:font-normal"
              placeholder="콕콕! 찌를 상대방의 아이디를 입력하세요!"
              type="text"
            />
          </div>
          <div className="flex justify-end pt-9">
            <button className="rounded-full bg-black p-3 text-white">
              콕 찌르기 👉
            </button>
          </div>
        </form>
      </div>
      <DomainBottomNavigation />
    </div>
  );
};
