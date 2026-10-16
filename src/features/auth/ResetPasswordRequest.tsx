import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '@/shared/components/InputField'
import Button from '@/shared/components/Button'
import AuthLayout from './components/AuthLayout'
import AuthPageHeader from './components/AuthPageHeader'
import { saveResetPasswordDraft } from './resetPasswordSession'
import { usePasswordResetRequest } from '@/hooks/usePasswordResetRequest'
import { isAxiosError } from 'axios'

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

interface RateLimitErrorBody {
  message?: string
  retryAfterSeconds?: number
}

export default function ResetPasswordRequest() {
  const navigate = useNavigate()
  const { mutate: requestPasswordReset } = usePasswordResetRequest()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }

    requestPasswordReset(
      { email },
      {
        onSuccess: () => {
          saveResetPasswordDraft({
            email,
            codeVerified: false,
          })

          navigate('/reset-password/verify')
        },

        onError: (error: unknown) => {
          console.error(error)

          if (!isAxiosError<RateLimitErrorBody>(error)) {
            setError('비밀번호 재설정 요청에 실패했습니다.')
            return
          }

          const status = error.response?.status

          // 계정 존재 여부를 노출하지 않기 위해 이 API는 이메일이 없어도 항상 200을
          // 반환하도록 설계돼 있어(스펙 설명 참고), 404는 여기서 절대 오지 않습니다.
          // 만에 하나 실제로 온다면 "가입되지 않은 이메일" 같은 문구로 계정 존재 여부를
          // 노출하면 안 되므로 일부러 일반 실패 메시지로 처리합니다.
          if (status === 400) {
            setError('올바른 이메일 형식이 아닙니다.')
          } else if (status === 429) {
            const retry = error.response?.data.retryAfterSeconds
            const base = error.response?.data.message ?? '요청이 너무 잦습니다.'
            setError(retry ? `${base} (${retry}초 후 다시 시도해주세요.)` : base)
          } else {
            setError('비밀번호 재설정 요청에 실패했습니다.')
          }
        },
      },
    )
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
