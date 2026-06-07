import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/repos': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/history': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/get_history': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
    },
  },
})
