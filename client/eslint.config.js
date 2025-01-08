import { createConfig } from "eslint-config-react-app-essentials";
import reactCompiler from "eslint-plugin-react-compiler";
import pluginLingui from "eslint-plugin-lingui";

export default [
  ...createConfig({
    scope: ["src/**/*.{ts,tsx}"],
    tsConfigPath: "./tsconfig.json",
  }),
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
  pluginLingui.configs["flat/recommended"],
];
