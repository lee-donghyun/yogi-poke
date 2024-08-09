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

const AnimatedLine = animated.Line as unknown as typeof Line;

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
    <AnimatedLine
      {...(animatedProps as unknown as {
        opacity: number;
        strokeWidth: number;
      })}
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
  const cleanupRef = useRef<ReturnType<typeof setTimeout>>();

  const [traces, setTraces] = useState<Trace[][]>([]);

  const onStart = () => {
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

  const onMove: KonvaNodeEvents["onDragMove"] &
    KonvaNodeEvents["onTouchMove"] = (e) => {
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
    clearTimeout(cleanupRef.current);
    cleanupRef.current = setTimeout(() => {
      setTraces([[]]);
    }, ANIMATED_DURATION);
  };

  return (
    <Stage
      className="overflow-hidden rounded-2xl bg-black"
      height={height}
      onDragMove={onMove}
      onDragStart={onStart}
      onTouchMove={onMove}
      onTouchStart={onStart}
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
