// @ts-check

import { defineConfig } from "eslint-config-react-app-essentials";
import reactCompiler from "eslint-plugin-react-compiler";
import pluginLingui from "eslint-plugin-lingui";

export default defineConfig({
  tsconfigRootDir: "./tsconfig.json",
  scope: ["src/**/*.{ts,tsx}"],
  extends: [
    pluginLingui.configs["flat/recommended"],
    reactCompiler.configs.recommended,
    {
      rules: {
        "lingui/no-unlocalized-strings": [
          "error",
          {
            ignore: ["^[^가-힣]+$"],
          },
        ],
      },
    },
  ],
});
