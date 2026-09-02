import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    outDir: "dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        popup: "index.html",
        background: "src/background/service-worker.ts",
        content: "src/content/ivac-content.ts",
      },

      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") {
            return "background.js";
          }

          if (chunk.name === "content") {
            return "content.js";
          }

          return "assets/[name].js";
        },
      },
    },
  },
});
