import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const configuredApiUrl = env.VITE_API_URL?.trim()
  const devApiTarget =
    configuredApiUrl && !configuredApiUrl.includes('your-backend-url')
      ? configuredApiUrl.replace(/\/api\/?$/, '')
      : 'http://localhost:5000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: devApiTarget,
          changeOrigin: true,
        },
        '/socket.io': {
          target: devApiTarget,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  }
})
