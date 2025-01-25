import { Config } from "router2/lib/types";

const scroll = new Map<string, number>();

const transitionClasses = [
  "[&::view-transition-old(root)]:animate-move-out",
  "[&::view-transition-new(root)]:animate-move-in",
];

export const config: Config = {
  on: {
    afterBack: ({ current }) => {
      window.scrollTo({ top: scroll.get(current.pathname) ?? 0 });
    },
    afterForward: () => {
      window.scrollTo({ top: 0 });
    },
    afterPush: () => {
      window.scrollTo({ top: 0 });
    },
    afterReplace: ({ current }) => {
      window.scrollTo({ top: scroll.get(current.pathname) ?? 0 });
    },
    beforeBack: ({ prev }, next) => {
      scroll.set(prev.pathname, window.scrollY);
      next();
    },
    beforePush: ({ prev }, next) => {
      scroll.set(prev.pathname, window.scrollY);
      if (!document.startViewTransition) {
        next();
        return;
      }
      document.documentElement.classList.add(...transitionClasses);
      const transtition = document.startViewTransition(next);
      void transtition.finished.then(() => {
        document.documentElement.classList.remove(...transitionClasses);
      });
    },
    beforeReplace: ({ prev }, next) => {
      scroll.set(prev.pathname, window.scrollY);
      next();
    },
  },
};
