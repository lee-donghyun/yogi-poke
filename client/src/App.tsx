import { Route, Router } from "wouter";
import { Register } from "./page/Register";

export const App = () => {
  return (
    <Router>
      <Route path="/" component={Register} />
    </Router>
  );
};
