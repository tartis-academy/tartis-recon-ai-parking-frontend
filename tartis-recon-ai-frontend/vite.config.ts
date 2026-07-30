import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // @ts-expect-error - tipos de @originjs/vite-plugin-federation no exponen firma callable
    federation({
      name: 'shell',
      filename: 'remoteEntry.js',
      // FSH-02 pendiente: mfe_entryexit/mfe_admin ya existen como repos con
      // scaffolding inicial, pero solo mfe_entryexit expone su remoteEntry.js
      // (rama feature/mfee-02-axios-interceptor, sin mergear). Puertos fijados
      // por convención ya en uso en esos repos (5001/5002).
      remotes: {
        mfe_entryexit: 'http://localhost:5001/assets/remoteEntry.js',
        mfe_admin: 'http://localhost:5002/assets/remoteEntry.js',
      },
      // Contrato ya consumido por mfe-entryexit (feature/mfee-02-axios-interceptor):
      // import('shell/AuthProvider') espera AuthProvider, getAuthToken, getToken y default.
      exposes: {
        './AuthProvider': './src/app/AuthProvider.tsx',
        './keycloak': './src/lib/keycloak.ts',
      },
      shared: {
        react: { singleton: true, requiredVersion: '18.3.1' },
        'react-dom': { singleton: true, requiredVersion: '18.3.1' },
        '@tanstack/react-query': { singleton: true, requiredVersion: '5.101.2' },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@lib': path.resolve(__dirname, 'src/lib'),
    },
  },
  build: {
    // Requerido por @originjs/vite-plugin-federation: sin esto el remoteEntry
    // generado en build no es consumible por los remotos (mismo ajuste que
    // mfe-entryexit/mfe-admin ya usan).
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5000,
    strictPort: true,
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
