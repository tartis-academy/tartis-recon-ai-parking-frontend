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
      '@features': path.resolve(__dirname, 'src/features'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@testing': path.resolve(__dirname, 'src/testing'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
})
