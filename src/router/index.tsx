import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import RecordMainPage from '@/features/record/pages/RecordMainPage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },

  // TODO: 랜딩, 로그인, 소비기록, 유혹관리, 마이페이지 라우트 추가
  { path: '/record', element: <RecordMainPage/> },
])

export default router
