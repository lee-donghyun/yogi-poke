import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const cwd = process.cwd();
  const env = loadEnv(mode, cwd, "");
  return {
    plugins: [
      tailwindcss(),
      react({
        babel: {
          plugins: [
            "@lingui/babel-plugin-lingui-macro",
            "babel-plugin-react-compiler",
          ],
        },
      }),
      lingui(),
      sentryVitePlugin({
        org: "yogi-company",
        project: "yogi-poke-web",
        sourcemaps: {
          filesToDeleteAfterUpload: `${cwd}/dist/assets/*.js.map`,
        },
        authToken: env.SENTRY_AUTH_TOKEN,
        disable: env.MODE === "local",
      }),
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
    resolve: {
      alias: {
        "~": `${cwd}/src`,
      },
    },
    build: {
      sourcemap: true,
    },
  };
});
