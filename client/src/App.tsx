import { Route, Router } from "wouter";
import { Register } from "./page/Register";

export const App = () => {
  return (
    <Router>
      <Route component={Register} path="/" />
    </Router>
  );
};
