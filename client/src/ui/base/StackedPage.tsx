import { ReactNode } from "react";

import { Backdrop } from "~/ui/base/Backdrop";
import { Layer } from "~/ui/provider/StackedLayerProvider";

const StackedPage = ({
  children,
  close,
  visible,
}: {
  children: ReactNode;
} & Omit<Parameters<Layer>[0], "context">) => {
  return (
    <Backdrop close={close} visible={visible}>
      <div
        className={`fixed inset-0 z-40 overflow-y-scroll ${
          visible ? "animate-stacked-layer-from" : "animate-stacked-layer-to"
        }`}
      >
        <div className="h-full bg-white">{children}</div>
      </div>
    </Backdrop>
  );
};

export const createStackedPage = (Content: Layer): Layer => {
  if (import.meta.env.DEV) {
    console.warn("StackedPage is created. This must be created once.");
  }

  const Component: Layer = ({ close, context, visible }) => (
    <StackedPage close={close} visible={visible}>
      <Content close={close} context={context} visible={visible} />
    </StackedPage>
  );
  return Component;
};
