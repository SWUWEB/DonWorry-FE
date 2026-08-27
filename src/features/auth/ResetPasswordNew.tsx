import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import InputField from '@/shared/components/InputField'
import Button from '@/shared/components/Button'
import AuthLayout from './components/AuthLayout'
import AuthPageHeader from './components/AuthPageHeader'
import { clearResetPasswordDraft, getResetPasswordDraft } from './resetPasswordSession'
import { usePasswordResetConfirm } from '@/hooks/usePasswordResetConfirm'
import { isAxiosError } from 'axios'

// 백엔드는 특정 특수문자 목록이 아니라 "영문/숫자가 아닌 문자"면 뭐든 허용합니다.
// 특정 목록으로 제한하면 백엔드는 받아줄 비밀번호를 프론트가 먼저 막게 됩니다.
const isValidPassword = (value: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,100}$/.test(value)

export default function ResetPasswordNew() {
  const navigate = useNavigate()
  const { mutate: confirmPasswordReset } = usePasswordResetConfirm()

  // 마운트 시 1회만 읽습니다. 매 렌더마다 새로 읽으면, 제출 성공 후 draft를 지운 뒤
  // (목적지 라우트가 lazy라 전환이 비동기라서) 언마운트 전에 한 번 더 렌더될 때
  // 가드가 빈 draft를 보고 navigate('/login')을 덮어쓰며 여기로 되돌아오는 문제가 있었습니다.
  const [draft] = useState(() => getResetPasswordDraft())

  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [error, setError] = useState('')

  // 이메일 인증을 거치지 않고 바로 들어오면 재설정 요청 화면으로 돌려보냅니다.
  if (!draft.email || !draft.code || !draft.codeVerified) {
    return <Navigate to="/reset-password" replace />
  }

  const { email, code } = draft

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!isValidPassword(password)) {
      setError('영문, 숫자, 특수문자를 조합해 8자 이상 입력해주세요.')
      return
    }

    if (password !== passwordCheck) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    confirmPasswordReset(
      {
        email,
        code,
        newPassword: password,
        newPasswordConfirm: passwordCheck,
      },
      {
        onSuccess: () => {
          clearResetPasswordDraft()
          navigate('/login')
        },

        onError: (error: unknown) => {
          if (!isAxiosError<{ message?: string; retryAfterSeconds?: number }>(error)) {
            setError('비밀번호 변경에 실패했습니다.')
            return
          }

          const body = error.response?.data
          const base = body?.message ?? '비밀번호 변경에 실패했습니다.'

          setError(
            error.response?.status === 429 && body?.retryAfterSeconds
              ? `${base} (${body.retryAfterSeconds}초 후 다시 시도해주세요.)`
              : base,
          )
        },
      },
    )
  }

  return (
    <AuthLayout
      header={
        <AuthPageHeader title="비밀번호 재설정" description="새로운 비밀번호를 입력해주세요." />
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <InputField
          label="새 비밀번호"
          placeholder="영문, 숫자, 특수문자 조합 8자 이상"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setError('')
          }}
        />

        <InputField
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력해주세요"
          type="password"
          value={passwordCheck}
          onChange={(event) => {
            setPasswordCheck(event.target.value)
            setError('')
          }}
          error={error}
        />

        <Button type="submit">비밀번호 변경</Button>
      </form>
    </AuthLayout>
  )
}
