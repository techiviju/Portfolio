import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    port: 5173, // Default Vite port
    proxy: {
      // 1. Match any request starting with '/api'
      '/api': {
        // 2. Forward it to the Backend running in STS
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})