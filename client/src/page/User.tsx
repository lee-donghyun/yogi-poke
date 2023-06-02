import useSWR from "swr";
import { StackedNavigation } from "../component/Navigation";
import { useNotification } from "../component/Notification";
import { Stat } from "../component/Stat";
import { useRouter } from "../lib/router2";

const BlockIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const User = () => {
  const { params } = useRouter();
  const userEmail = params[":userId"];
  const push = useNotification();
  const { data } = useSWR<{
    email: string;
    id: number;
    name: string;
    profileImageUrl: null | string;
    pokeds: number;
    pokes: number;
  }>([`/user/${userEmail}`]);
  return (
    <div className="min-h-screen">
      <StackedNavigation
        onBack={() => history.back()}
        title={`@${userEmail}`}
        actions={[
          <button
            key="block"
            className="text-zinc-400 active:opacity-60"
            type="button"
            onClick={() => {
              push({ content: "사용자를 차단하려면 관리자에게 문의하세요." });
            }}
          >
            <BlockIcon />
          </button>,
        ]}
      />
      <div className="p-5">
        <div className="flex justify-center pt-16">
          <img
            className="h-24 w-24 rounded-full bg-zinc-200 object-cover"
            src={"myInfo?.profileImageUrl" ?? "/asset/default_user_profile.png"}
          />
        </div>
        <div className="mt-10">
          <p className="text-xl font-bold">@{userEmail}</p>
          <p className="mt-1">{data?.name ?? ""}</p>
        </div>
        <div className="mt-10 flex items-center">
          <Stat label="내가 콕! 찌른 횟수" value={data?.pokes ?? 0} />
          <div className="h-12 w-px bg-zinc-200"></div>
          <Stat label="내가 콕! 찔린 횟수" value={data?.pokeds ?? 0} />
        </div>
      </div>
    </div>
  );
};
