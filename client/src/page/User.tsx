import dayjs, { isDayjs } from "dayjs";
import { useRouter } from "router2";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { useUser } from "../component/Auth";
import { Block } from "../component/icon/Block";
import { Star, StarSolid } from "../component/icon/Star";
import { StackedNavigation } from "../component/Navigation";
import { useNotification } from "../component/Notification";
import { Stat } from "../component/Stat";
import { Timer } from "../component/Timer";
import { useLocalStorage } from "../hook/useLocalStorage";
import { usePoke } from "../hook/usePoke";
import { yogiPokeApi } from "../service/api";
import { LIKE_PERSIST_KEY } from "../service/const";

export const DAY_IN_UNIX = 1000 * 60 * 60 * 24;
export const MINUTE_IN_UNIX = 1000 * 60;

interface UserData {
  email: string;
  id: number;
  name: string;
  profileImageUrl: null | string;
  pokeds: number;
  pokes: number;
}

interface UserPokeData {
  createdAt: string;
  id: number;
  relationFromUserId: number;
  relationToUserId: number;
}

export const User = () => {
  const { myInfo } = useUser({ assertAuth: true });

  const { params } = useRouter();
  const userEmail = params[":userId"];
  const push = useNotification();
  const { trigger, isMutating } = usePoke();

  const { data, mutate: mutateUser } = useSWR<UserData>([`/user/${userEmail}`]);

  const {
    data: pokes,
    isLoading,
    mutate: mutateUserPoke,
  } = useSWR<UserPokeData[]>([`/mate/poke/${userEmail}`, { limit: 1 }]);

  const { trigger: triggerBlock, isMutating: isBlockLoading } = useSWRMutation(
    `/user/relation/${userEmail}`,
    (api) =>
      yogiPokeApi.patch(api, { isAccepted: false }).then(() => {
        push({ content: "사용자를 차단했습니다." });
        history.back();
      }),
    {
      onError: () => {
        push({ content: "다시 시도해주세요." });
      },
    },
  );

  const [likes, setLikes] = useLocalStorage<number[]>(LIKE_PERSIST_KEY, []);
  const isLiked = typeof data?.id === "number" && likes.includes(data.id);
  const lastPoked =
    pokes?.[0]?.relationFromUserId === myInfo?.id
      ? dayjs(pokes?.[0]?.createdAt)
      : null;
  const isPokable = lastPoked ? dayjs().diff(lastPoked, "hour") >= 24 : true;

  return (
    <div className="min-h-screen">
      <StackedNavigation
        title={`@${userEmail}`}
        actions={[
          <button
            key="block"
            className="text-zinc-400 active:opacity-60"
            disabled={isBlockLoading}
            type="button"
            onClick={() => {
              void triggerBlock();
            }}
          >
            <Block />
          </button>,
        ]}
        onBack={() => {
          history.back();
        }}
      />
      <div className="p-5">
        <div className="flex justify-center pt-16">
          <img
            className="h-24 w-24 rounded-full bg-zinc-200 object-cover"
            src={data?.profileImageUrl ?? "/asset/default_user_profile.png"}
          />
        </div>
        <div className="mt-10">
          <div className="flex items-end justify-between">
            <p className="text-xl font-bold">@{userEmail}</p>
            <button
              key="edit"
              className="active:opacity-60"
              type="button"
              onClick={() => {
                isLiked
                  ? setLikes(likes.filter((id) => id !== data.id))
                  : data && setLikes([...likes, data.id]);
              }}
            >
              <span className="block scale-[80%] text-zinc-500">
                {isLiked ? (
                  <span className="text-yellow-500">
                    <StarSolid />
                  </span>
                ) : (
                  <Star />
                )}
              </span>
            </button>
          </div>
          <p className="mt-1">{data?.name ?? <span className="block h-6" />}</p>
        </div>
        <div className="mt-10 flex items-center">
          <Stat label="내가 콕! 찌른 횟수" value={data?.pokes ?? 0} />
          <div className="h-12 w-px bg-zinc-200"></div>
          <Stat label="내가 콕! 찔린 횟수" value={data?.pokeds ?? 0} />
        </div>
      </div>
      <div className="p-5">
        <button
          className="block w-full rounded-lg bg-black p-2 text-white duration-300 active:opacity-60 disabled:bg-zinc-300"
          disabled={!isPokable || isLoading || isMutating}
          onClick={() =>
            void trigger({
              email: userEmail,
              payload: { type: "normal" },
            }).then(() => Promise.allSettled([mutateUserPoke(), mutateUser()]))
          }
        >
          콕 찌르기 👉
        </button>
        {isDayjs(lastPoked) && !isPokable && (
          <p className="mt-1 text-center text-sm text-zinc-500">
            <b className="font-medium">
              <Timer to={lastPoked} />
            </b>
            {" 후에 찌를 수 있어요"}
          </p>
        )}
      </div>
    </div>
  );
};
