import { Config } from "router2/lib/types";

const scroll = new Map<string, number>();

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
      document.startViewTransition(next);
    },
    beforeReplace: ({ prev }, next) => {
      scroll.set(prev.pathname, window.scrollY);
      next();
    },
  },
};
