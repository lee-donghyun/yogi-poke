import { useState } from "react";

import { CountUp } from "~/ui/base/CountUp.tsx";

export const Stat = ({
  label,
  value,
}: {
  label: string;
  value: null | number | undefined;
}) => {
  const [hasValueOnFirstRender] = useState(typeof value === "number");
  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-extrabold">
        {hasValueOnFirstRender && value?.toLocaleString()}
        {!hasValueOnFirstRender && (
          <CountUp duration={1500} height={28} value={value ?? null} />
        )}
      </p>
      <p>{label}</p>
    </div>
  );
};
