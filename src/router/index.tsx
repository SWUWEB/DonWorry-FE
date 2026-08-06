import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import { WishlistProvider } from '@/features/temptation/hooks/WishlistProvider'
import HomePage from '@/pages/HomePage'
import NotificationPage from '@/pages/NotificationPage'
import RecordMainPage from '@/features/record/pages/RecordMainPage'
import RecordDetailPage from '@/features/record/pages/RecordDetailPage'
import RecordCreatePage from '@/features/record/pages/RecordCreatePage'
import RecordInterventionPage from '@/features/intervention/pages/RecordInterventionPage'
import RiskResultPage from '@/features/intervention/pages/RiskResultPage'
import LoginPage from '@/pages/LoginPage'
import SignUpPage from '@/pages/SignUpPage'
import MyPagePage from '@/pages/MyPagePage'
import Temptation from '@/features/temptation/Temptation'
import TemptationInfo from '@/features/temptation/pages/TemptationInfo'
import GoalAmountPage from '@/pages/GoalAmountPage'
import ProfilePage from '@/pages/ProfilePage'
import ChangeEmailPage from '@/pages/ChangeEmailPage'
import ChangePasswordPage from '@/pages/ChangePasswordPage'
import WithdrawPage from '@/pages/WithdrawPage'
import OnboardingInterestPage from '@/pages/OnboardingInterestPage'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/mypage', element: <MyPagePage /> },
      { path: '/goal-amount', element: <GoalAmountPage /> },
      { path: '/notification', element: <NotificationPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/changeemail', element: <ChangeEmailPage /> },
      { path: '/changepassword', element: <ChangePasswordPage /> },
      { path: '/withdraw', element: <WithdrawPage /> },
      { path: '/onboarding', element: <OnboardingInterestPage /> },
      { path: '/record', element: <RecordMainPage /> },
      { path: '/record/new', element: <RecordCreatePage /> },
      { path: '/record/:id', element: <RecordDetailPage /> },
      { path: '/record/intervention', element: <RecordInterventionPage /> },
      {
        path: '/record/intervention/result',
        element: <RiskResultPage />,
      },
      {
        element: <WishlistProvider />,
        children: [
          { path: '/temptation', element: <Temptation /> },
          { path: '/temptation/:id', element: <TemptationInfo /> },
        ],
      },
    ],
  },
])

export default router
