import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import InputField from '@/shared/components/InputField'
import Button from '@/shared/components/Button'
import AuthLayout from './components/AuthLayout'
import AuthPageHeader from './components/AuthPageHeader'
import InfoBanner from './components/InfoBanner'
import { getResetPasswordDraft, saveResetPasswordDraft } from './resetPasswordSession'

const CODE_LENGTH = 6

export default function ResetPasswordVerify() {
  const navigate = useNavigate()
  const draft = getResetPasswordDraft()

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [resent, setResent] = useState(false)

  // 이메일 입력 단계를 거치지 않고 바로 들어오면 재설정 요청 화면으로 돌려보냅니다.
  if (!draft.email) {
    return <Navigate to="/reset-password" replace />
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (code.trim().length !== CODE_LENGTH) {
      setError('6자리 코드를 정확히 입력해주세요.')
      return
    }

    // 코드 단독 검증 API가 없어(백엔드가 비밀번호 변경과 함께 원자적으로 검증), 여기서는
    // 형식만 확인하고 코드를 보관해뒀다가 다음 화면에서 새 비밀번호와 함께 제출합니다.
    setError('')
    saveResetPasswordDraft({ code, codeVerified: true })
    navigate('/reset-password/new')
  }

  const handleResend = () => {
    // TODO: API 연동 시 실제 코드 재전송 요청으로 교체
    setResent(true)
  }

  return (
    <AuthLayout
      header={
        <AuthPageHeader
          title="비밀번호 재설정"
          description="이메일로 전송된 6자리 코드를 입력해주세요."
        />
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <InputField label="이메일" value={draft.email} onChange={() => {}} readOnly />

        <InputField
          label="인증 코드"
          placeholder="6자리 코드 입력"
          inputMode="numeric"
          maxLength={CODE_LENGTH}
          value={code}
          onChange={(event) => {
            setCode(event.target.value.replace(/\D/g, ''))
            setError('')
            setResent(false)
          }}
          error={error}
        />

        {resent && <InfoBanner message="인증 코드를 다시 전송했습니다." />}

        <Button type="submit">인증 확인</Button>
      </form>

      <p className="m-0 mt-1 text-center text-sm text-text-primary">
        코드를 받지 못하셨나요?{' '}
        <button
          type="button"
          className="cursor-pointer border-none bg-none p-0 font-sans font-semibold text-main-500"
          onClick={handleResend}
        >
          코드 재전송
        </button>
      </p>
    </AuthLayout>
  )
}
