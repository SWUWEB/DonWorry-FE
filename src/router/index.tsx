import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import RecordMainPage from '@/features/record/pages/RecordMainPage'
import RecordDetailPage from '@/features/record/pages/RecordDetailPage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },

  // TODO: 랜딩, 로그인, 유혹관리, 마이페이지 라우트 추가
  { path: '/record', element: <RecordMainPage /> },
  { path: '/record/:id', element: <RecordDetailPage /> },
])

export default router
