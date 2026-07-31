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
      // Contrato consumido por mfe-entryexit: import('shell/AuthProvider') solo para
      // leer getAuthToken/getToken (funciones puras) en el interceptor de axios.
      // El componente AuthProvider NO debe renderizarse fuera del shell — compartir un
      // componente con hooks a través de @originjs/vite-plugin-federation en esta
      // topología bidireccional rompe el singleton de React (verificado: "Cannot read
      // properties of null (reading 'useState')" en ambas direcciones, con Vite alineado
      // y con eager:true en shared; se descartó como bug de config).
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
    // GW-07 cerró los puertos directos de los microservicios (8080-8084) en
    // docker-compose.demo.yml — solo Kong (8000) queda expuesto. Todo pasa por
    // Kong bajo /api/v1/*, con el JWT real (verificado con curl real: 200 vía
    // Kong, 502 apuntando a los puertos viejos ya cerrados).
    proxy: {
      '/v1/events': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, '/api/v1'),
      },
      '/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, '/api/v1'),
      },
    },
  },
})
