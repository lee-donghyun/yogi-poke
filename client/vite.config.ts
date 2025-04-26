import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, Plugin } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const cwd = process.cwd();
  const env = loadEnv(mode, cwd, "");
  const isProduction = mode === "production" && !env.TEST;
  return {
    plugins: [
      tailwindcss(),
      react({
        babel: {
          plugins: [
            ...(isProduction ? ["babel-plugin-jsx-remove-data-test-id"] : []),
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
        disable: !isProduction,
      }),
      ...(isProduction ? [analyticsPlugin()] : []),
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

function analyticsPlugin(): Plugin {
  return {
    name: "analytics",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            injectTo: "head",
            attrs: {
              async: true,
              src: "https://www.googletagmanager.com/gtag/js?id=G-8VSE8DHPZH",
            },
          },
          {
            tag: "script",
            injectTo: "body",
            attrs: {
              src: "/script/ga.js",
            },
          },
          {
            tag: "script",
            injectTo: "body",
            attrs: {
              src: "https://js.sentry-cdn.com/37e4abc51989cf0249d52d49685e20ae.min.js",
              crossorigin: "anonymous",
            },
          },
        ],
      };
    },
  };
}
