import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { BrowserRouter } from "router2";

import { Home } from "./ui/page/Home";
import { Like } from "./ui/page/Like";
import { MyPage } from "./ui/page/MyPage";
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

export const App = () => {
  return (
    <NotificationProvider>
      <StackedLayerProvider>
        <PwaProvider>
          {(prefetch) => (
            <AuthProvider myInfo={prefetch.myInfo}>
              <BrowserRouter
                routes={{
                  "/": Home,
                  "/404": () => <>not found</>,
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
  );
};
