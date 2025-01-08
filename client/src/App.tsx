import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { BrowserRouter } from "router2";

import { messages as en } from "./locales/en/messages.ts";
import { messages as ko } from "./locales/ko/messages.ts";
import { Home } from "./ui/page/Home";
import { Like } from "./ui/page/Like";
import { MyPage } from "./ui/page/MyPage";
import { NotFound } from "./ui/page/NotFound.tsx";
import { Register } from "./ui/page/Register";
import { Search } from "./ui/page/Search";
import { Setting } from "./ui/page/Setting";
import { SignIn } from "./ui/page/SignIn";
import { ThridPartyRegister } from "./ui/page/ThirdPartyRegister";
import { User } from "./ui/page/User";
import { AuthProvider } from "./ui/provider/Auth.tsx";
import { MessageProvider } from "./ui/provider/Message.tsx";
import { NotificationProvider } from "./ui/provider/Notification.tsx";
import { PwaProvider } from "./ui/provider/PwaProvider.tsx";
import { StackedLayerProvider } from "./ui/provider/StackedLayerProvider.tsx";

dayjs.extend(duration);
i18n.load("en", en);
i18n.load("ko", ko);
i18n.activate("ko");

export const App = () => {
  return (
    <I18nProvider i18n={i18n}>
      <NotificationProvider>
        <StackedLayerProvider>
          <PwaProvider>
            {(prefetch) => (
              <AuthProvider myInfo={prefetch.myInfo}>
                <BrowserRouter
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
                    <MessageProvider>
                      <StackedLayerProvider>
                        <Page />
                      </StackedLayerProvider>
                    </MessageProvider>
                  )}
                </BrowserRouter>
              </AuthProvider>
            )}
          </PwaProvider>
        </StackedLayerProvider>
      </NotificationProvider>
    </I18nProvider>
  );
};
