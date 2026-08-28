import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Frontend is a static SPA built with Vite + React, deployed to Cloudflare
// Pages. All dynamic/API logic lives in the separate Cloudflare Worker
// (apps/api) — this app never talks to D1/R2 directly.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
