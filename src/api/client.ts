import axios, { isAxiosError, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  saveAuthSession,
  clearAuthSession,
} from '@/shared/auth/session'

const REFRESH_URL = '/api/v1/auth/refresh'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// 401을 받은 요청들이 동시에 재발급을 여러 번 트리거하지 않도록 하나의 진행 중인 요청을 공유합니다.
let refreshPromise: Promise<void> | null = null

const refreshAccessToken = async (): Promise<void> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('저장된 refresh token이 없습니다.')

  const { data } = await client.post<{ data: { accessToken: string; refreshToken: string } }>(
    REFRESH_URL,
    { refreshToken },
  )
  saveAuthSession(data.data)
}

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined

    const shouldTryRefresh =
      error.response?.status === 401 &&
      originalRequest !== undefined &&
      originalRequest.url !== REFRESH_URL &&
      !originalRequest._retry &&
      getRefreshToken() !== null

    if (!shouldTryRefresh) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      await refreshPromise
      return client(originalRequest)
    } catch (refreshError) {
      // refresh token 자체가 만료/무효하다고 서버가 401로 확인해준 경우에만 세션을 정리합니다.
      // 네트워크 오류·타임아웃·5xx 같은 일시적 실패까지 세션을 지우면, refresh token은
      // 아직 유효한데 재발급 시도가 잠깐 실패했다는 이유로 사용자가 강제 로그아웃됩니다.
      if (isAxiosError(refreshError) && refreshError.response?.status === 401) {
        clearAuthSession()
      }
      return Promise.reject(error)
    }
  },
)

export default client
