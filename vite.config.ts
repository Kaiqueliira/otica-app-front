// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
    },
  },
  build: {
    target: "esnext",
    outDir: "dist",
    sourcemap: true,
  },
  // Configurações para Node.js mais antigo
  optimizeDeps: {
    force: true,
  },
  // Evitar problemas com crypto.hash
  define: {
    global: "globalThis",
  },
});
