import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthSession } from './useAuthSession'
import { SESSION_EXPIRED_NOTICE } from './redirect'
import type { LoginRedirectState } from './redirect'

export default function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated, expired } = useAuthSession()

  if (!isAuthenticated) {
    const state: LoginRedirectState = {
      from: `${location.pathname}${location.search}${location.hash}`,
      ...(expired && { notice: SESSION_EXPIRED_NOTICE }),
    }
    return <Navigate to="/login" replace state={state} />
  }

  return <Outlet />
}
