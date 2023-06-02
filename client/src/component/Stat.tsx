import { CountUp } from "./CountUp";

export const Stat = ({ label, value }: { value: number; label: string }) => {
  return (
    <div className="flex flex-1 flex-col items-center">
      <p className="text-xl font-extrabold">
        <CountUp duration={400} from={value} to={value} />
      </p>
      <p>{label}</p>
    </div>
  );
};
