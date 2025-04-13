import { JSX } from "react";

export const BottomNavigation = ({ menus }: { menus: JSX.Element[] }) => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 bg-white">
      <div className="flex">{menus}</div>
    </nav>
  );
};
