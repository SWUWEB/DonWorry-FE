import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { hasAuthSession } from './session'
import type { LoginRedirectState } from './redirect'

export default function ProtectedRoute() {
  const location = useLocation()

  if (!hasAuthSession()) {
    const state: LoginRedirectState = {
      from: `${location.pathname}${location.search}${location.hash}`,
    }
    return <Navigate to="/login" replace state={state} />
  }

  return <Outlet />
}
