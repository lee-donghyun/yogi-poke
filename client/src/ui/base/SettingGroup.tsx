import { createRef, useRef } from "react";

import { ChevronRight } from "../icon/ChevronRight.tsx";

interface SettingGroupProps<T extends string> {
  title: string;
  subGroups: {
    open: boolean;
    title: T;
    children: JSX.Element;
  }[];
  onOpenSubgroup: (title: T) => void;
}
export const SettingGroup = <T extends string>({
  subGroups,
  title,
  onOpenSubgroup,
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
            <div
              className="flex items-center justify-between py-4 text-lg font-medium"
              onClick={() => {
                onOpenSubgroup(subGroup.title);
              }}
            >
              {subGroup.title}
              <span
                className={`duration-300 ${subGroup.open ? "rotate-90" : "text-zinc-700"}`}
              >
                <ChevronRight />
              </span>
            </div>
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
                ref={chidlrenRef.current[index]}
                className="rounded-xl bg-zinc-50 px-3"
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
