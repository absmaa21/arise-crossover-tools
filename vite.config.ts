import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {viteCommonjs} from "@originjs/vite-plugin-commonjs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteCommonjs()],
  server: {
    proxy: {
      '/api': {
        target: 'https://35bb-2a00-79c0-646-5500-1ceb-f4ba-d85f-5466.ngrok-free.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
      }
    }
  }
})
