import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import ProtectedRoute from './ProtectedRoute'

function renderRoute(initialEntry = '/private?tab=recent#item') {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <div>로그인 화면</div> },
      {
        element: <ProtectedRoute />,
        children: [{ path: '/private', element: <div>보호 화면</div> }],
      },
    ],
    { initialEntries: [initialEntry] },
  )

  render(<RouterProvider router={router} />)
  return router
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('세션이 없으면 현재 경로를 보존하고 로그인으로 이동한다', async () => {
    const router = renderRoute()

    expect(await screen.findByText('로그인 화면')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
    expect(router.state.location.state).toEqual({ from: '/private?tab=recent#item' })
  })

  it.each([
    ['accessToken', 'access-token'],
    ['refreshToken', 'refresh-token'],
  ])('%s이 있으면 보호 화면 진입을 허용한다', async (key, token) => {
    localStorage.setItem(key, token)
    renderRoute('/private')

    await waitFor(() => expect(screen.getByText('보호 화면')).toBeInTheDocument())
  })
})
