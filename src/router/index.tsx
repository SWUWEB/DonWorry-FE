import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import NotificationPage from '@/pages/NotificationPage'
import RecordMainPage from '@/features/record/pages/RecordMainPage'
import RecordDetailPage from '@/features/record/pages/RecordDetailPage'
import RecordInterventionPage from '@/features/intervention/pages/RecordInterventionPage'
import LoginPage from '@/pages/LoginPage'
import SignUpPage from '@/pages/SignUpPage'
import MyPagePage from '@/pages/MyPagePage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/mypage', element: <MyPagePage /> },
  { path: '/notification', element: <NotificationPage /> },

  // TODO: 랜딩, 로그인, 유혹관리, 마이페이지 라우트 추가
  { path: '/record', element: <RecordMainPage /> },
  { path: '/record/:id', element: <RecordDetailPage /> },
  { path: '/record/intervention', element: <RecordInterventionPage /> },
])

export default router
