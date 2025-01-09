import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "ko",
  locales: ["ko", "en", "ja", "zh"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  compileNamespace: "json",
});
