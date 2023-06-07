import { Register } from "./page/Register";
import { SignIn } from "./page/SignIn";
import { NotificationProvider } from "./component/Notification";
import { Home } from "./page/Home";
import { AuthProvider } from "./component/Auth";
import { MyPage } from "./page/MyPage";
import { BrowserRouter } from "./lib/router2";
import { Search } from "./page/Search";
import { PwaProvider } from "./component/PwaProvider";
import { User } from "./page/User";
import duration from "dayjs/plugin/duration";
import dayjs from "dayjs";
import { StackedLayerProvider } from "./component/StackedLayerProvider";

dayjs.extend(duration);

export const App = () => {
  return (
    <PwaProvider>
      {(prefetch) => (
        <NotificationProvider>
          <AuthProvider myInfo={prefetch.myInfo}>
            <StackedLayerProvider>
              <BrowserRouter
                routes={{
                  "/": Home,
                  "/register": Register,
                  "/sign-in": SignIn,
                  "/my-page": MyPage,
                  "/search": Search,
                  "/user/:userId": User,
                  "/404": () => <>not found</>,
                }}
              />
            </StackedLayerProvider>
          </AuthProvider>
        </NotificationProvider>
      )}
    </PwaProvider>
  );
};
