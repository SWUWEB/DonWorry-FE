import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '@/shared/components/InputField'
import Button from '@/shared/components/Button'
import AuthLayout from './components/AuthLayout'
import AuthPageHeader from './components/AuthPageHeader'
import { saveResetPasswordDraft } from './resetPasswordSession'

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export default function ResetPasswordRequest() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }

    // TODO: API 연동 시 실제 일회용 코드 발송 요청으로 교체
    saveResetPasswordDraft({ email, codeVerified: false })
    navigate('/reset-password/verify')
  }

  return (
    <AuthLayout
      header={
        <AuthPageHeader
          title="비밀번호 재설정"
          description="이메일로 일회용 재설정 코드를 전송해드려요."
        />
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <InputField
          label="이메일"
          placeholder="이메일을 입력해주세요"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setError('')
          }}
          error={error}
        />

        <Button type="submit">일회용 코드 전송</Button>
      </form>

      <p className="m-0 mt-1 text-center text-sm text-text-primary">
        아이디가 기억나지 않으시나요?{' '}
        <Link to="/find-id" className="font-semibold text-main-500 no-underline">
          아이디 찾기
        </Link>
      </p>
    </AuthLayout>
  )
}
