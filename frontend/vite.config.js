import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/repos': 'http://localhost:8000',
      '/history': 'http://localhost:8000',
      '/get_history': 'http://localhost:8000',
    },
  },
})
