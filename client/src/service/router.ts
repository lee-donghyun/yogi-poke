import { Config, RouterProps } from "router2/lib/types";

import { Home } from "~/ui/page/Home";
import { Like } from "~/ui/page/Like";
import { MyPage } from "~/ui/page/MyPage";
import { NotFound } from "~/ui/page/NotFound";
import { Register } from "~/ui/page/Register";
import { Search } from "~/ui/page/Search";
import { Setting } from "~/ui/page/Setting";
import { SignIn } from "~/ui/page/SignIn";
import { ThridPartyRegister } from "~/ui/page/ThirdPartyRegister";
import { User } from "~/ui/page/User";

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

export const routes: RouterProps["routes"] = {
  "/": Home,
  "/404": NotFound,
  "/like": Like,
  "/my-page": MyPage,
  "/register": Register,
  "/search": Search,
  "/setting": Setting,
  "/sign-in": SignIn,
  "/third-party-register": ThridPartyRegister,
  "/user/:userId": User,
};
