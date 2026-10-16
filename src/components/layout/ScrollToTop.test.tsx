import { act, render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import ScrollToTop from './ScrollToTop'

afterEach(() => vi.restoreAllMocks())

it('첫 진입과 페이지 이동·뒤로·앞으로 가기에서 맨 위로 이동한다', async () => {
  const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  const originalRestoration = window.history.scrollRestoration
  const router = createMemoryRouter([{ path: '*', element: <ScrollToTop /> }], {
    initialEntries: ['/mypage'],
  })
  const { unmount } = render(<RouterProvider router={router} />)
  expect(window.history.scrollRestoration).toBe('manual')
  expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })

  for (const destination of ['/profile', -1, 1, '/profile?tab=info'] as const) {
    scrollTo.mockClear()
    await act(async () => {
      if (typeof destination === 'number') await router.navigate(destination)
      else await router.navigate(destination)
    })
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })
  }
  unmount()
  expect(window.history.scrollRestoration).toBe(originalRestoration)
  router.dispose()
})
