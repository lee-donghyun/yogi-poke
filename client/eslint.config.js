// @ts-check

import { defineConfig } from "eslint-config-react-app-essentials";
import reactCompiler from "eslint-plugin-react-compiler";
import pluginLingui from "eslint-plugin-lingui";
import PluginLingui2 from "@lee-donghyun/eslint-plugin-lingui";

export default defineConfig({
  tsconfigRootDir: "./tsconfig.json",
  scope: ["src/**/*.{ts,tsx}"],
  extends: [
    pluginLingui.configs["flat/recommended"],
    reactCompiler.configs.recommended,
    PluginLingui2.configs.recommended,
    {
      rules: {
        "@lee-donghyun/lingui/no-unlocalized-strings": [
          "error",
          {
            ignoreAttributes: ["className", "src", "data-testid"],
            ignore: ["^[a-zA-Z0-9\\s\\p{P}\\p{S}]*$"],
          },
        ],
      },
    },
  ],
});
