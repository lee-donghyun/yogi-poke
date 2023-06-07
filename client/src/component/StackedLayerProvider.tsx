import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import {
  JSX,
  createContext,
  useCallback,
  useContext,
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
            className={`pointer-events-none fixed inset-0 z-40 rounded-xl duration-500 ${
              show ? "bg-black bg-opacity-10" : ""
            }`}
          />
        )}
        {children}
      </div>
      {isLayer(Layer) &&
        createPortal(
          <div
            className={`fixed inset-0 z-40 bg-white ${
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
