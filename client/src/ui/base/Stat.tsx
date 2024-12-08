import { CountUp } from "./CountUp.tsx";

export const Stat = ({
  label,
  value,
}: {
  label: string;
  /**
   * 값이 있으면 바로 보여주고, 없으면 0부터 올라가게 한다.
   * @default 0
   */
  value: null | number | undefined;
}) => {
  return (
    <div className="flex flex-1 flex-col items-center">
      <p className="text-xl font-extrabold">
        <CountUp duration={400} from={value ?? 0} to={value ?? 0} />
      </p>
      <p>{label}</p>
    </div>
  );
};
