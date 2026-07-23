import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import NotificationPage from '@/pages/NotificationPage'
import RecordMainPage from '@/features/record/pages/RecordMainPage'
import RecordDetailPage from '@/features/record/pages/RecordDetailPage'
import RecordInterventionPage from '@/features/intervention/pages/RecordInterventionPage'
import RiskResultPage from '@/features/intervention/pages/RiskResultPage'
import LoginPage from '@/pages/LoginPage'
import SignUpPage from '@/pages/SignUpPage'
import MyPagePage from '@/pages/MyPagePage'
import GoalAmountPage from '@/pages/GoalAmountPage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/mypage', element: <MyPagePage /> }, 
  {path: '/goal-amount', element: <GoalAmountPage /> },
  { path: '/notification', element: <NotificationPage /> },

  { path: '/record', element: <RecordMainPage /> },
  { path: '/record/:id', element: <RecordDetailPage /> },
  { path: '/record/intervention', element: <RecordInterventionPage /> },
  { path: '/record/intervention/result', element: <RiskResultPage /> },
])

export default router
