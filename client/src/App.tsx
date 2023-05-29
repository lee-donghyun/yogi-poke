import { Register } from "./page/Register";
import { SignIn } from "./page/SignIn";
import { NotificationProvider } from "./component/Notification";
import { Home } from "./page/Home";
import { AuthProvider } from "./component/Auth";
import { MyPage } from "./page/MyPage";
import { BrowserRouter } from "./lib/router2";

export const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BrowserRouter
          routes={{
            "/": Home,
            "/register": Register,
            "/sign-in": SignIn,
            "/my-page": MyPage,
            "/404": () => <>not found</>,
          }}
        />
      </AuthProvider>
    </NotificationProvider>
  );
};
