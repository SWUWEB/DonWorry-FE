import { isAxiosError } from 'axios'

interface ApiErrorBody {
  message?: string
  retryAfterSeconds?: number
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  return isAxiosError<ApiErrorBody>(error) ? error.response?.data?.message || fallback : fallback
}

export function getRetryAfterSeconds(error: unknown): number {
  if (!isAxiosError<ApiErrorBody>(error) || error.response?.status !== 429) return 0
  const seconds = Number(
    error.response.data?.retryAfterSeconds ?? error.response.headers?.['retry-after'],
  )
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : 60
}
