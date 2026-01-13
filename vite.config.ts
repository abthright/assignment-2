// vite.config.ts
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  build: {
    target: "es2022",
    outDir: "dist",
    emptyOutDir: true,
    ssr: true,
    rollupOptions: {
      input: "src/index.ts", // change if your entry differs
      external: ["stream", "node:stream", "fs", "node:fs", "http", "node:http"],
    },
  },
});
