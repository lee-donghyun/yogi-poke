import { createContext, JSX, use, useState } from "react";

export type Layer<Context = never> = (props: {
  close: () => void;
  context: Context;
  visible: boolean;
}) => JSX.Element;

interface Push {
  <T>(Component: Layer<T>, context: T): void;
  (Component: Layer<never>): void;
}

const StackedLayerContext = createContext<Push>(() => {
  throw new Error(
    "useStackedLayer hook-domain must be called in StackedLayerProvider context",
  );
});
const isLayer = (layer: Layer | null): layer is Layer => layer !== null;

export const useStackedLayer = () => use(StackedLayerContext);

export const StackedLayerProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [show, setShow] = useState(false);
  const [Layer, setLayer] = useState<Layer | null>(null);
  const [context, setContext] = useState<never>(null as never);
  const push: Push = (Component: Parameters<Push>[0], context?: unknown) => {
    setLayer(() => Component);
    setShow(true);
    setContext(context as never);
  };
  const pop = () => {
    setShow(false);
    setTimeout(() => {
      setShow((show) => {
        if (!show) {
          setLayer(null);
          return false;
        }
        return true;
      });
    }, 500);
  };

  return (
    <StackedLayerContext.Provider value={push}>
      {children}
      {isLayer(Layer) && <Layer close={pop} context={context} visible={show} />}
    </StackedLayerContext.Provider>
  );
};

export const createLayer = (Layer: Layer): Layer<never> => Layer;
