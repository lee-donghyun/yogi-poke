import { Trans } from "@lingui/react/macro";
import { JSX } from "react";

import { ChevronLeft } from "../icon/ChevronLeft.tsx";

export const Navigation = ({ actions }: { actions?: JSX.Element[] }) => {
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex justify-end bg-white p-5">
      <p className="flex-1 font-bold italic">
        <Trans>요기콕콕!</Trans>
        👉
      </p>
      <div className="flex gap-5">{actions}</div>
    </div>
  );
};

interface StackedNavigationProps {
  actions?: JSX.Element[];
  onBack: () => void;
  title: string;
}

export const StackedNavigation = ({
  actions,
  onBack,
  title,
}: StackedNavigationProps) => {
  return (
    <div
      className="fixed inset-x-0 top-0 z-10 grid bg-white p-5"
      style={{ gridTemplateColumns: "80px 1fr 80px" }}
    >
      <button className="justify-self-start" onClick={onBack} type="button">
        <ChevronLeft />
      </button>
      <p className="text-center font-medium">{title}</p>
      <div className="flex gap-5 justify-self-end">{actions}</div>
    </div>
  );
};
