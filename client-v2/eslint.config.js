import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import solid from "eslint-plugin-solid";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
  perfectionist.configs["recommended-natural"],
  solid.configs["flat/typescript"],
  ...ts.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: "tsconfig.app.json",
      },
    },
  },
];
