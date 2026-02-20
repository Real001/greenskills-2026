import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    svgr({ include: "*.svg" }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  }
});
