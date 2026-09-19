import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Jobi Local-First Web Application Vite Configuration
// Browser opens on http://localhost:3000 and proxies /api to Express backend on port 3001
export default defineConfig(() => ({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
}));
