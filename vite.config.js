import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],

  base: "/",   // ✅ Important for Vercel deployment

  server: {
    port: 5173,     // optional (default)
    open: true      // optional
  },

  build: {
    outDir: "dist", // default but good to be explicit
  }
});
