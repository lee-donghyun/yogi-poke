import { JSX } from "react";

export const Navigation = ({ actions }: { actions?: JSX.Element[] }) => {
  return (
    <div className="fixed inset-x-0 top-0 flex justify-end bg-white p-5">
      <div className="flex gap-5">{actions}</div>
    </div>
  );
};
