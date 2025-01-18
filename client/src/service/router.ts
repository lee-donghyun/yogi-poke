import { Config } from "router2/lib/types";

const scroll = new Map<string, number>();

export const config: Config = {
  on: {
    afterBack: ({ current }) => {
      window.scrollTo({ top: scroll.get(current.pathname) ?? 0 });
    },
    afterFoward: () => {
      window.scrollTo({ top: 0 });
    },
    afterPush: () => {
      window.scrollTo({ top: 0 });
    },
    afterReplace: ({ current }) => {
      window.scrollTo({ top: scroll.get(current.pathname) ?? 0 });
    },
    beforeBack: ({ prev }) => {
      scroll.set(prev.pathname, window.scrollY);
    },
    beforePush: ({ prev }) => {
      scroll.set(prev.pathname, window.scrollY);
    },
    beforeReplace: ({ prev }) => {
      scroll.set(prev.pathname, window.scrollY);
    },
  },
};
