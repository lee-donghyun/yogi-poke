import { useUser } from "../component/Auth";
import { BottomNavigation } from "../component/BottomNavigation";
import { Navigation } from "../component/Navigation";
import { useNotification } from "../component/Notification";
import { PokeListItem } from "../component/PokeListItem";
import { Link, useRouter } from "../lib/router2";

const Stat = ({ label, value }: { value: number; label: string }) => {
  return (
    <div className="flex flex-1 flex-col items-center">
      <p className="text-xl font-extrabold">{value?.toLocaleString()}</p>
      <p>{label}</p>
    </div>
  );
};

const SearchIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DomainBottomNavigation = () => {
  const { path } = useRouter();
  return (
    <BottomNavigation
      menus={[
        <Link
          key="search"
          replace
          pathname="/search"
          className={`flex flex-1 justify-center ${
            path === "/search" ? "text-black" : "text-zinc-400"
          }`}
        >
          <SearchIcon />
        </Link>,
        <Link
          key="myPage"
          replace
          className="flex flex-1 justify-center"
          pathname="/my-page"
        >
          <img
            alt=""
            src=""
            className={`h-6 w-6 rounded-full bg-zinc-200 object-cover ${
              path === "/my-page" ? "border border-black" : ""
            }`}
          />
        </Link>,
      ]}
    />
  );
};

export const MyPage = () => {
  const push = useNotification();
  const { assertAuth, myInfo } = useUser();
  assertAuth();

  return (
    <div className="min-h-screen">
      <Navigation
        actions={[
          <button
            key="edit"
            className="active:opacity-60"
            type="button"
            onClick={() => {
              push({ content: "내 정보 수정을 하려면 관리자에게 문의하세요." });
            }}
          >
            <EditIcon />
          </button>,
        ]}
      />
      <div className="p-5">
        <div className="flex justify-center pt-16">
          <img
            className="h-24 w-24 rounded-full bg-zinc-200 object-cover"
            src=""
          />
        </div>
        <div className="mt-10">
          <p className="text-xl font-bold">@{myInfo?.email}</p>
          <p className="mt-1">{myInfo?.name}</p>
        </div>
        <div className="mt-10 flex items-center">
          <Stat label="내가 콕! 찌른 횟수" value={myInfo?.pokes ?? 0} />
          <div className="h-12 w-px bg-zinc-200"></div>
          <Stat label="내가 콕! 찔린 횟수" value={myInfo?.pokeds ?? 0} />
        </div>
        <div className="mt-10 flex flex-col gap-4">
          <PokeListItem
            date=""
            targetUserEmail="korean_bill_gates"
            targetUserName="한국인 빌게이츠"
            type="poke"
          />
          <PokeListItem
            date=""
            targetUserEmail="korean_9lock_nine"
            targetUserName="감옥에서 방금나온 글락나인"
            type="poked"
          />
          <PokeListItem
            date=""
            targetUserEmail="korean_bill_gates"
            targetUserName="한국인 빌게이츠"
            type="poke"
          />
          <PokeListItem
            date=""
            targetUserEmail="korean_bill_gates"
            targetUserName="한국인 빌게이츠"
            type="poked"
          />
        </div>
        {/* 여기에서 poke 피드 보기 */}
      </div>
      <DomainBottomNavigation />
    </div>
  );
};
