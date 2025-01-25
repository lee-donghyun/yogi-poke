import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { useRouter } from "router2";

import { BACKDROP_ANIMATION_DURATION } from "~/ui/base/Backdrop";
import { createDraggableSheet } from "~/ui/base/DraggableSheet";

export const MenuSheet = createDraggableSheet(({ close }) => {
  const { push } = useRouter();
  return (
    <div className="p-3 pb-32">
      <ul>
        <li>
          <button
            className="flex w-full items-center gap-3 rounded-xl px-2 py-3 duration-150 active:scale-[98%] active:bg-zinc-100"
            onClick={() => {
              close();
              setTimeout(() => {
                push({ pathname: "/setting" });
              }, BACKDROP_ANIMATION_DURATION);
            }}
          >
            <Cog6ToothIcon className="size-6" />
            <span>
              <Trans>설정</Trans>
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
});
