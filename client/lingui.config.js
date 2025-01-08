import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "ko",
  locales: ["ko", "en"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
});
