import { createBrowserRouter } from 'react-router-dom'
import { WishlistProvider } from '@/features/temptation/hooks/WishlistProvider'
import HomePage from '@/pages/HomePage'
import NotificationPage from '@/pages/NotificationPage'
import RecordMainPage from '@/features/record/pages/RecordMainPage'
import RecordDetailPage from '@/features/record/pages/RecordDetailPage'
import RecordInterventionPage from '@/features/intervention/pages/RecordInterventionPage'
import RiskResultPage from '@/features/intervention/pages/RiskResultPage'
import LoginPage from '@/pages/LoginPage'
import SignUpPage from '@/pages/SignUpPage'
import MyPagePage from '@/pages/MyPagePage'
import Temptation from '@/features/temptation/Temptation'
import TemptationInfo from '@/features/temptation/pages/TemptationInfo'
import GoalAmountPage from '@/pages/GoalAmountPage'
import ProfilePage from '@/pages/ProfilePage'
import TemptationEdit from '@/features/temptation/pages/TemptationEdit'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/mypage', element: <MyPagePage /> }, 
  {path: '/goal-amount', element: <GoalAmountPage /> },
  { path: '/notification', element: <NotificationPage /> },
  {path: '/profile', element: <ProfilePage />,},

  { path: '/record', element: <RecordMainPage /> },
  { path: '/record/:id', element: <RecordDetailPage /> },
  { path: '/record/intervention', element: <RecordInterventionPage /> },

  {
    element: <WishlistProvider />,
    children: [
      { path: '/temptation', element: <Temptation /> },
      { path: '/temptation/:id', element: <TemptationInfo /> },
      { path: '/temptation/:id/edit', element: <TemptationEdit /> },
    ],
  },
  { path: '/record/intervention/result', element: <RiskResultPage /> },
])

export default router
