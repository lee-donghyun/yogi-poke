import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock-upgrade";
import {
  JSX,
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type Layer = (props: { close: () => void }) => JSX.Element;
const stackedLayerContext = createContext<(layer: Layer) => void>(() => {
  throw new Error(
    "useStackedLayer hook must be called in StackedLayerProvider context"
  );
});
const isLayer = (layer: Layer | null): layer is Layer => layer !== null;

export const useStackedLayer = () => useContext(stackedLayerContext);

export const StackedLayerProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [show, setShow] = useState(false);
  const [Layer, setLayer] = useState<Layer | null>(null);
  const childrenContainerRef = useRef<HTMLDivElement>(null);
  const push = useCallback((Component: Layer) => {
    setLayer(() => Component);
    setShow(true);
    if (childrenContainerRef.current) {
      disableBodyScroll(childrenContainerRef.current);
    }
  }, []);
  const pop = useCallback(() => {
    setShow(false);
    setTimeout(() => {
      setShow((show) => {
        if (!show) {
          setLayer(null);
          if (childrenContainerRef.current) {
            enableBodyScroll(childrenContainerRef.current);
          }
          return false;
        }
        return true;
      });
    }, 500);
  }, []);

  return (
    <stackedLayerContext.Provider value={push}>
      <div ref={childrenContainerRef} className="w-screen">
        {isLayer(Layer) && (
          <div
            onClick={pop}
            className={`fixed inset-0 z-40 rounded-xl bg-black ${
              show ? "stacked-backdrop-from" : "stacked-backdrop-to"
            }`}
          />
        )}
        {children}
      </div>
      {isLayer(Layer) &&
        createPortal(
          <div
            className={`fixed inset-0 top-auto z-40 ${
              show ? "stacked-layer-from" : "stacked-layer-to"
            }`}
          >
            <Layer close={pop} />
          </div>,
          document.body
        )}
    </stackedLayerContext.Provider>
  );
};

export const createDraggableSheet = (Layer: Layer) => {
  if (import.meta.env.DEV) {
    console.warn("DraggableSheet is created. This must be created once.");
  }
  const DraggableSheet = ({ close }: { close: () => void }) => {
    const startPointRef = useRef({ x: 0, y: 0 });
    const [translate, setTranslate] = useState<null | { x: number; y: number }>(
      null
    );
    const deferredTranslate = useDeferredValue(translate);

    return (
      <div className="p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div
          className="rounded-xl bg-white"
          style={
            deferredTranslate
              ? {
                  transform: `translate(${deferredTranslate.x}px,${
                    deferredTranslate.y
                  }px) scale(${Math.min(
                    1,
                    (startPointRef.current.y + deferredTranslate.y) /
                      startPointRef.current.y
                  )})`,
                }
              : { transition: "all 150ms" }
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
              const { x, y } = startPointRef.current;
              const diffY = clientY - y;
              const diffX = clientX - x;
              setTranslate({
                x:
                  diffX > 0
                    ? Math.sqrt(clientX - x)
                    : -Math.sqrt(-(clientX - x)),
                y: diffY > 0 ? diffY : -Math.sqrt(-diffY),
              });
            }}
            onTouchStart={(e) => {
              const { clientX: x, clientY: y } = e.touches.item(0);
              startPointRef.current = { x, y };
            }}
          >
            <div className="h-2 w-12 rounded-full bg-zinc-500"></div>
          </div>
          <div>
            <Layer close={close} />
          </div>
        </div>
      </div>
    );
  };
  return DraggableSheet;
};
