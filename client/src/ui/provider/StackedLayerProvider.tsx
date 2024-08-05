import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
} from "body-scroll-lock-upgrade";
import {
  createContext,
  JSX,
  useCallback,
  useContext,
  useDeferredValue,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type Layer<Context = never> = (props: {
  close: () => void;
  context: Context;
}) => JSX.Element;

interface Push {
  <T>(Component: Layer<T>, context: T): void;
  (Component: Layer<never>): void;
}

const TOUCH_MOVE_ALLOW_ATTRIBUTE = "allow-touch-move-on-stacked-layer";
const TOUCH_MOVE_DEPTH = 3;

const stackedLayerContext = createContext<Push>(() => {
  throw new Error(
    "useStackedLayer hook-domain must be called in StackedLayerProvider context",
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
  const [context, setContext] = useState<never>(null as never);
  const childrenContainerRef = useRef<HTMLDivElement>(null);
  const push = useCallback((Component, context) => {
    setLayer(() => Component);
    setShow(true);
    setContext(context as never);
    if (childrenContainerRef.current) {
      disableBodyScroll(childrenContainerRef.current, {
        allowTouchMove: (el) => {
          let depth = 0;
          let target = el as HTMLElement | null;
          while (target && depth < TOUCH_MOVE_DEPTH) {
            if (target.dataset[TOUCH_MOVE_ALLOW_ATTRIBUTE]) {
              return true;
            }
            target = target.parentElement;
            depth++;
          }
          return false;
        },
      });
    }
  }, []) as Push;
  const pop = useCallback(() => {
    setShow(false);
    setContext(null as never);
    setTimeout(() => {
      setShow((show) => {
        if (!show) {
          setLayer(null);
          if (childrenContainerRef.current) {
            clearAllBodyScrollLocks();
          }
          return false;
        }
        return true;
      });
    }, 500);
  }, []);

  return (
    <stackedLayerContext.Provider value={push}>
      <div className="w-screen" ref={childrenContainerRef}>
        {isLayer(Layer) && (
          // show accessible backdrop
          <button
            className={`fixed inset-0 z-40 rounded-t-3xl bg-black ${
              show ? "stacked-backdrop-from" : "stacked-backdrop-to"
            }`}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                pop();
              }
            }}
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
            <Layer close={pop} context={context} />
          </div>,
          document.body,
        )}
    </stackedLayerContext.Provider>
  );
};

export const createLayer = (Layer: Layer): Layer<never> => Layer;

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
  // react-essentials 패키지에서 해당 rule 개선 필요
  // eslint-disable-next-line react/prop-types
  const DraggableSheet: Layer<Context> = ({ close, context }) => {
    const startPointRef = useRef({ x: 0, y: 0 });
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
                    (startPointRef.current.y + deferredTranslate.y) /
                      startPointRef.current.y,
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
              const { x, y } = startPointRef.current;
              const diffY = clientY - y;
              const diffX = clientX - x;
              setTranslate({
                x:
                  diffX > 0
                    ? Math.sqrt(clientX - x)
                    : -Math.sqrt(-(clientX - x)),
                y: diffY > 0 ? diffY : -Math.sqrt(-diffY) * 1.6,
              });
            }}
            onTouchStart={(e) => {
              const { clientX: x, clientY: y } = e.touches.item(0);
              startPointRef.current = { x, y };
            }}
          >
            <div className="h-1.5 w-12 rounded-full bg-zinc-200"></div>
          </div>
          <div>
            <Layer close={close} context={context} />
          </div>
        </div>
      </div>
    );
  };
  return DraggableSheet;
};
