import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export const useViewTransition = ({ name }: { name: string }) => {
  const [state, setState] = useState<
    { expose: false } | { expose: true; updateDom: () => void }
  >({ expose: false });

  const startTransition = (updateDom: () => void) => {
    if (!document.startViewTransition) {
      updateDom();
    }
    if (!state.expose) {
      setState({ expose: true, updateDom });
    }
  };

  const style = (
    // eslint-disable-next-line lingui/no-unlocalized-strings
    <style>{`
    ::view-transition-group(${name}) {
      animation-duration: 400ms;
      animation-timing-function: ease;
    }
  `}</style>
  );

  useEffect(() => {
    if (state.expose) {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          state.updateDom();
        });
      });
      void transition.finished.then(() => {
        setState({ expose: false });
      });
    }
  }, [state]);

  return {
    startTransition,
    style: state.expose ? style : undefined,
    viewTransitionName: state.expose ? name : undefined,
  };
};
