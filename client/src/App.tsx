import { Route, Router } from "wouter";
import { Register } from "./page/Register";
import { SignIn } from "./page/SignIn";

export const App = () => {
  return (
    <Router>
      <Route component={Register} path="/register" />
      <Route component={SignIn} path="/sign-in" />
    </Router>
  );
};
