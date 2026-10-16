import { StrictMode } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { kakaoLogin } from '@/api/auth'
import { createQueryClient } from '@/api/queryClient'
import { onboardingApi } from '@/features/onboarding/api/onboardingApi'
import type { OnboardingResult } from '@/features/onboarding/api/onboardingApi'
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  saveAuthSession,
} from '@/shared/auth/session'
import { SESSION_EXPIRED_NOTICE } from '@/shared/auth/redirect'
import KakaoCallback from './KakaoCallback'

vi.mock('@/features/drawer/useDrawer', () => ({
  useDrawer: () => ({ open: vi.fn() }),
}))

vi.mock('@/api/auth', () => ({
  kakaoLogin: vi.fn(),
}))

vi.mock('@/features/onboarding/api/onboardingApi', () => ({
  onboardingApi: { get: vi.fn() },
}))

const emptyOnboarding: OnboardingResult = {
  interestTags: null,
  savingGoalText: null,
  targetSavingAmount: null,
}

function renderCallback(search: string) {
  const queryClient = createQueryClient()
  queryClient.setDefaultOptions({
    queries: { ...queryClient.getDefaultOptions().queries, retryDelay: 0 },
  })
  const router = createMemoryRouter(
    [
      { path: '/auth/kakao/callback', element: <KakaoCallback /> },
      { path: '/', element: <div>홈 화면</div> },
      { path: '/onboarding', element: <div>온보딩 화면</div> },
      { path: '/login', element: <div>로그인 화면</div> },
      { path: '/auth/kakao/link', element: <div>계정 연결 화면</div> },
    ],
    { initialEntries: [`/auth/kakao/callback${search}`] },
  )
  const result = render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
  return { ...result, router }
}

