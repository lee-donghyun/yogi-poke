import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { JSX } from "react";

export const Navigation = ({ actions }: { actions?: JSX.Element[] }) => {
  return (
    <header className="fixed inset-x-0 top-0 z-10 flex justify-end bg-white p-5">
      <h1 className="flex-1 font-bold italic">
        <Trans>요기콕콕!</Trans>
        👉
      </h1>
      <nav className="flex gap-5">{actions}</nav>
    </header>
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
    <header
      className="fixed inset-x-0 top-0 z-10 grid bg-white p-5"
      style={{ gridTemplateColumns: "80px 1fr 80px" }}
    >
      <button className="justify-self-start" onClick={onBack} type="button">
        <ChevronLeftIcon className="size-6" />
      </button>
      <h1 className="text-center font-medium">{title}</h1>
      <div className="flex gap-5 justify-self-end">{actions}</div>
    </header>
  );
};
interface ActionButtonProps {
  disabled?: boolean;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
interface ModalNavigationProps {
  left: ActionButtonProps;
  right: ActionButtonProps;
  title: string;
}

export const ModalNavigation = ({
  left,
  right,
  title,
}: ModalNavigationProps) => {
  return (
    <header
      className="fixed inset-x-0 top-0 z-10 grid bg-white p-5"
      style={{ gridTemplateColumns: "80px 1fr 80px" }}
    >
      <button
        className="justify-self-start text-zinc-600 disabled:opacity-60"
        disabled={left.disabled}
        onClick={left.onClick}
        type="button"
      >
        {left.label}
      </button>
      <h1 className="text-center font-medium">{title}</h1>
      <button
        className="justify-self-end disabled:opacity-60"
        disabled={right.disabled}
        onClick={right.onClick}
        type="button"
      >
        {right.label}
      </button>
    </header>
  );
};
