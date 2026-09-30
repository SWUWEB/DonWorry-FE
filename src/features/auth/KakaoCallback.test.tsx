import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import KakaoCallback from './KakaoCallback'
import { getAccessToken } from '@/shared/auth/session'

const { kakaoLogin, getOnboarding } = vi.hoisted(() => ({
  kakaoLogin: vi.fn(),
  getOnboarding: vi.fn(),
}))

vi.mock('@/api/auth', () => ({
  kakaoLogin,
}))
vi.mock('@/features/onboarding/api/onboardingApi', () => ({
  onboardingApi: { get: getOnboarding },
}))

const STATE = 'test-state'

function renderKakaoCallback() {
  const router = createMemoryRouter(
    [
      { path: '/auth/kakao/callback', element: <KakaoCallback /> },
      { path: '/onboarding', element: <div>온보딩 화면</div> },
      { path: '/', element: <div>홈 화면</div> },
    ],
    { initialEntries: [`/auth/kakao/callback?code=auth-code&state=${STATE}`] },
  )

  render(<RouterProvider router={router} />)
  return router
}

describe('KakaoCallback', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    sessionStorage.setItem('kakaoOAuthState', STATE)
    vi.clearAllMocks()

    kakaoLogin.mockResolvedValue({
      data: { accessToken: 'access', refreshToken: 'refresh' },
    })
  })

  it('온보딩을 아직 저장하지 않은 신규 사용자는 온보딩 화면으로 이동한다', async () => {
    getOnboarding.mockResolvedValue({
      interestTags: null,
      savingGoalText: null,
      targetSavingAmount: null,
    })

    const router = renderKakaoCallback()

    expect(await screen.findByText('온보딩 화면')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/onboarding')
    expect(getAccessToken()).toBe('access')
  })

  it('이미 온보딩을 마친 사용자는 홈 화면으로 이동한다', async () => {
    getOnboarding.mockResolvedValue({
      interestTags: ['식비'],
      savingGoalText: '여행',
      targetSavingAmount: '500000',
    })

    const router = renderKakaoCallback()

    expect(await screen.findByText('홈 화면')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
  })

  it('온보딩 조회가 실패해도 로그인 자체는 성공 처리하고 홈으로 이동한다', async () => {
    getOnboarding.mockRejectedValue(new Error('network'))

    const router = renderKakaoCallback()

    expect(await screen.findByText('홈 화면')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
    expect(getAccessToken()).toBe('access')
  })
})
