import { useRouter } from "router2";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { useUser } from "../component/Auth";
import { useNotification } from "../component/Notification";
import { useRelatedPokeList } from "../hook/useRelatedPokeList";
import { yogiPokeApi } from "../service/api";
import { User } from "../service/dataType";

const BLOCKED_USER_SWR_KEY = ["/relation/blocked"];

export const BlockedUser = () => {
  const { navigate } = useRouter();
  const push = useNotification();

  const { refreshUser } = useUser();
  const { mutate: mutateRelatedPokes } = useRelatedPokeList();

  const { data } = useSWR<User[]>(BLOCKED_USER_SWR_KEY);

  const { trigger, isMutating } = useSWRMutation(
    BLOCKED_USER_SWR_KEY,
    (_, { arg }: { arg: string }) =>
      yogiPokeApi
        .patch(`/relation/${arg}`, { isAccepted: true })
        .then(() => Promise.allSettled([refreshUser(), mutateRelatedPokes()]))
        .then(() => {
          push({ content: "차단을 해제했습니다." });
        }),
    {
      onError: () => {
        push({ content: "다시 시도해주세요." });
      },
    },
  );

  return (
    <div className="flex flex-col py-1">
      {data && data.length === 0 && (
        <p className="py-2 text-zinc-700">차단한 사용자가 없습니다.</p>
      )}
      {data &&
        data?.length > 0 &&
        data?.map((user) => (
          <div
            key={user.id}
            className="flex py-2"
            onClick={() => navigate({ pathname: `/user/${user.email}` })}
            role="button"
          >
            <img
              alt=""
              className="mt-1 h-8 w-8 min-w-[2rem] rounded-full bg-zinc-200 object-cover"
              src={user.profileImageUrl ?? "/asset/default_user_profile.png"}
            />
            <div className="ml-3 flex-1">
              <p className="relative font-medium">@{user.email}</p>
              <p className="text-sm text-zinc-800">{user.name}</p>
            </div>
            <button
              className="self-center rounded border border-zinc-700 px-1 text-sm text-zinc-700 disabled:opacity-60"
              disabled={isMutating}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void trigger(user.email);
              }}
            >
              차단 해제
            </button>
          </div>
        ))}
    </div>
  );
};
