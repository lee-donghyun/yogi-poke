import { Route, Router } from "wouter";
import { Register } from "./page/Register";
import { SignIn } from "./page/SignIn";
import { NotificationProvider } from "./component/Notification";
import { Home } from "./page/Home";
import { AuthProvider } from "./component/Auth";
import { MyPage } from "./page/MyPage";

export const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Route component={Home} path="/" />
          <Route component={Register} path="/register" />
          <Route component={SignIn} path="/sign-in" />
          <Route component={MyPage} path="/my-page" />
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
};
