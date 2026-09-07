import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

const MAX_RETRY_COUNT = 3

// 4xx는 같은 요청을 다시 보내도 같은 응답이 옵니다. 특히 401은 client.ts의 인터셉터가
// 이미 토큰 재발급을 한 번 시도한 뒤이므로, 여기서 또 재시도하면 만료된 세션으로
// 실패 요청만 늘어나고 에러 화면이 뜨는 시점만 늦어집니다.
export function shouldRetryRequest(failureCount: number, error: unknown): boolean {
  if (isAxiosError(error)) {
    const status = error.response?.status
    if (status !== undefined && status >= 400 && status < 500) return false
  }

  return failureCount < MAX_RETRY_COUNT
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: shouldRetryRequest,
      },
    },
  })
}
