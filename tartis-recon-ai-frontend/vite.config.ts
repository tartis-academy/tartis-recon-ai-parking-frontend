import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@lib': path.resolve(__dirname, 'src/lib'),
    },
  },
  server: {
    // TODO: Las reglas de proxy locales para endpoints monolíticos (/v1/*)
    // serán reemplazadas por la integración de remotos MFE y Kong Gateway.
    proxy: {
      '/v1/vehicles': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/v1/spots': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/v1/tariffs': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/v1/tickets': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/v1/entry-tickets': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/v1/stays': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
      '/v1/events': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
    },
  },
})
