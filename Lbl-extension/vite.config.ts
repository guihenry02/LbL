import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: "public/manifest.json",
      // Página própria do Reader, aberta pelo usuário em uma nova aba.
      additionalInputs: ["src/reader/index.html"],
    }),
  ],
});
