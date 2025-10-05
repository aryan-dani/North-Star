import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['.localhost', 'north-star.ramkansal.com'],
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    strictPort: false,
    cors: true, // Enable CORS for dev server
    hmr: {
      protocol: 'ws',
      host: 'localhost', // Use localhost for HMR in development
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // For production build
  base: '/',
})
