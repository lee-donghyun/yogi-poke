import { NoSymbolIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { Trans, useLingui } from "@lingui/react/macro";
import useSWRMutation from "swr/mutation";

import { useRelatedPokeList } from "~/hook/domain/useRelatedPokeList";
import { useUserPofile } from "~/hook/domain/useUserProfile";
import { useUserRelatedPokeList } from "~/hook/domain/useUserRelatedPokeList";
import { AButton } from "~/ui/base/AButton";
import { createDraggableSheet } from "~/ui/base/DraggableSheet";
import { useUser } from "~/ui/provider/Auth";
import { useNotification } from "~/ui/provider/Notification";

export const UserRelationSheet = createDraggableSheet<{
  targetUserEmail: string;
}>(({ close, context, titleId }) => {
  const { t } = useLingui();
  const push = useNotification();

  const { client, refreshUser } = useUser();

  const { mutate: mutateRelatedPokes } = useRelatedPokeList();
  const { mutate: mutateUser } = useUserPofile(context.targetUserEmail);
  const { mutate: mutateUserPoke } = useUserRelatedPokeList(
    context.targetUserEmail,
  );

  const mutateAll = () =>
    Promise.allSettled([
      refreshUser(),
      mutateRelatedPokes(),
      mutateUser(),
      mutateUserPoke(),
    ]);

  const { trigger: triggerBlock } = useSWRMutation(
    `relation/${context.targetUserEmail}`,
    (api) =>
      client
        .patch(api, { json: { isAccepted: false } })
        .then(() => mutateAll())
        .then(() => {
          push({ content: t`사용자를 차단했습니다.` });
          close();
        }),
    {
      onError: () => {
        push({ content: t`다시 시도해주세요.` });
      },
    },
  );

  const { trigger: triggerUnfollow } = useSWRMutation(
    `relation/${context.targetUserEmail}`,
    (api) =>
      client
        .patch(api, { json: { isFollowing: false } })
        .then(() => mutateAll())
        .then(() => {
          push({
            content: t`사용자를 팔로우 취소했습니다.`,
          });
          close();
        }),
    {
      onError: () => {
        push({ content: t`다시 시도해주세요.` });
      },
    },
  );

  return (
    <div className="p-4">
      <h1 className="px-2 text-lg font-semibold text-zinc-800" id={titleId}>
        @{context.targetUserEmail}
      </h1>
      <ul className="space-y-1 pt-4">
        <li>
          <AButton
            className="flex w-full items-center gap-3 rounded-xl px-2 py-3 duration-150 active:scale-[98%] active:bg-zinc-100"
            onClick={() => triggerBlock()}
          >
            <NoSymbolIcon className="size-5" />
            <Trans>차단</Trans>
          </AButton>
        </li>
        <li>
          <AButton
            className="flex w-full items-center gap-3 rounded-xl px-2 py-3 duration-150 active:scale-[98%] active:bg-zinc-100"
            onClick={() => triggerUnfollow()}
          >
            <UserMinusIcon className="size-5" />
            <Trans>팔로우 취소</Trans>
          </AButton>
        </li>
      </ul>
    </div>
  );
});
