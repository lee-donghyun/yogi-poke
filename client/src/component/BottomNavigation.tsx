import { JSX } from "react";

export const BottomNavigation = ({ menus }: { menus: JSX.Element[] }) => {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="flex">{menus}</div>
    </div>
  );
};
