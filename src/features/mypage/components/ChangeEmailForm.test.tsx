import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMe } from '../hooks/useUser'
import ChangeEmailForm from './ChangeEmailForm'

vi.mock('../hooks/useUser', () => ({
  useMe: vi.fn(),
}))

describe('ChangeEmailForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useMe).mockReturnValue({
      data: {
        id: '1',
        nickname: '테스터',
        profileImageUrl: null,
        savingGoalText: null,
        interestTagsJson: null,
        phoneNumber: null,
        birthDate: null,
        gender: null,
        email: 'real@example.com',
        loginProvider: 'LOCAL',
        hasPassword: true,
        hourlyWage: null,
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useMe>)
  })

  it('하드코딩 값 대신 내 정보 API의 이메일을 표시하고 미지원 변경 버튼을 잠근다', () => {
    render(<ChangeEmailForm />)

    expect(screen.getByText('real@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '이메일 변경 준비 중' })).toBeDisabled()
    expect(
      screen.getByText(/현재 서버에서 이메일 변경 기능을 지원하지 않습니다/),
    ).toBeInTheDocument()
  })

  it('내 정보 조회의 최종 401 응답이면 로그인 이동을 안내한다', () => {
    const onUnauthorized = vi.fn()
    vi.mocked(useMe).mockReturnValue({
      isLoading: false,
      isError: true,
      error: { isAxiosError: true, response: { status: 401 } },
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useMe>)

    render(<ChangeEmailForm onUnauthorized={onUnauthorized} />)
    fireEvent.click(screen.getByRole('button', { name: '로그인하기' }))

    expect(onUnauthorized).toHaveBeenCalledOnce()
  })
})
