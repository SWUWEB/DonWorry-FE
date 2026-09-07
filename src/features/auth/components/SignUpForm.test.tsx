import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SignUpForm from './SignUpForm'
import { getAccessToken } from '@/shared/auth/session'

const { signup, login, sendEmail, confirmEmail, checkEmail, checkLoginId } = vi.hoisted(() => ({
  signup: vi.fn(),
  login: vi.fn(),
  sendEmail: vi.fn(),
  confirmEmail: vi.fn(),
  checkEmail: vi.fn(),
  checkLoginId: vi.fn(),
}))

vi.mock('@/hooks/useSignup', () => ({
  useSignup: () => ({ mutate: signup, isPending: false }),
}))
vi.mock('@/hooks/useLogin', () => ({
  useLogin: () => ({ mutateAsync: login, isPending: false }),
}))
vi.mock('@/hooks/useSendVerificationEmail', () => ({
  useSendVerificationEmail: () => ({ mutate: sendEmail, isPending: false }),
}))
vi.mock('@/hooks/useConfirmVerificationEmail', () => ({
  useConfirmVerificationEmail: () => ({ mutate: confirmEmail, isPending: false }),
}))
vi.mock('@/hooks/useCheckEmail', () => ({
  useCheckEmail: () => ({ mutate: checkEmail, isPending: false }),
}))
vi.mock('@/hooks/useCheckLoginId', () => ({
  useCheckLoginId: () => ({ mutate: checkLoginId, isPending: false }),
}))

function renderSignUpForm() {
  const router = createMemoryRouter(
    [
      { path: '/signup', element: <SignUpForm /> },
      { path: '/onboarding', element: <div>온보딩 화면</div> },
      { path: '/login', element: <div>로그인 화면</div> },
    ],
    { initialEntries: ['/signup'] },
  )

  render(<RouterProvider router={router} />)
  return router
}

// 회원가입 버튼이 열릴 때까지 필요한 입력과 인증 단계를 모두 통과시킵니다.
async function fillValidForm() {
  const user = userEvent.setup()

  await user.type(screen.getByLabelText('이름'), '김돈워리')

  await user.type(screen.getByLabelText('아이디'), 'donworry1')
  await user.click(screen.getByRole('button', { name: '중복확인' }))

  await user.type(screen.getByLabelText('이메일'), 'don@worry.com')
  await user.click(screen.getByRole('button', { name: '인증하기' }))

  await user.type(screen.getByLabelText('인증번호'), '123456')
  await user.click(screen.getByRole('button', { name: '확인' }))

  await user.type(screen.getByLabelText('비밀번호'), 'password1!')
  await user.type(screen.getByLabelText('비밀번호 확인'), 'password1!')
  await user.type(screen.getByLabelText('전화번호'), '010-1234-5678')

  const submit = screen.getByRole('button', { name: '회원가입' })
  await waitFor(() => expect(submit).toBeEnabled())
  await user.click(submit)
}

describe('SignUpForm', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    checkLoginId.mockImplementation((_id, { onSuccess }) =>
      onSuccess({ data: { available: true } }),
    )
    checkEmail.mockImplementation((_email, { onSuccess }) =>
      onSuccess({ data: { available: true } }),
    )
    sendEmail.mockImplementation((_body, { onSuccess }) =>
      onSuccess({ data: { codeTtlSeconds: 300, resendCooldownSeconds: 60 } }),
    )
    confirmEmail.mockImplementation((_body, { onSuccess }) =>
      onSuccess({ data: { emailVerificationToken: 'verification-token' } }),
    )
    signup.mockImplementation((_body, { onSuccess }) => onSuccess())
  })

  it('가입에 성공하면 자동 로그인 후 온보딩으로 이동한다', async () => {
    login.mockResolvedValue({ data: { accessToken: 'access', refreshToken: 'refresh' } })
    const router = renderSignUpForm()

    await fillValidForm()

    expect(await screen.findByText('온보딩 화면')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/onboarding')
    // 온보딩은 보호 라우트이므로 세션이 저장돼 있어야 진입할 수 있습니다.
    expect(getAccessToken()).toBe('access')
    expect(login).toHaveBeenCalledWith({ loginId: 'donworry1', password: 'password1!' })
  })

  it('가입 후 자동 로그인이 실패하면 안내와 함께 로그인 화면으로 보낸다', async () => {
    login.mockRejectedValue(new Error('network'))
    const router = renderSignUpForm()

    await fillValidForm()

    expect(await screen.findByText('로그인 화면')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
    expect(router.state.location.state).toEqual({
      notice: '회원가입이 완료되었습니다. 로그인 후 설정을 이어가주세요.',
    })
    expect(getAccessToken()).toBeNull()
  })

  it('가입 자체가 실패하면 이동하지 않고 오류를 안내한다', async () => {
    signup.mockImplementation((_body, { onError }) => onError(new Error('boom')))
    const router = renderSignUpForm()

    await fillValidForm()

    await waitFor(() => expect(screen.getByText('회원가입에 실패했습니다.')).toBeInTheDocument())
    expect(router.state.location.pathname).toBe('/signup')
    expect(login).not.toHaveBeenCalled()
  })
})
