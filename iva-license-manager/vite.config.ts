import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
        background: "src/background/service-worker.ts",
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") {
            return "background.js";
          }

          return "assets/[name].js";
        },
      },
    },
  },
});
