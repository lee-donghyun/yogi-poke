import { animated, useSpring } from "@react-spring/konva";
import { useRef, useState } from "react";
import { KonvaNodeEvents, Layer, Line, Stage } from "react-konva";

export interface Line {
  color: string;
  id: number;
  points: number[];
}

interface CanvasProps {
  color: string;
  height: number;
  lines: Line[];
  setLines: React.Dispatch<React.SetStateAction<Line[]>>;
  width: number;
}
interface Trace {
  id: string;
  x: number;
  y: number;
}

const ANIMATED_DURATION = 300;

export const Trace = ({
  from,
  to,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
}) => {
  const animatedProps = useSpring({
    config: { duration: ANIMATED_DURATION },
    from: { opacity: 1, strokeWidth: 8 },
    to: { opacity: 0.7, strokeWidth: 0 },
  });

  return (
    /**
     * hack: spring konva 버그로 인해 Line 컴포넌트를 사용할 수 없음
     * @see https://github.com/pmndrs/react-spring/issues/1515
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    <animated.Line
      {...animatedProps}
      lineCap="round"
      lineJoin="round"
      points={[from.x, from.y, to.x, to.y]}
      shadowBlur={10}
      shadowColor="white"
      stroke="white"
    />
  );
};

export const Canvas = ({
  color,
  height,
  lines,
  setLines,
  width,
}: CanvasProps) => {
  const isDrawingRef = useRef(false);
  const cleanupRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [traces, setTraces] = useState<Trace[][]>([]);

  const onStart = () => {
    isDrawingRef.current = true;
    setLines((lines) => [
      ...lines,
      {
        color,
        id: lines.length,
        points: [],
      },
    ]);
    setTraces((p) => [...p, []]);
  };

  const onMove: KonvaNodeEvents["onPointerMove"] = (e) => {
    if (!isDrawingRef.current) {
      return;
    }
    const point = e.currentTarget?.getStage()?.getPointerPosition();
    if (!point) {
      return;
    }
    setLines((lines) => {
      const lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      return [...lines];
    });
    setTraces((p) => [
      ...p.slice(0, -1),
      [
        ...p[p.length - 1],
        { id: `${p.length}-${p[p.length - 1].length}`, x: point.x, y: point.y },
      ],
    ]);
    if (cleanupRef.current) {
      clearTimeout(cleanupRef.current);
    }
    cleanupRef.current = setTimeout(() => {
      setTraces([[]]);
    }, ANIMATED_DURATION);
  };

  const onEnd = () => {
    isDrawingRef.current = false;
  };

  return (
    <Stage
      className="overflow-hidden rounded-2xl bg-black"
      height={height}
      onPointerDown={onStart}
      onPointerMove={onMove}
      onPointerUp={onEnd}
      width={width}
    >
      <Layer>
        {lines.map((line) => (
          <Line
            bezier
            key={line.id}
            lineCap="round"
            lineJoin="round"
            points={line.points}
            stroke={line.color}
          />
        ))}
      </Layer>
      <Layer>
        {traces.flatMap((trace) =>
          trace.map((point, i) => (
            <Trace from={trace[i - 1] ?? point} key={point.id} to={point} />
          )),
        )}
      </Layer>
    </Stage>
  );
};
