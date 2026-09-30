import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { useLoginIdRecovery } from '@/hooks/useLoginIdRecovery'
import FindId from './FindId'

vi.mock('@/hooks/useLoginIdRecovery', () => ({ useLoginIdRecovery: vi.fn() }))

describe('FindId', () => {
  const mutate = vi.fn()
  const mount = () =>
    render(
      <MemoryRouter>
        <FindId />
      </MemoryRouter>,
    )
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useLoginIdRecovery).mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useLoginIdRecovery>)
  })
  afterEach(() => vi.useRealTimers())

  it('invalid email prevents submission', () => {
    mount()
    fireEvent.change(screen.getByLabelText('가입 이메일'), { target: { value: 'invalid' } })
    fireEvent.click(screen.getByRole('button', { name: '아이디 전송' }))
    expect(mutate).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent('올바른 이메일')
  })

  it('success shows neutral guidance and enforces the server cooldown', () => {
    vi.useFakeTimers()
    mount()
    fireEvent.change(screen.getByLabelText('가입 이메일'), {
      target: { value: ' tester@example.com ' },
    })
    fireEvent.click(screen.getByRole('button', { name: '아이디 전송' }))
    expect(mutate).toHaveBeenCalledWith({ email: 'tester@example.com' }, expect.any(Object))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    act(() => mutate.mock.calls[0][1].onSuccess({ data: { resendCooldownSeconds: 2 } }))
    expect(screen.getByRole('status')).toHaveTextContent('가입된 계정이 있다면')
    expect(screen.getByRole('button', { name: '2초 후 재전송' })).toBeDisabled()
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByRole('button', { name: '아이디 전송' })).toBeEnabled()
  })

  it('network failure allows retry without claiming success', () => {
    mount()
    fireEvent.change(screen.getByLabelText('가입 이메일'), {
      target: { value: 'tester@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: '아이디 전송' }))
    act(() => mutate.mock.calls[0][1].onError(new Error('network')))
    expect(screen.getByRole('alert')).toHaveTextContent('요청에 실패')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '아이디 전송' }))
    expect(mutate).toHaveBeenCalledTimes(2)
  })

  it('rate limit uses retryAfterSeconds', () => {
    vi.useFakeTimers()
    mount()
    fireEvent.change(screen.getByLabelText('가입 이메일'), {
      target: { value: 'tester@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: '아이디 전송' }))
    act(() =>
      mutate.mock.calls[0][1].onError({
        isAxiosError: true,
        response: {
          status: 429,
          data: { message: '잠시 후 다시 시도해주세요.', retryAfterSeconds: 42 },
        },
      }),
    )
    expect(screen.getByRole('button', { name: '42초 후 재전송' })).toBeDisabled()
    act(() => vi.advanceTimersByTime(42000))
    expect(screen.getByRole('button', { name: '아이디 전송' })).toBeEnabled()
  })

  it('pending request locks input and submit', () => {
    vi.mocked(useLoginIdRecovery).mockReturnValue({
      mutate,
      isPending: true,
    } as unknown as ReturnType<typeof useLoginIdRecovery>)
    mount()
    expect(screen.getByRole('button', { name: '요청 중...' })).toBeDisabled()
    expect(screen.getByLabelText('가입 이메일')).toHaveAttribute('readonly')
  })
})
