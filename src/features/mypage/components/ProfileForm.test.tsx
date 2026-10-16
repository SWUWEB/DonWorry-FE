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

  it('생년월일 선택 전 안내를 유지하고 달력에서 고른 날짜를 표시·저장한다', () => {
    render(<ProfileForm />)
    const birth = screen.getByLabelText<HTMLInputElement>('생년월일')
    const showPicker = vi.fn()
    Object.defineProperty(birth, 'showPicker', { value: showPicker })
    birth.focus()
    fireEvent.click(birth)
    expect(showPicker).toHaveBeenCalledOnce()
    expect(screen.getByText('생년월일을 선택해주세요.')).toBeInTheDocument()
    fireEvent.change(birth, { target: { value: '1998-03-15' } })
    expect(screen.getByText('1998.03.15')).toBeInTheDocument()
    expect(screen.queryByText('생년월일을 선택해주세요.')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }))
    expect(updateMe).toHaveBeenCalledWith(
      expect.objectContaining({ birthDate: '1998-03-15' }),
      expect.any(Object),
    )
    fireEvent.change(birth, { target: { value: '' } })
    expect(screen.getByText('생년월일을 선택해주세요.')).toBeInTheDocument()
  })

  it('서버 성별이 null이면 다른 프로필을 저장해도 gender를 임의로 전송하지 않는다', async () => {
    render(<ProfileForm />)

    await screen.findByDisplayValue('테스터')
    expect(screen.getByLabelText('전화번호')).toHaveValue('010-1234-5678')
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

  it.each([
    ['01098765432', '010-9876-5432', '01098765432'],
    ['010-9876-5432', '010-9876-5432', '01098765432'],
    ['02 1234 5678', '02-1234-5678', '0212345678'],
    ['', '', null],
  ])('전화번호 %s 입력을 표시용으로 변환하고 숫자만 저장한다', (input, display, payload) => {
    render(<ProfileForm />)
    const phone = screen.getByLabelText('전화번호')
    fireEvent.change(phone, { target: { value: input } })
    expect(phone).toHaveValue(display)
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }))
    expect(updateMe).toHaveBeenCalledWith(
      expect.objectContaining({ phoneNumber: payload }),
      expect.any(Object),
    )
  })

  it('번호 중간을 수정해도 커서를 유지하고 하이픈 앞에서 삭제할 수 있다', async () => {
    render(<ProfileForm />)
    const phone = screen.getByLabelText<HTMLInputElement>('전화번호')
    phone.focus()
    fireEvent.change(phone, {
      target: { value: '010-9234-5678', selectionStart: 5 },
    })
    await waitFor(() => expect(phone.selectionStart).toBe(5))
    fireEvent.change(phone, {
      target: { value: '0109234-5678', selectionStart: 3 },
    })
    await waitFor(() => expect(phone.selectionStart).toBe(3))
    expect(phone).toHaveValue('010-9234-5678')
    fireEvent.change(phone, { target: { value: '01-9234-5678', selectionStart: 2 } })
    await waitFor(() => expect(phone.selectionStart).toBe(2))
    expect(phone).toHaveValue('019-234-5678')
  })
})
