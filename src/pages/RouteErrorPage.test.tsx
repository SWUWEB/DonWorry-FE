import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import RouteErrorPage from './RouteErrorPage'

function renderWithRouteError(loader: () => never) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        loader,
        element: <div>정상 화면</div>,
        errorElement: <RouteErrorPage />,
      },
      { path: '/home', element: <div>홈 화면</div> },
    ],
    { initialEntries: ['/'] },
  )

  render(<RouterProvider router={router} />)
  return router
}

describe('RouteErrorPage', () => {
  beforeEach(() => {
    // 라우터가 오류를 콘솔로도 출력하므로 테스트 출력만 조용히 만듭니다.
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('없는 경로는 기존 404 화면을 보여준다', async () => {
    renderWithRouteError(() => {
      throw new Response(null, { status: 404 })
    })

    expect(await screen.findByText('페이지를 찾을 수 없어요')).toBeInTheDocument()
  })

  it('배포로 청크를 못 받으면 404가 아니라 새로고침을 안내한다', async () => {
    renderWithRouteError(() => {
      throw new Error('Failed to fetch dynamically imported module: /assets/HomePage-abc123.js')
    })

    expect(await screen.findByText('새 버전이 배포되었어요')).toBeInTheDocument()
    expect(screen.queryByText('페이지를 찾을 수 없어요')).not.toBeInTheDocument()
    // 새로고침이면 해결되는 상황이라 홈으로 보내지 않습니다.
    expect(screen.queryByRole('button', { name: '홈으로 가기' })).not.toBeInTheDocument()
  })

  it('그 밖의 오류는 404로 위장하지 않고 오류로 안내한다', async () => {
    renderWithRouteError(() => {
      throw new Error('boom')
    })

    expect(await screen.findByText('문제가 발생했어요')).toBeInTheDocument()
    expect(screen.queryByText('페이지를 찾을 수 없어요')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '홈으로 가기' })).toBeInTheDocument()
  })

  it('새로고침 버튼은 페이지를 다시 불러온다', async () => {
    const reload = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      reload,
    } as unknown as Location)

    renderWithRouteError(() => {
      throw new Error('boom')
    })

    await userEvent.setup().click(await screen.findByRole('button', { name: '새로고침' }))

    expect(reload).toHaveBeenCalled()
  })
})
