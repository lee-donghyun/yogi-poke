import { createRef, Key, ReactNode, useRef } from "react";

import { ChevronRight } from "../icon/ChevronRight.tsx";

interface SettingGroupProps<T> {
  onOpenSubgroup: (id: T) => void;
  subGroups: {
    children: ReactNode;
    id: T;
    open: boolean;
    title: string;
  }[];
  title: string;
}
export const SettingGroup = <T extends Key>({
  onOpenSubgroup,
  subGroups,
  title,
}: SettingGroupProps<T>) => {
  const chidlrenRef = useRef(
    Array.from({ length: subGroups.length }).map(() =>
      createRef<HTMLDivElement>(),
    ),
  );

  return (
    <div className="bg-white pb-10">
      <h4 className="text-sm font-medium text-zinc-400">{title}</h4>
      <div>
        {subGroups.map((subGroup, index) => (
          <div key={subGroup.title}>
            <button
              className="flex w-full items-center justify-between py-4 text-lg font-medium"
              onClick={() => {
                onOpenSubgroup(subGroup.id);
              }}
            >
              {subGroup.title}
              <span
                className={`duration-300 ${subGroup.open ? "rotate-90" : "text-zinc-700"}`}
              >
                <ChevronRight />
              </span>
            </button>
            <div
              className="overflow-hidden duration-300"
              style={
                subGroup.open
                  ? {
                      height: chidlrenRef.current[index].current?.offsetHeight,
                      opacity: 1,
                    }
                  : { height: 0, opacity: 0 }
              }
            >
              <div
                className="rounded-xl bg-zinc-50 px-3"
                ref={chidlrenRef.current[index]}
              >
                {subGroup.children}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
