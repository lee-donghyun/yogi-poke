import { Register } from "./page/Register";
import { SignIn } from "./page/SignIn";
import { NotificationProvider } from "./component/Notification";
import { Home } from "./page/Home";
import { AuthProvider } from "./component/Auth";
import { MyPage } from "./page/MyPage";
import { BrowserRouter } from "./lib/router2";
import { Search } from "./page/Search";
import { PwaProvider } from "./component/PwaProvider";

export const App = () => {
  return (
    <PwaProvider>
      {(prefetch) => (
        <NotificationProvider>
          <AuthProvider myInfo={prefetch.myInfo}>
            <BrowserRouter
              routes={{
                "/": Home,
                "/register": Register,
                "/sign-in": SignIn,
                "/my-page": MyPage,
                "/search": Search,
                "/404": () => <>not found</>,
              }}
            />
          </AuthProvider>
        </NotificationProvider>
      )}
    </PwaProvider>
  );
};
