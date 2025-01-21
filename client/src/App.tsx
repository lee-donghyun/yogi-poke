import { lazy, Suspense } from "react";
import { BrowserRouter } from "router2";

import { config } from "./service/router.ts";
import { BACKDROP_ANIMATION_DURATION } from "./ui/base/Backdrop.tsx";
import { Home } from "./ui/page/Home";
import { Like } from "./ui/page/Like";
import { MyPage } from "./ui/page/MyPage";
import { NotFound } from "./ui/page/NotFound.tsx";
import { Register } from "./ui/page/Register";
import { Search } from "./ui/page/Search";
import { Setting } from "./ui/page/Setting.tsx";
import { SignIn } from "./ui/page/SignIn";
import { ThridPartyRegister } from "./ui/page/ThirdPartyRegister";
import { User } from "./ui/page/User";
import { AuthProvider } from "./ui/provider/Auth.tsx";
import { I18nProvider } from "./ui/provider/I18nProvider.tsx";
import { MessageProvider } from "./ui/provider/Message.tsx";
import { NotificationProvider } from "./ui/provider/Notification.tsx";
import { PwaProvider } from "./ui/provider/PwaProvider.tsx";
import { StackedLayerProvider } from "./ui/provider/StackedLayerProvider.tsx";

const Introduction = lazy(() =>
  import("./ui/page/Introduction.tsx").then((mod) => ({
    default: mod.Introduction,
  })),
);

export const App = () => {
  return (
    <BrowserRouter
      config={config}
      routes={{
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
      }}
    >
      {(Page) => (
        <I18nProvider>
          <NotificationProvider>
            <PwaProvider
              fallback={
                <StackedLayerProvider
                  unmountAfter={BACKDROP_ANIMATION_DURATION}
                >
                  <Suspense>
                    <Introduction />
                  </Suspense>
                </StackedLayerProvider>
              }
            >
              {(prefetch) => (
                <AuthProvider myInfo={prefetch.myInfo}>
                  <MessageProvider>
                    <StackedLayerProvider
                      unmountAfter={BACKDROP_ANIMATION_DURATION}
                    >
                      <Page />
                    </StackedLayerProvider>
                  </MessageProvider>
                </AuthProvider>
              )}
            </PwaProvider>
          </NotificationProvider>
        </I18nProvider>
      )}
    </BrowserRouter>
  );
};
