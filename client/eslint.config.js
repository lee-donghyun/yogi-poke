import { createConfig } from "eslint-config-react-app-essentials";

export default createConfig({
  scope: ["src/**/*.{ts,tsx}"],
  tsConfigPath: "./tsconfig.json",
});
