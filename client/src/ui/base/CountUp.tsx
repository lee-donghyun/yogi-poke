import { useEffect, useRef } from "react";

const template = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const Column = ({
  duration,
  height,
  value,
}: {
  duration: number;
  height: number;
  value: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const animation = ref.current?.animate(
      {
        transform: `translateY(-${(value || 10) * height}px)`, // 0의 경우 template index 10
      },
      {
        duration,
        easing: `linear(0,.005,.019,.039,.066,.096,.129,.165,.202,.24,.278,.316,.354,.39,.426,.461,.494,.526,.557,.586,.614,.64,.665,.689,.711,.731,.751,.769,.786,.802,.817,.831,.844,.856,.867,.877,.887,.896,.904,.912,.919,.925,.931,.937,.942,.947,.951,.955,.959,.962,.965,.968,.971,.973,.976,.978,.98,.981,.983,.984,.986,.987,.988,.989,.99,.991,.992,.992,.993,.994,.994,.995,.995,.996,.996,.9963,.9967,.9969,.9972,.9975,.9977,.9979,.9981,.9982,.9984,.9985,.9987,.9988,.9989,1)`,
        fill: "forwards",
      },
    );
    return () => {
      animation?.cancel();
    };
  }, [height, value, duration]);
  return (
    <span
      className="flex flex-col"
      ref={ref}
      style={{ height: height * template.length }}
    >
      {template.map((i) => (
        <span className="flex flex-1 items-center justify-center" key={i}>
          {i}
        </span>
      ))}
    </span>
  );
};

export const CountUp = ({
  duration,
  height,
  value,
}: {
  duration: number;
  height: number;
  /**
   * null인 경우 렌더링하지 않는다.
   */
  value: null | number;
}) => {
  return (
    <span
      className="inline-flex overflow-hidden"
      style={{
        height,
        maskImage:
          "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
      }}
    >
      {value
        ?.toLocaleString()
        .split("")
        .map((value, index) => {
          if (value === ",") {
            return <span key={index + value}>,</span>;
          }
          const number = Number(value);
          return (
            <Column
              duration={duration}
              height={height}
              key={index + value}
              value={number}
            />
          );
        })}
    </span>
  );
};
