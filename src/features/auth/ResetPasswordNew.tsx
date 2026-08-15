import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import InputField from '@/shared/components/InputField'
import Button from '@/shared/components/Button'
import AuthLayout from './components/AuthLayout'
import AuthPageHeader from './components/AuthPageHeader'
import { clearResetPasswordDraft, getResetPasswordDraft } from './resetPasswordSession'

const isValidPassword = (value: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(value)

export default function ResetPasswordNew() {
  const navigate = useNavigate()
  const draft = getResetPasswordDraft()

  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [error, setError] = useState('')

  // 이메일 인증을 거치지 않고 바로 들어오면 재설정 요청 화면으로 돌려보냅니다.
  if (!draft.email || !draft.codeVerified) {
    return <Navigate to="/reset-password" replace />
  }

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

    // TODO: API 연동 시 실제 비밀번호 변경 요청으로 교체
    setError('')
    clearResetPasswordDraft()
    navigate('/login')
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
