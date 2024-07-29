import js from "@eslint/js";
import React from "eslint-plugin-react";
import solid from "eslint-plugin-solid";
import ts from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";

const scope = (config) => ({
  ...config,
  files: ["src/**/*.{ts,tsx}"],
});

export default [
  js.configs.recommended,
  perfectionist.configs["recommended-natural"],
  {
    name: "jsx rules from eslint-plugin-react",
    plugins: { react: React },
    rules: {
      "react/jsx-curly-brace-presence": ["warn", "never"],
    },
  },
  solid.configs["flat/typescript"],
  ...[ts.configs.recommendedTypeChecked, ts.configs.stylisticTypeChecked]
    .flat()
    .map((config) => ({
      ...config,
      languageOptions: {
        parser: ts.parser,
        parserOptions: {
          project: "tsconfig.app.json",
        },
      },
    })),
].map(scope);
