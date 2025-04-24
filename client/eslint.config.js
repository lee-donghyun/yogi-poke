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
  {
    plugins: {
      lingui: pluginLingui,
    },
    rules: {
      "lingui/no-unlocalized-strings": [
        "error",
        {
          ignore: ["^(?![A-Z])\\S+$", "^[A-Z0-9_-]+$"],
          ignoreNames: [
            {
              regex: [
                { pattern: "className", flags: "i" },
                { pattern: "data-testid", flags: "i" },
              ],
            },
            "src",
            "type",
            "id",
            "width",
            "height",
            "displayName",
          ],
          ignoreFunctions: ["Error", "*.includes", "console.*"],
          useTsTypes: true,
          ignoreMethodsOnTypes: [],
        },
      ],
    },
  },
  pluginLingui.configs["flat/recommended"],
];
