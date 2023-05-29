import { JSX } from "react";

export const Navigation = ({ actions }: { actions?: JSX.Element[] }) => {
  return (
    <div className="fixed inset-x-0 top-0 flex justify-end bg-white p-5">
      <p className="flex-1 font-bold italic">요기콕콕!👉</p>
      <div className="flex gap-5">{actions}</div>
    </div>
  );
};
