import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import InputField from '@/shared/components/InputField'
import Button from '@/shared/components/Button'
import AuthLayout from './components/AuthLayout'
import AuthPageHeader from './components/AuthPageHeader'
import InfoBanner from './components/InfoBanner'

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export default function FindId() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sentTo, setSentTo] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }

    setError('')

    // TODO: API 연동 시 실제 아이디 조회/발송 요청으로 교체
    setSentTo(email)
  }

  return (
    <AuthLayout
      header={
        <AuthPageHeader title="아이디 찾기" description="가입한 이메일로 아이디를 전송해드려요." />
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
            setSentTo('')
          }}
          error={error}
        />

        {sentTo && (
          <InfoBanner message="입력하신 이메일로 아이디를 전송했습니다. 이메일을 확인해주세요." />
        )}

        <Button type="submit">아이디 전송</Button>
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
