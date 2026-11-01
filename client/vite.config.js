import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.API_PROXY_TARGET || "http://localhost:8003";
  // The API redirects back to APP_URL after the GitHub login, so serve on that port
  const rootEnv = loadEnv(mode, "..", "");
  const port = Number(new URL(rootEnv.APP_URL || "http://localhost:3000").port) || 3000;

  return {
    plugins: [react()],
    server: {
      port,
      strictPort: true,
      // In development the API is reached through this proxy, so no CORS setup is needed
      proxy: {
        "/github": apiUrl,
        "/tags": apiUrl,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Bootstrap 4 uses Sass features that are deprecated in Dart Sass
          quietDeps: true,
          silenceDeprecations: ["import", "global-builtin", "color-functions", "if-function"],
        },
      },
    },
  };
});
