import axios from 'axios'
import { getAccessToken } from '@/shared/auth/session'

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

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 처리 등 공통 에러 핸들링
    return Promise.reject(error)
  },
)

export default client
