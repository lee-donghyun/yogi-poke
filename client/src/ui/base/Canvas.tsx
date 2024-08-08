import { animated, useSpring } from "@react-spring/konva";
import { useState } from "react";
import { KonvaNodeEvents, Layer, Line, Stage } from "react-konva";

interface CanvasProps {
  height: number;
  width: number;
}

interface Line {
  color: string;
  id: number;
  points: number[];
}

const Trace = (props: Parameters<typeof animated.Circle>[0]) => {
  const radiusProps = useSpring({
    config: { duration: 300 },
    from: { radius: 10 },
    to: { radius: 0 },
  });

  return (
    <animated.Circle
      {...props}
      {...radiusProps}
      fill="white"
      shadowBlur={10}
      shadowColor="white"
    />
  );
};

export const Canvas = ({ height, width }: CanvasProps) => {
  const [lines, setLines] = useState<Line[]>([]);
  const [traces, setTraces] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );

  const onStart = () => {
    setLines((lines) => [
      ...lines,
      {
        color: "red",
        id: Date.now(),
        points: [],
      },
    ]);
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
    setTraces((p) => [...p, { id: Date.now(), x: point.x, y: point.y }]);
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
        {traces.map((trace) => (
          <Trace key={trace.id} x={trace.x} y={trace.y} />
        ))}
      </Layer>
    </Stage>
  );
};
