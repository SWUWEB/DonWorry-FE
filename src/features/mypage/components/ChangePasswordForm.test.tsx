import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useChangePassword } from '../hooks/useUser'
import ChangePasswordForm from './ChangePasswordForm'

vi.mock('../hooks/useUser', () => ({
  useChangePassword: vi.fn(),
}))

describe('ChangePasswordForm', () => {
  const changePassword = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useChangePassword).mockReturnValue({
      mutate: changePassword,
      isPending: false,
    } as unknown as ReturnType<typeof useChangePassword>)
  })

  it('Swagger가 허용하는 17~100자 비밀번호를 제출할 수 있다', async () => {
    const longPassword = 'LongPassword1234!'
    render(<ChangePasswordForm />)

    fireEvent.change(screen.getByLabelText('현재 비밀번호'), {
      target: { value: 'CurrentPassword1!' },
    })
    fireEvent.change(screen.getByLabelText('새 비밀번호'), {
      target: { value: longPassword },
    })
    fireEvent.change(screen.getByLabelText('새 비밀번호 확인'), {
      target: { value: longPassword },
    })
    fireEvent.click(screen.getByRole('button', { name: '변경하기' }))

    await waitFor(() => {
      expect(changePassword).toHaveBeenCalledWith(
        {
          currentPassword: 'CurrentPassword1!',
          newPassword: longPassword,
          newPasswordConfirm: longPassword,
        },
        expect.any(Object),
      )
    })
  })

  it('최종 401 응답이면 로그인 안내 후 전달받은 이동 함수를 실행한다', () => {
    const onUnauthorized = vi.fn()
    vi.mocked(useChangePassword).mockReturnValue({
      mutate: changePassword,
      isPending: false,
      error: { isAxiosError: true, response: { status: 401 } },
    } as unknown as ReturnType<typeof useChangePassword>)

    render(<ChangePasswordForm onUnauthorized={onUnauthorized} />)

    fireEvent.click(screen.getByRole('button', { name: '로그인하기' }))
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })
})
