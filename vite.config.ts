import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";

export default defineConfig({
  base: "/wealth-tracker/",
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    tsconfigPaths(),
    checker({
      typescript: true,
      eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"' },
      overlay: { initialIsOpen: false },
    }),
  ],
  build: {
    outDir: "./docs",
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (path) =>
          path.split("/").reverse()[
            path.split("/").reverse().indexOf("node_modules") - 1
          ],
      },
      onLog(level, log, handler) {
        if (
          log.cause &&
          (log.cause as { message: string }).message ===
            "Can't resolve original location of error."
        ) {
          return;
        }
        handler(level, log);
      },
    },
  },
  esbuild: {
    minifyIdentifiers: false,
    keepNames: true,
  },
});
