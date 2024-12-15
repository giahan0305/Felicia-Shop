import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@services": "/src/services",
      "@contexts": "/src/context",
    },
  },
  server: {
    host: "0.0.0.0",
    port: 80, 
  },
});