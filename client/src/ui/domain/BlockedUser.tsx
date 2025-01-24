import { Trans, useLingui } from "@lingui/react/macro";
import { Link } from "router2";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { useRelatedPokeList } from "~/hook/domain/useRelatedPokeList.ts";
import { User } from "~/service/dataType.ts";
import { useUser } from "~/ui/provider/Auth.tsx";
import { useNotification } from "~/ui/provider/Notification.tsx";

const SWR_KEY_BLOCKED_USER = ["relation/blocked"];

export const BlockedUser = () => {
  const push = useNotification();
  const { t } = useLingui();

  const { client, refreshUser } = useUser();
  const { mutate: mutateRelatedPokes } = useRelatedPokeList();

  const { data } = useSWR<User[]>(SWR_KEY_BLOCKED_USER);

  const { isMutating, trigger } = useSWRMutation(
    SWR_KEY_BLOCKED_USER,
    (_, { arg }: { arg: string }) =>
      client
        .patch(`relation/${arg}`, { json: { isAccepted: true } })
        .then(() => Promise.allSettled([refreshUser(), mutateRelatedPokes()]))
        .then(() => {
          push({ content: t`차단을 해제했습니다.` });
        }),
    {
      onError: () => {
        push({ content: t`다시 시도해주세요.` });
      },
    },
  );

  return (
    <div className="flex flex-col py-1">
      {data && data.length === 0 && (
        <p className="py-2 text-zinc-700">
          <Trans>차단한 사용자가 없습니다.</Trans>
        </p>
      )}
      {data &&
        data?.length > 0 &&
        data?.map((user) => (
          <div className="flex py-2" key={user.id}>
            <img
              alt=""
              className="mt-1 h-8 w-8 min-w-[2rem] rounded-full bg-zinc-200 object-cover"
              src={user.profileImageUrl ?? "/asset/default_user_profile.png"}
            />
            <div className="ml-3 flex-1">
              <Link pathname={`/user/${user.email}`}>
                <p className="relative font-medium">@{user.email}</p>
              </Link>
              <p className="text-sm text-zinc-800">{user.name}</p>
            </div>
            <button
              className="self-center rounded-sm border border-zinc-700 px-1 text-sm text-zinc-700 disabled:opacity-60"
              disabled={isMutating}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                void trigger(user.email);
              }}
              type="button"
            >
              <Trans>차단 해제</Trans>
            </button>
          </div>
        ))}
    </div>
  );
};
