/* eslint-disable react-refresh/only-export-components -- 라우트 설정 파일: lazy() 바인딩과 router export가 섞여 있어 fast-refresh 규칙 대상이 아님 */
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import { WishlistProvider } from '@/features/temptation/hooks/WishlistProvider'
import NotFoundPage from '@/pages/NotFoundPage'

const HomePage = lazy(() => import('@/pages/HomePage'))
const NotificationPage = lazy(() => import('@/pages/NotificationPage'))
const RecordMainPage = lazy(() => import('@/features/record/pages/RecordMainPage'))
const RecordDetailPage = lazy(() => import('@/features/record/pages/RecordDetailPage'))
const RecordCreatePage = lazy(() => import('@/features/record/pages/RecordCreatePage'))
const RecordInterventionPage = lazy(
  () => import('@/features/intervention/pages/RecordInterventionPage'),
)
const RiskResultPage = lazy(() => import('@/features/intervention/pages/RiskResultPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const SignUpPage = lazy(() => import('@/pages/SignUpPage'))
const FindIdPage = lazy(() => import('@/pages/FindIdPage'))
const ResetPasswordRequestPage = lazy(() => import('@/pages/ResetPasswordRequestPage'))
const ResetPasswordVerifyPage = lazy(() => import('@/pages/ResetPasswordVerifyPage'))
const ResetPasswordNewPage = lazy(() => import('@/pages/ResetPasswordNewPage'))
const MyPagePage = lazy(() => import('@/pages/MyPagePage'))
const Temptation = lazy(() => import('@/features/temptation/Temptation'))
const TemptationInfo = lazy(() => import('@/features/temptation/pages/TemptationInfo'))
const GoalAmountPage = lazy(() => import('@/pages/GoalAmountPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const TemptationEdit = lazy(() => import('@/features/temptation/pages/TemptationEdit'))
const ChangeEmailPage = lazy(() => import('@/pages/ChangeEmailPage'))
const ChangePasswordPage = lazy(() => import('@/pages/ChangePasswordPage'))
const WithdrawPage = lazy(() => import('@/pages/WithdrawPage'))
const ConsumptionReportPage = lazy(() => import('@/pages/ConsumptionReportPage'))
const OnboardingInterestPage = lazy(() => import('@/pages/OnboardingInterestPage'))
const OnboardingGoalPage = lazy(() => import('@/pages/OnboardingGoalPage'))
const OnboardingCompletePage = lazy(() => import('@/pages/OnboardingCompletePage'))

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/find-id', element: <FindIdPage /> },
      { path: '/reset-password', element: <ResetPasswordRequestPage /> },
      { path: '/reset-password/verify', element: <ResetPasswordVerifyPage /> },
      { path: '/reset-password/new', element: <ResetPasswordNewPage /> },
      { path: '/mypage', element: <MyPagePage /> },
      { path: '/goal-amount', element: <GoalAmountPage /> },
      { path: '/notification', element: <NotificationPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/changeemail', element: <ChangeEmailPage /> },
      { path: '/changepassword', element: <ChangePasswordPage /> },
      { path: '/withdraw', element: <WithdrawPage /> },
      { path: '/consumption-report', element: <ConsumptionReportPage /> },
      { path: '/onboarding', element: <OnboardingInterestPage /> },
      { path: '/onboarding/step2', element: <OnboardingGoalPage /> },
      { path: '/onboarding/step3', element: <OnboardingCompletePage /> },
      { path: '/record', element: <RecordMainPage /> },
      { path: '/record/new', element: <RecordCreatePage /> },
      { path: '/record/:id', element: <RecordDetailPage /> },
      { path: '/record/:id/edit', element: <RecordCreatePage /> },
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
          { path: '/temptation/:id/edit', element: <TemptationEdit /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router
