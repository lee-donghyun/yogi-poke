import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { lingui } from "@lingui/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            "babel-plugin-react-compiler",
            "@lingui/babel-plugin-lingui-macro",
          ],
        },
      }),
      sentryVitePlugin({
        org: "yogi-company",
        project: "yogi-poke-web",
        sourcemaps: {
          filesToDeleteAfterUpload: "dist/assets/*.js.map",
        },
        authToken: env.SENTRY_AUTH_TOKEN,
      }),
      lingui(),
    ],
    server: {
      proxy: {
        "^/api/.*": {
          target: "https://yogi-poke-api.is-not-a.store",
          // target: "http://localhost:8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      sourcemap: true,
    },
  };
});
