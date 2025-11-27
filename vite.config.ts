import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      components: path.resolve(__dirname, "./src/components"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      pages: path.resolve(__dirname, "./src/pages"),
      providers: path.resolve(__dirname, "./src/providers"),
      types: path.resolve(__dirname, "./src/types"),
    },
  },
  plugins: [react(), basicSsl(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": "http://localhost:8000",
      "/scenes": "http://localhost:8000",
      "/frames": "http://localhost:8000",
      "/poses": "http://localhost:8000",
    },
  },
});
