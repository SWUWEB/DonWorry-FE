import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL

  // 개발 서버는 프록시로 동작해 이 값이 없어도 굴러가지만, 프로덕션 번들은 이 값이 그대로
  // baseURL이 됩니다. 비어 있으면 배포된 뒤에야 모든 요청이 깨지므로 빌드 단계에서 막습니다.
  if (command === 'build' && !apiBaseUrl) {
    throw new Error(
      'VITE_API_BASE_URL이 설정되지 않았습니다. .env.example을 참고해 환경 변수를 지정한 뒤 다시 빌드해주세요.',
    )
  }

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
