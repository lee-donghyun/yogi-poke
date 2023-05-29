import { Route, Router } from "wouter";
import { Register } from "./page/Register";
import { SignIn } from "./page/SignIn";
import { NotificationProvider } from "./component/notification";
import { Home } from "./page/Home";

export const App = () => {
  return (
    <NotificationProvider>
      <Router>
        <Route component={Home} path="/" />
        <Route component={Register} path="/register" />
        <Route component={SignIn} path="/sign-in" />
      </Router>
    </NotificationProvider>
  );
};
