import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMe, useUpdateMe } from '../hooks/useUser'
import ProfileForm from './ProfileForm'

vi.mock('../hooks/useUser', () => ({
  useMe: vi.fn(),
  useUpdateMe: vi.fn(),
}))

describe('ProfileForm', () => {
  const updateMe = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUpdateMe).mockReturnValue({
      mutate: updateMe,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateMe>)
    vi.mocked(useMe).mockReturnValue({
      data: {
        id: '1',
        nickname: '테스터',
        profileImageUrl: null,
        savingGoalText: null,
        interestTagsJson: null,
        phoneNumber: '01012345678',
        birthDate: null,
        gender: null,
        email: 'tester@example.com',
        loginProvider: 'LOCAL',
        hasPassword: true,
        hourlyWage: null,
      },
    } as ReturnType<typeof useMe>)
  })

  it('서버 성별이 null이면 다른 프로필을 저장해도 gender를 임의로 전송하지 않는다', async () => {
    render(<ProfileForm />)

    await screen.findByDisplayValue('테스터')
    expect(screen.getByRole('radio', { name: '여성' })).not.toBeChecked()
    expect(screen.getByRole('radio', { name: '남성' })).not.toBeChecked()

    fireEvent.click(screen.getByRole('button', { name: '저장하기' }))

    await waitFor(() => {
      expect(updateMe).toHaveBeenCalledWith(
        {
          nickname: '테스터',
          phoneNumber: '01012345678',
          birthDate: null,
        },
        expect.any(Object),
      )
    })
  })
})
