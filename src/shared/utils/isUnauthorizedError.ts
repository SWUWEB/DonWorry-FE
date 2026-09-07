import { isAxiosError } from 'axios'

export const isUnauthorizedError = (error: unknown): boolean => {
  return isAxiosError(error) && error.response?.status === 401
}
