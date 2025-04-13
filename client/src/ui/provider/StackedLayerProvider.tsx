import { createContext, JSX, use, useState } from "react";

export type Layer<Context = unknown> = (props: {
  close: () => void;
  context: Context;
  descriptionId: string;
  titleId: string;
  visible: boolean;
}) => JSX.Element;

interface Overlay {
  <T>(Component: Layer<T>, context: T): void;
  (Component: Layer): void;
}

const StackedLayerContext = createContext<Overlay>(() => {
  throw new Error(
    "useStackedLayer hook-domain must be called in StackedLayerProvider context",
  );
});
const isLayer = (layer: Layer | null): layer is Layer => layer !== null;

export const useStackedLayer = () => use(StackedLayerContext);

export const StackedLayerProvider = ({
  children,
  unmountAfter,
}: {
  children: JSX.Element;
  unmountAfter: number;
}) => {
  const [visible, setVisible] = useState(false);
  const [context, setContext] = useState<unknown>(null);
  const [Layer, setLayer] = useState<Layer | null>(null);
  const [id, setId] = useState(0);

  const overlay: Overlay = (
    Component: Parameters<Overlay>[0],
    context?: unknown,
  ) => {
    setLayer(() => Component);
    setId((id) => id + 1);
    setVisible(true);
    setContext(context);
  };

  const close = () => {
    setVisible(false);
    setTimeout(() => {
      setVisible((show) => {
        // 딜레이 전에 다른 레이어가 추가되었을 경우, 레이어를 유지한다.
        if (!show) {
          setLayer(null);
        }
        return show;
      });
    }, unmountAfter);
  };

  return (
    <StackedLayerContext.Provider value={overlay}>
      {children}
      {isLayer(Layer) && (
        <Layer
          close={close}
          context={context}
          descriptionId={id + ":description"}
          titleId={id + ":title"}
          visible={visible}
        />
      )}
    </StackedLayerContext.Provider>
  );
};
