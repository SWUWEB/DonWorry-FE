import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import LoginForm from './LoginForm'
import { SESSION_EXPIRED_NOTICE } from '@/shared/auth/redirect'
import { getAccessToken } from '@/shared/auth/session'
import type { InitialEntry } from 'react-router-dom'

const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }))

vi.mock('@/hooks/useLogin', () => ({
  useLogin: () => ({ mutate, isPending: false }),
}))

const loginResponse = {
  data: { accessToken: 'new-access', refreshToken: 'new-refresh' },
}

function unauthorizedError() {
  return new AxiosError('Unauthorized', '401', undefined, undefined, {
    status: 401,
    statusText: 'Unauthorized',
    data: {},
    headers: {},
    config: { headers: new AxiosHeaders() },
  })
}

function renderLoginForm(entry: InitialEntry = '/login') {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <LoginForm /> },
      { path: '/', element: <div>홈 화면</div> },
      { path: '/temptation/3', element: <div>위시리스트 상세</div> },
    ],
    { initialEntries: [entry] },
  )

  render(<RouterProvider router={router} />)
  return router
}

async function submitCredentials() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('아이디'), 'donworry1')
  await user.type(screen.getByLabelText('비밀번호'), 'password1!')
  await user.click(screen.getByRole('button', { name: '로그인' }))
}

describe('LoginForm', () => {
  beforeEach(() => {
    localStorage.clear()
    mutate.mockReset()
  })

  it('가드가 넘겨준 안내 문구를 초기에 노출한다', () => {
    renderLoginForm({ pathname: '/login', state: { notice: SESSION_EXPIRED_NOTICE } })

    expect(screen.getByText(SESSION_EXPIRED_NOTICE)).toBeInTheDocument()
  })

  it('로그인에 성공하면 세션을 저장하고 원래 가려던 경로로 돌아간다', async () => {
    mutate.mockImplementation((_vars, { onSuccess }) => onSuccess(loginResponse))
    const router = renderLoginForm({
      pathname: '/login',
      state: { from: '/temptation/3' },
    })

    await submitCredentials()

    expect(await screen.findByText('위시리스트 상세')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/temptation/3')
    expect(getAccessToken()).toBe('new-access')
    // 뒤로가기로 로그인 화면에 다시 걸리지 않도록 replace로 이동합니다.
    expect(router.state.historyAction).toBe('REPLACE')
  })

  it('보존된 경로가 없으면 홈으로 이동한다', async () => {
    mutate.mockImplementation((_vars, { onSuccess }) => onSuccess(loginResponse))
    const router = renderLoginForm()

    await submitCredentials()

    expect(await screen.findByText('홈 화면')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
  })

  it('401이면 자격 증명 오류를 안내하고 이동하지 않는다', async () => {
    mutate.mockImplementation((_vars, { onError }) => onError(unauthorizedError()))
    const router = renderLoginForm({ pathname: '/login', state: { from: '/temptation/3' } })

    await submitCredentials()

    await waitFor(() =>
      expect(screen.getByText('아이디 또는 비밀번호가 올바르지 않습니다.')).toBeInTheDocument(),
    )
    expect(router.state.location.pathname).toBe('/login')
    expect(getAccessToken()).toBeNull()
  })

  it('입력이 비어 있으면 요청을 보내지 않는다', async () => {
    renderLoginForm()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(screen.getByText('아이디를 입력해주세요.')).toBeInTheDocument()
    expect(mutate).not.toHaveBeenCalled()
  })
})
