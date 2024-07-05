import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { BrowserRouter } from "router2";

import { AuthProvider } from "./component/Auth";
import { NotificationProvider } from "./component/Notification";
import { PwaProvider } from "./component/PwaProvider";
import { StackedLayerProvider } from "./component/StackedLayerProvider";
import { Home } from "./page/Home";
import { Like } from "./page/Like";
import { MyPage } from "./page/MyPage";
import { Register } from "./page/Register";
import { Search } from "./page/Search";
import { Setting } from "./page/Setting";
import { SignIn } from "./page/SignIn";
import { User } from "./page/User";

dayjs.extend(duration);

export const App = () => {
  return (
    <BrowserRouter
      routes={{
        "/": Home,
        "/register": Register,
        "/sign-in": SignIn,
        "/my-page": MyPage,
        "/search": Search,
        "/user/:userId": User,
        "/setting": Setting,
        "/like": Like,
        "/404": () => <>not found</>,
      }}
    >
      {(Page) => (
        <PwaProvider>
          {(prefetch) => (
            <AuthProvider myInfo={prefetch.myInfo}>
              <NotificationProvider>
                <StackedLayerProvider>
                  <Page />
                </StackedLayerProvider>
              </NotificationProvider>
            </AuthProvider>
          )}
        </PwaProvider>
      )}
    </BrowserRouter>
  );
};
