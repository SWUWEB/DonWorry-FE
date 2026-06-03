import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  // TODO: 랜딩, 로그인, 소비기록, 유혹관리, 마이페이지 라우트 추가
])

export default router
