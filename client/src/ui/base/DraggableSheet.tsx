import { CSSProperties, ReactNode, useState, useTransition } from "react";

import { run } from "~/lib/run";
import { Backdrop } from "~/ui/base/Backdrop";
import { Layer } from "~/ui/provider/StackedLayerProvider";

const DraggableSheet = ({
  children,
  close,
  visible,
}: {
  children: ReactNode;
} & Omit<Parameters<Layer>[0], "context">) => {
  const [, startTransition] = useTransition();
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState<{ x: number; y: number } | null>(
    null,
  );

  const paperStyle = run<CSSProperties>(() => {
    if (translate) {
      const scale = Math.min(1, (startPoint.y + translate.y) / startPoint.y);
      return {
        transform:
          `translate(${translate.x}px,${translate.y}px) ` + `scale(${scale})`,
      };
    }
    // eslint-disable-next-line lingui/no-unlocalized-strings
    return { transition: `all 300ms` };
  });

  const onHandleDragEnd = () => {
    if (translate && translate.y > 160) {
      setTranslate({ x: 0, y: translate.y });
      close();
    } else {
      setTranslate(null);
    }
  };

  const onHandleDrag = (e: React.TouchEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e.touches.item(0);
    const { x, y } = startPoint;
    const diffY = clientY - y;
    const diffX = clientX - x;
    startTransition(() => {
      setTranslate({
        x: diffX > 0 ? Math.sqrt(clientX - x) : -Math.sqrt(-(clientX - x)),
        y: diffY > 0 ? diffY : -Math.sqrt(-diffY) * 1.6,
      });
    });
  };

  const onHandleDragStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const { clientX: x, clientY: y } = e.touches.item(0);
    setStartPoint({ x, y });
  };

  return (
    <Backdrop close={close} visible={visible}>
      <div
        className={`fixed inset-0 top-auto z-40 ${
          visible ? "stacked-layer-from" : "stacked-layer-to"
        }`}
      >
        <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="rounded-3xl bg-white" style={paperStyle}>
            <div
              className="flex cursor-pointer justify-center p-3"
              onTouchEnd={onHandleDragEnd}
              onTouchMove={onHandleDrag}
              onTouchStart={onHandleDragStart}
            >
              <div className="h-1.5 w-12 rounded-full bg-zinc-200"></div>
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
};

export const createDraggableSheet = <Context,>(Content: Layer<Context>) => {
  if (import.meta.env.DEV) {
    console.warn("DraggableSheet is created. This must be created once.");
  }

  const Component: Layer<Context> = ({ close, context, visible }) => (
    <DraggableSheet close={close} visible={visible}>
      <Content close={close} context={context} visible={visible} />
    </DraggableSheet>
  );
  return Component;
};
