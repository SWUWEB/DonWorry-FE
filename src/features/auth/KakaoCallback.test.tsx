import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { kakaoLogin } from '@/api/auth'
import KakaoCallback from './KakaoCallback'

vi.mock('@/features/drawer/useDrawer', () => ({
  useDrawer: () => ({ open: vi.fn() }),
}))

vi.mock('@/api/auth', () => ({
  kakaoLogin: vi.fn(),
}))

function renderCallback(search: string) {
  return render(
    <MemoryRouter initialEntries={[`/auth/kakao/callback${search}`]}>
      <KakaoCallback />
    </MemoryRouter>,
  )
}

describe('KakaoCallback', () => {
  afterEach(() => sessionStorage.clear())

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
})
