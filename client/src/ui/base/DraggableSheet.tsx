import { ReactNode, useDeferredValue, useState } from "react";

import { Layer } from "../provider/StackedLayerProvider";

const DraggableSheet = ({
  children,
  close,
}: {
  children: ReactNode;
  close: Parameters<Layer>[0]["close"];
}) => {
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState<{ x: number; y: number } | null>(
    null,
  );
  const deferredTranslate = useDeferredValue(translate);

  return (
    <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div
        className="rounded-3xl bg-white"
        style={
          deferredTranslate
            ? {
                transform: `translate(${deferredTranslate.x}px,${
                  deferredTranslate.y
                }px) scale(${Math.min(
                  1,
                  (startPoint.y + deferredTranslate.y) / startPoint.y,
                )})`,
              }
            : { transition: "all 300ms" }
        }
      >
        <div
          className="flex cursor-pointer justify-center p-3"
          onTouchEnd={() => {
            if (translate && translate.y > 160) {
              setTranslate({ x: 0, y: translate.y });
              close();
            } else {
              setTranslate(null);
            }
          }}
          onTouchMove={(e) => {
            const { clientX, clientY } = e.touches.item(0);
            const { x, y } = startPoint;
            const diffY = clientY - y;
            const diffX = clientX - x;
            setTranslate({
              x:
                diffX > 0 ? Math.sqrt(clientX - x) : -Math.sqrt(-(clientX - x)),
              y: diffY > 0 ? diffY : -Math.sqrt(-diffY) * 1.6,
            });
          }}
          onTouchStart={(e) => {
            const { clientX: x, clientY: y } = e.touches.item(0);
            setStartPoint({ x, y });
          }}
        >
          <div className="h-1.5 w-12 rounded-full bg-zinc-200"></div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

/**
 * 내부에서 스크롤을 하려면, data-allow-touch-move-on-stacked-layer 속성을 추가합니다.
 * TOUCH_MOVE_DEPTH 단계까지 부모 요소를 탐색하여 해당 속성이 있는지 확인합니다.
 * @example
 * <div data-allow-touch-move-on-stacked-layer>
 *  {스크롤 가능}
 * </div>
 */
export const createDraggableSheet = <Context extends object = never>(
  Layer: Layer<Context>,
) => {
  if (import.meta.env.DEV) {
    console.warn("DraggableSheet is created. This must be created once.");
  }

  const Component: Layer<Context> = ({ close, context }) => (
    <DraggableSheet close={close}>
      <Layer close={close} context={context} />
    </DraggableSheet>
  );
  return Component;
};
