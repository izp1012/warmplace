import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const isProduction = mode === 'production'
  const apiUrl = isProduction ? env.VITE_API_URL_PROD : env.VITE_API_URL_DEV

  return {
    plugins: [react()],
    define: {
      global: 'globalThis',
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8081',
          changeOrigin: true,
        },
        '/ws': {
          target: 'http://localhost:8081',
          ws: true,
        },
      },
    },
    build: {
      envPrefix: 'VITE_',
    },
  }
})
