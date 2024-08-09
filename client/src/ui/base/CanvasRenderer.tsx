import { useEffect, useMemo, useState } from "react";
import { Line as KonvaLine, Layer, Stage } from "react-konva";

import { type Line, Trace } from "./Canvas";

interface CanvasRendererProps {
  height: number;
  lines: Line[];
  width: number;
}

const INITIAL_DRAW_COUNT = 0;

export const CanvasRenderer = ({
  height,
  lines,
  width,
}: CanvasRendererProps) => {
  const [drawCount, setDrawCount] = useState(INITIAL_DRAW_COUNT);

  const pointsCount = useMemo(
    () => lines.reduce((acc, line) => acc + line.points.length, 0) / 4,
    [lines],
  );

  useEffect(() => {
    if (drawCount < pointsCount) {
      const timer = setTimeout(
        () => {
          setDrawCount((p) => p + 1);
        },
        // 그리기 시작하기 전에 딜레이를 준다.
        drawCount === INITIAL_DRAW_COUNT ? 600 : 25,
      );
      return () => clearTimeout(timer);
    }
  }, [drawCount, pointsCount]);

  const draws = lines.reduce(
    ({ lines, top }, line) => {
      return {
        lines: [...lines, { ...line, points: line.points.slice(0, top * 4) }],
        top: Math.max(0, top - Math.min(line.points.length / 4, top)),
      };
    },
    { lines: [], top: drawCount } as { lines: Line[]; top: number },
  );

  const traces = draws.lines.reduce(
    (acc, line) => {
      return [
        ...acc,
        Array.from({ length: line.points.length / 4 }, (_, i) => [
          {
            x: line.points[i * 4],
            y: line.points[i * 4 + 1],
          },
          {
            x: line.points[i * 4 + 2],
            y: line.points[i * 4 + 3],
          },
        ]).flat(),
      ];
    },
    [] as { x: number; y: number }[][],
  );

  return (
    <Stage
      className="overflow-hidden rounded-2xl bg-black"
      height={height}
      width={width}
    >
      <Layer>
        {draws.lines.map((line) => (
          <KonvaLine
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
        {traces.flatMap((trace, traceIndex) =>
          trace.map((point, pointIndex) => (
            <Trace
              from={trace[pointIndex - 1] ?? point}
              key={`${traceIndex}-${pointIndex}`}
              to={point}
            />
          )),
        )}
      </Layer>
    </Stage>
  );
};
