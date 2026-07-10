import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
//import SignUp from '@/features/auth/SignUp'
//import MyPagePage from '@/pages/MyPagePage'


const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  //{ path: '/signup', element: <SignUp /> },
  //{ path: '/mypage', element: <MyPagePage /> },
  // TODO: 랜딩, 로그인, 소비기록, 유혹관리, 마이페이지 라우트 추가
])

export default router
