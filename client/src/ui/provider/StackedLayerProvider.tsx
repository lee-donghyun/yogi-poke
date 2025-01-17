import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
} from "body-scroll-lock-upgrade";
import { createContext, JSX, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type Layer<Context = never> = (props: {
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
  const push: Push = (Component: Parameters<Push>[0], context?: unknown) => {
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
  };
  const pop = () => {
    setShow(false);
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
  };

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