describe('KakaoCallback', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    sessionStorage.setItem('kakaoOAuthState', 's1')
    vi.mocked(kakaoLogin).mockResolvedValue({
      success: true,
      message: '로그인 성공',
      data: {
        accessToken: 'access',
        refreshToken: 'refresh',
        tokenType: 'Bearer',
        user: {
          userId: '1',
          loginId: 'user',
          name: '사용자',
          email: 'user@example.com',
          phoneNumber: '',
        },
      },
    })
  })

  afterEach(() => {
    sessionStorage.clear()
    clearAuthSession()
  })

  it('로그인 처리 중에는 홈 화면 스켈레톤을 보여주고 헤더 버튼은 누를 수 없게 한다', () => {
    vi.mocked(kakaoLogin).mockReturnValue(new Promise(() => {}))
    sessionStorage.setItem('kakaoOAuthState', 's1')
    const { container } = renderCallback('?code=abc&state=s1')

    expect(screen.getByRole('status', { name: '카카오 로그인 처리 중' })).toBeInTheDocument()
    expect(container.querySelector('[inert]')).toContainElement(container.querySelector('header'))
    expect(kakaoLogin).toHaveBeenCalledWith({ authorizationCode: 'abc' })
  })

  it('카카오 로그인이 취소되면 스켈레톤 대신 실패 안내를 보여준다', () => {
    renderCallback('?error=access_denied')

    expect(screen.getByText('카카오 로그인이 취소되었습니다.')).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: '카카오 로그인 처리 중' })).not.toBeInTheDocument()
  })

  it.each([null, []])('관심사가 %j이고 설정이 없으면 온보딩으로 이동한다', async (interestTags) => {
    vi.mocked(onboardingApi.get).mockImplementation(async () => {
      expect(getAccessToken()).toBe('access')
      return { ...emptyOnboarding, interestTags }
    })
    const { router } = renderCallback('?code=abc&state=s1')

    expect(await screen.findByText('온보딩 화면')).toBeInTheDocument()
    expect(router.state.historyAction).toBe('REPLACE')
    expect(kakaoLogin).toHaveBeenCalledTimes(1)
    expect(onboardingApi.get).toHaveBeenCalledTimes(1)
  })

  it.each([
    { interestTags: ['쇼핑'] },
    { savingGoalText: '여행' },
    { targetSavingAmount: '500000' },
  ])('저장된 온보딩 설정이 있으면 홈으로 이동한다: %j', async (settings) => {
    vi.mocked(onboardingApi.get).mockResolvedValue({ ...emptyOnboarding, ...settings })
    renderCallback('?code=abc&state=s1')

    expect(await screen.findByText('홈 화면')).toBeInTheDocument()
  })

  it('온보딩 조회 중에는 이동하지 않고 로딩 화면을 유지한다', async () => {
    vi.mocked(onboardingApi.get).mockReturnValue(new Promise(() => {}))
    const { router } = renderCallback('?code=abc&state=s1')

    await waitFor(() => expect(onboardingApi.get).toHaveBeenCalledTimes(1))
    expect(screen.getByRole('status', { name: '카카오 로그인 처리 중' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/auth/kakao/callback')
  })

  it.each([
    { isAxiosError: true },
    { isAxiosError: true, code: 'ECONNABORTED' },
    { isAxiosError: true, response: { status: 503 } },
  ])('일시적 오류는 로그인 코드를 재사용하지 않고 조회만 한 번 재시도한다: %j', async (error) => {
    vi.mocked(onboardingApi.get).mockRejectedValueOnce(error).mockResolvedValueOnce(emptyOnboarding)
    renderCallback('?code=abc&state=s1')

    expect(await screen.findByText('온보딩 화면')).toBeInTheDocument()
    expect(onboardingApi.get).toHaveBeenCalledTimes(2)
    expect(kakaoLogin).toHaveBeenCalledTimes(1)
  })

  it('재시도도 실패하면 홈으로 보내지 않고 오류와 로그인 복귀 버튼을 보여준다', async () => {
    vi.mocked(onboardingApi.get).mockRejectedValue({
      isAxiosError: true,
      response: { status: 500 },
    })
    const { router } = renderCallback('?code=abc&state=s1')

    expect(
      await screen.findByText('온보딩 정보를 확인하지 못했습니다. 잠시 후 다시 로그인해주세요.'),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/auth/kakao/callback')
    expect(onboardingApi.get).toHaveBeenCalledTimes(2)
    expect(getAccessToken()).toBe('access')
    await userEvent.setup().click(screen.getByRole('button', { name: '로그인으로 돌아가기' }))
    expect(await screen.findByText('로그인 화면')).toBeInTheDocument()
  })

  it.each([403, 404])(
    '%i 오류를 온보딩 미설정으로 취급하거나 재시도하지 않는다',
    async (status) => {
      vi.mocked(onboardingApi.get).mockRejectedValue({ isAxiosError: true, response: { status } })
      const { router } = renderCallback('?code=abc&state=s1')

      expect(
        await screen.findByText('온보딩 정보를 확인하지 못했습니다. 잠시 후 다시 로그인해주세요.'),
      ).toBeInTheDocument()
      expect(router.state.location.pathname).toBe('/auth/kakao/callback')
      expect(onboardingApi.get).toHaveBeenCalledTimes(1)
    },
  )

  it('401이면 재시도 없이 만료 안내를 전달하고 로그인으로 이동한다', async () => {
    vi.mocked(onboardingApi.get).mockRejectedValue({
      isAxiosError: true,
      response: { status: 401 },
    })
    const { router } = renderCallback('?code=abc&state=s1')

    expect(await screen.findByText('로그인 화면')).toBeInTheDocument()
    expect(router.state.location.state).toEqual({ notice: SESSION_EXPIRED_NOTICE })
    expect(onboardingApi.get).toHaveBeenCalledTimes(1)
  })

  it('토큰 재발급 후 재시도한 요청도 401이면 세션을 정리하고 로그인으로 이동한다', async () => {
    vi.mocked(onboardingApi.get).mockImplementation(async () => {
      saveAuthSession({ accessToken: 'refreshed-access', refreshToken: 'refreshed-refresh' })
      throw { isAxiosError: true, response: { status: 401 } }
    })
    renderCallback('?code=abc&state=s1')

    expect(await screen.findByText('로그인 화면')).toBeInTheDocument()
    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })

  it('토큰 재발급이 일시적으로 실패해 401이 전달되면 세션을 유지한다', async () => {
    vi.mocked(onboardingApi.get).mockRejectedValue({
      isAxiosError: true,
      response: { status: 401 },
    })
    renderCallback('?code=abc&state=s1')

    expect(await screen.findByText('로그인 화면')).toBeInTheDocument()
    expect(getAccessToken()).toBe('access')
    expect(getRefreshToken()).toBe('refresh')
  })

  it('계정 연결이 필요하면 온보딩을 조회하지 않고 기존 연결 화면으로 이동한다', async () => {
    vi.mocked(kakaoLogin).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 409,
        data: {
          code: 'AUTH4093',
          data: { linkingToken: 'link', verificationMethods: ['PASSWORD'] },
        },
      },
    })
    const { router } = renderCallback('?code=abc&state=s1')

    expect(await screen.findByText('계정 연결 화면')).toBeInTheDocument()
    expect(router.state.location.state).toEqual({
      linkingToken: 'link',
      verificationMethods: ['PASSWORD'],
    })
    expect(onboardingApi.get).not.toHaveBeenCalled()
  })
})
