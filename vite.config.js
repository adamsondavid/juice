import { defineConfig } from "vite";
import path from "path";
import { juice } from "./src/juice";

export default defineConfig({
  plugins: [juice()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
