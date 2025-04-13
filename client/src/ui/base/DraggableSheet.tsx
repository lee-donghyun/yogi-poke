import { CSSProperties, ReactNode, useState, useTransition } from "react";

import { useDrag } from "~/hook/base/useDrag";
import { run } from "~/lib/run";
import { Backdrop } from "~/ui/base/Backdrop";
import { Layer } from "~/ui/provider/StackedLayerProvider";

const DraggableSheet = ({
  children,
  close,
  descriptionId,
  titleId,
  visible,
}: {
  children: ReactNode;
} & Omit<Parameters<Layer>[0], "context">) => {
  const [, startTransition] = useTransition();
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState<{ x: number; y: number } | null>(
    null,
  );

  const registerHandle = useDrag({
    onDrag: (e) => {
      const { clientX, clientY } = e;
      const { x, y } = startPoint;
      const diffY = clientY - y;
      const diffX = clientX - x;
      startTransition(() => {
        setTranslate({
          x: diffX > 0 ? Math.sqrt(clientX - x) : -Math.sqrt(-(clientX - x)),
          y: diffY > 0 ? diffY : -Math.sqrt(-diffY) * 1.6,
        });
      });
    },
    onEnd: () => {
      if (translate && translate.y > 160) {
        setTranslate({ x: 0, y: translate.y });
        close();
      } else {
        setTranslate(null);
      }
    },
    onStart: (e) => {
      const { clientX: x, clientY: y } = e;
      setStartPoint({ x, y });
    },
  });

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

  return (
    <Backdrop
      close={close}
      descriptionId={descriptionId}
      titleId={titleId}
      visible={visible}
    >
      <div
        className={`fixed inset-0 top-auto z-40 ${
          visible ? "animate-stacked-layer-from" : "animate-stacked-layer-to"
        }`}
      >
        <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="rounded-3xl bg-white" style={paperStyle}>
            <div
              className="flex cursor-pointer justify-center p-3"
              {...registerHandle}
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

  const Component: Layer<Context> = ({
    close,
    context,
    descriptionId,
    titleId,
    visible,
  }) => (
    <DraggableSheet
      close={close}
      descriptionId={descriptionId}
      titleId={titleId}
      visible={visible}
    >
      <Content
        close={close}
        context={context}
        descriptionId={descriptionId}
        titleId={titleId}
        visible={visible}
      />
    </DraggableSheet>
  );

  return Component;
};
