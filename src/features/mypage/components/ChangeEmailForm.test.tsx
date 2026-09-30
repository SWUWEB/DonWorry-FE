import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useChangeEmail, useMe, useSendEmailChangeCode } from '../hooks/useUser'
import ChangeEmailForm from './ChangeEmailForm'

vi.mock('../hooks/useUser', () => ({
  useMe: vi.fn(),
  useChangeEmail: vi.fn(),
  useSendEmailChangeCode: vi.fn(),
}))

describe('ChangeEmailForm', () => {
  const send = vi.fn()
  const change = vi.fn()
  const refetch = vi.fn()
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useMe).mockReturnValue({
      data: { email: 'real@example.com' },
      isLoading: false,
      isError: false,
      refetch,
    } as unknown as ReturnType<typeof useMe>)
    vi.mocked(useSendEmailChangeCode).mockReturnValue({
      mutate: send,
      isPending: false,
    } as unknown as ReturnType<typeof useSendEmailChangeCode>)
    vi.mocked(useChangeEmail).mockReturnValue({
      mutate: change,
      isPending: false,
    } as unknown as ReturnType<typeof useChangeEmail>)
  })
  afterEach(() => vi.useRealTimers())

  function requestCode(ttl = 600) {
    fireEvent.change(screen.getByLabelText('새 이메일'), { target: { value: 'new@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: '인증번호 받기' }))
    act(() =>
      send.mock.calls[send.mock.calls.length - 1][1].onSuccess({
        newEmail: 'new@example.com',
        codeTtlSeconds: ttl,
        resendCooldownSeconds: 2,
      }),
    )
  }

  it('sends to the new email, confirms the six digit code, and shows success', () => {
    render(<ChangeEmailForm />)
    expect(screen.getByText('real@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '이메일 변경' })).toBeDisabled()
    requestCode()
    expect(send).toHaveBeenCalledWith({ newEmail: 'new@example.com' }, expect.any(Object))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByRole('timer')).toHaveTextContent('10:00')
    fireEvent.change(screen.getByLabelText('인증번호'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: '이메일 변경' }))
    expect(change).toHaveBeenCalledWith(
      { newEmail: 'new@example.com', code: '123456' },
      expect.any(Object),
    )
    act(() => change.mock.calls[0][1].onSuccess())
    expect(screen.getByRole('status')).toHaveTextContent('이메일이 변경되었습니다.')
    expect(screen.queryByLabelText('인증번호')).not.toBeInTheDocument()
  })

  it('editing the email invalidates the previous code', () => {
    render(<ChangeEmailForm />)
    requestCode()
    fireEvent.change(screen.getByLabelText('인증번호'), { target: { value: '123456' } })
    fireEvent.change(screen.getByLabelText('새 이메일'), { target: { value: 'other@example.com' } })
    expect(screen.queryByLabelText('인증번호')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '이메일 변경' })).toBeDisabled()
    expect(change).not.toHaveBeenCalled()
  })

  it('expired codes cannot be confirmed and a new code can be requested', () => {
    vi.useFakeTimers()
    render(<ChangeEmailForm />)
    requestCode(3)
    fireEvent.change(screen.getByLabelText('인증번호'), { target: { value: '123456' } })
    expect(screen.getByRole('button', { name: '2초 후 재전송' })).toBeDisabled()
    expect(screen.getByRole('timer')).toHaveTextContent('00:03')
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByRole('timer')).toHaveTextContent('00:02')
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByRole('timer')).toHaveTextContent('00:00')
    expect(screen.getByRole('status')).toHaveTextContent('만료')
    expect(screen.getByRole('button', { name: '이메일 변경' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: '인증번호 받기' }))
    expect(send).toHaveBeenCalledTimes(2)
  })

  it('duplicate email errors do not expose a confirmation input', () => {
    render(<ChangeEmailForm />)
    fireEvent.change(screen.getByLabelText('새 이메일'), { target: { value: 'used@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: '인증번호 받기' }))
    act(() =>
      send.mock.calls[0][1].onError({
        isAxiosError: true,
        response: { status: 409, data: { message: '이미 가입된 이메일입니다.' } },
      }),
    )
    expect(screen.getByRole('alert')).toHaveTextContent('이미 가입된 이메일')
    expect(screen.queryByLabelText('인증번호')).not.toBeInTheDocument()
  })

  it('invalid code errors keep the form available for retry', () => {
    render(<ChangeEmailForm />)
    requestCode()
    fireEvent.change(screen.getByLabelText('인증번호'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: '이메일 변경' }))
    act(() =>
      change.mock.calls[0][1].onError({
        isAxiosError: true,
        response: { status: 400, data: { message: '인증번호가 올바르지 않습니다.' } },
      }),
    )
    expect(screen.getByRole('alert')).toHaveTextContent('인증번호가 올바르지 않습니다.')
    fireEvent.change(screen.getByLabelText('인증번호'), { target: { value: '654321' } })
    fireEvent.click(screen.getByRole('button', { name: '이메일 변경' }))
    expect(change).toHaveBeenLastCalledWith(
      { newEmail: 'new@example.com', code: '654321' },
      expect.any(Object),
    )
  })

  it('confirmation rate limit blocks retries for the reported time', () => {
    vi.useFakeTimers()
    render(<ChangeEmailForm />)
    requestCode()
    fireEvent.change(screen.getByLabelText('인증번호'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: '이메일 변경' }))
    act(() =>
      change.mock.calls[0][1].onError({
        isAxiosError: true,
        response: { status: 429, data: { retryAfterSeconds: 10 } },
      }),
    )
    expect(screen.getByRole('button', { name: '10초 후 다시 시도' })).toBeDisabled()
    act(() => vi.advanceTimersByTime(10000))
    expect(screen.getByRole('button', { name: '이메일 변경' })).toBeEnabled()
  })

  it('sending locks both mutation buttons', () => {
    vi.mocked(useSendEmailChangeCode).mockReturnValue({
      mutate: send,
      isPending: true,
    } as unknown as ReturnType<typeof useSendEmailChangeCode>)
    render(<ChangeEmailForm />)
    expect(screen.getByRole('button', { name: '발송 중...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '이메일 변경' })).toBeDisabled()
    expect(screen.getByLabelText('새 이메일')).toHaveAttribute('readonly')
  })

  it('profile query failure supports retry', () => {
    vi.mocked(useMe).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof useMe>)
    render(<ChangeEmailForm />)
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }))
    expect(refetch).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: '인증번호 받기' })).toBeDisabled()
  })

  it.each(['query', 'send', 'confirm'])('401 from %s leads to login', (source) => {
    const onUnauthorized = vi.fn()
    const error = { isAxiosError: true, response: { status: 401 } }
    if (source === 'query')
      vi.mocked(useMe).mockReturnValue({
        isLoading: false,
        isError: true,
        error,
        refetch,
      } as unknown as ReturnType<typeof useMe>)
    render(<ChangeEmailForm onUnauthorized={onUnauthorized} />)
    if (source === 'send') {
      fireEvent.change(screen.getByLabelText('새 이메일'), { target: { value: 'new@example.com' } })
      fireEvent.click(screen.getByRole('button', { name: '인증번호 받기' }))
      act(() => send.mock.calls[0][1].onError(error))
    }
    if (source === 'confirm') {
      requestCode()
      fireEvent.change(screen.getByLabelText('인증번호'), { target: { value: '123456' } })
      fireEvent.click(screen.getByRole('button', { name: '이메일 변경' }))
      act(() => change.mock.calls[0][1].onError(error))
    }
    fireEvent.click(screen.getByRole('button', { name: '로그인하기' }))
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })
})
