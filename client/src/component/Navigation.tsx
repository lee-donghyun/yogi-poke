import { JSX } from "react";

const ChevronLeft = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.75 19.5L8.25 12l7.5-7.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Navigation = ({ actions }: { actions?: JSX.Element[] }) => {
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex justify-end bg-white p-5">
      <p className="flex-1 font-bold italic">요기콕콕!👉</p>
      <div className="flex gap-5">{actions}</div>
    </div>
  );
};

export const StackedNavigation = ({
  title,
  actions,
  onBack,
}: {
  title: string;
  onBack: () => void;
  actions?: JSX.Element[];
}) => {
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
