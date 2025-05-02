/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { DateTime } from "luxon";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/wealth-tracker/",
  worker: {
    plugins: () => [tsconfigPaths()],
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }], "@emotion/babel-plugin"],
      },
    }),
    tsconfigPaths(),
    checker({
      typescript: true,
      eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"', useFlatConfig: true },
      overlay: { initialIsOpen: false },
    }),
  ],
  define: {
    BUILD_DATE: `"${DateTime.now().toFormat("yyyy LLL dd HH:mm")}"`,
  },
  build: {
    outDir: "./docs",
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (path) => path.split("/").reverse()[path.split("/").reverse().indexOf("node_modules") - 1],
      },
      onLog(level, log, handler) {
        if (log.cause && (log.cause as { message: string }).message === "Can't resolve original location of error.") {
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
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["./src/__tests__/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules/", "src/vite-env.d.ts", "src/**/*.d.ts"],
    },
  },
});
