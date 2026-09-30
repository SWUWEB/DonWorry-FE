import { Link } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import Button from '@/shared/components/Button'
import InputField from '@/shared/components/InputField'
import { useLoginIdRecovery } from '@/hooks/useLoginIdRecovery'
import { useCountdown } from '@/shared/hooks/useCountdown'
import { getApiErrorMessage, getRetryAfterSeconds } from '@/shared/utils/apiError'
import AuthLayout from './components/AuthLayout'
import AuthPageHeader from './components/AuthPageHeader'
import InfoBanner from './components/InfoBanner'

export default function FindId() {
  const { mutate, isPending } = useLoginIdRecovery()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const { remainingSeconds, start } = useCountdown()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (isPending || remainingSeconds > 0) return
    const normalizedEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('올바른 이메일을 입력해주세요.')
      return
    }
    setError('')
    setSent(false)
    mutate(
      { email: normalizedEmail },
      {
        onSuccess: (result) => {
          setSent(true)
          start(result.data.resendCooldownSeconds)
        },
        onError: (err) => {
          setError(getApiErrorMessage(err, '아이디 안내 요청에 실패했습니다. 다시 시도해주세요.'))
          start(getRetryAfterSeconds(err))
        },
      },
    )
  }

  return (
    <AuthLayout
      header={
        <AuthPageHeader title="아이디 찾기" description="가입한 이메일로 아이디를 전송해드려요." />
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <InputField
          label="가입 이메일"
          type="email"
          autoComplete="email"
          maxLength={255}
          value={email}
          readOnly={isPending}
          onChange={(event) => {
            setEmail(event.target.value)
            setError('')
            setSent(false)
          }}
        />
        {error && (
          <p role="alert" className="text-sm text-sub-red">
            {error}
          </p>
        )}
        {sent && (
          <InfoBanner message="입력한 이메일로 아이디 안내를 요청했습니다. 가입된 계정이 있다면 메일을 확인해주세요." />
        )}
        <Button type="submit" disabled={isPending || remainingSeconds > 0}>
          {isPending
            ? '요청 중...'
            : remainingSeconds > 0
              ? `${remainingSeconds}초 후 재전송`
              : '아이디 전송'}
        </Button>
      </form>

      <p className="m-0 mt-1 text-center text-sm text-text-primary">
        비밀번호를 잊으셨나요?{' '}
        <Link to="/reset-password" className="font-semibold text-main-500 no-underline">
          비밀번호 재설정
        </Link>
      </p>
    </AuthLayout>
  )
}
