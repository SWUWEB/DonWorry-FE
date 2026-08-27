import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
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
    } catch {
      // refresh token도 만료/무효인 경우: 세션을 정리하고 원래 401을 그대로 전달해
      // 각 화면의 기존 isUnauthorizedError 처리(로그인 화면 이동)가 동작하도록 합니다.
      clearAuthSession()
      return Promise.reject(error)
    }
  },
)

export default client
