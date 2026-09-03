import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // 로컬 브라우저는 백엔드 CORS 허용 origin에 포함되지 않으므로, 개발 서버가 API를 대신 전달합니다.
    server: apiBaseUrl
      ? {
          proxy: {
            '/api': {
              target: apiBaseUrl,
              changeOrigin: true,
            },
          },
        }
      : undefined,
  }
})
