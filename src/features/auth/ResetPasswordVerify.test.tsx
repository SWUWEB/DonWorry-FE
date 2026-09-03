import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ResetPasswordVerify from './ResetPasswordVerify'
import { saveResetPasswordDraft } from './resetPasswordSession'

const { resendMock } = vi.hoisted(() => ({
  resendMock: vi.fn(),
}))

vi.mock('@/hooks/usePasswordResetRequest', () => ({
  usePasswordResetRequest: () => ({ mutate: resendMock, isPending: false }),
}))

describe('ResetPasswordVerify', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    saveResetPasswordDraft({ email: 'user@example.com', codeVerified: false })
  })

  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={['/reset-password/verify']}>
        <ResetPasswordVerify />
      </MemoryRouter>,
    )

  it('코드 재전송 버튼에서 비밀번호 재설정 요청 API를 다시 호출한다', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: '코드 재전송' }))

    expect(resendMock).toHaveBeenCalledWith(
      { email: 'user@example.com' },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    )

    const options = resendMock.mock.calls[0][1]
    act(() => options.onSuccess())

    expect(screen.getByText('인증 코드를 다시 전송했습니다.')).toBeInTheDocument()
  })

  it('재전송 제한 응답의 남은 시간을 안내한다', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: '코드 재전송' }))

    const options = resendMock.mock.calls[0][1]
    act(() =>
      options.onError({
        isAxiosError: true,
        response: {
          status: 429,
          data: { message: '요청이 너무 잦습니다.', retryAfterSeconds: 30 },
        },
      }),
    )

    expect(
      screen.getByText('요청이 너무 잦습니다. (30초 후 다시 시도해주세요.)'),
    ).toBeInTheDocument()
  })
})
