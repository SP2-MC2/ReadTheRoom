import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup/index.html"),
        contentScript: resolve(__dirname, "contentScript.js"),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
