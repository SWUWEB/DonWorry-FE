import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import RecordMainPage from '@/features/record/pages/RecordMainPage'
import RecordDetailPage from '@/features/record/pages/RecordDetailPage'
import RecordInterventionPage from '@/features/intervention/pages/RecordInterventionPage'
import LoginPage from '@/pages/LoginPage'
import SignUpPage from '@/pages/SignUpPage'
import MyPagePage from '@/pages/MyPagePage'
import Temptation from '@/features/temptation/Temptation'
import TemptationInfo from '@/features/temptation/pages/TemptationInfo'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/mypage', element: <MyPagePage /> }, 

  // TODO: 랜딩, 로그인, 유혹관리, 마이페이지 라우트 추가
  { path: '/record', element: <RecordMainPage /> },
  { path: '/record/:id', element: <RecordDetailPage /> },
  { path: '/record/intervention', element: <RecordInterventionPage /> },

  { path: '/temptation', element: <Temptation />},
  { path: '/temptation/:id', element: <TemptationInfo />},
])

export default router
