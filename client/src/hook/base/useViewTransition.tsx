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
    @view-transition {
      name: ${name};
      animation-duration: 500ms;
      animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
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
