import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { LoginResponse } from '@/api/auth'
import InputField from '@/shared/components/InputField'
import Button from '@/shared/components/Button'
import { useKakaoLink } from '@/hooks/useKakaoLink'
import { useKakaoLinkEmail } from '@/hooks/useKakaoLinkEmail'
import { useConfirmKakaoLinkEmail } from '@/hooks/useConfirmKakaoLinkEmail'
import { saveAuthSession } from '@/shared/auth/session'
import { getKakaoAuthorizeUrl } from './kakaoOAuth'
import { getKakaoLinkErrorMessage } from './kakaoErrors'
import ErrorMessage from './components/ErrorMessage'
import LoginHeader from './components/LoginHeader'
import styles from './Login.module.css'
import linkStyles from './KakaoLink.module.css'

type VerificationMethod = 'PASSWORD' | 'EMAIL'

interface KakaoLinkState {
  linkingToken: string
  verificationMethods: VerificationMethod[]
}

function isKakaoLinkState(value: unknown): value is KakaoLinkState {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as KakaoLinkState).linkingToken === 'string'
  )
}

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// resetKey가 바뀔 때마다 seconds 값부터 다시 세는 카운트다운입니다.
// (재전송 시 서버가 이전과 "같은" codeTtlSeconds/resendCooldownSeconds를 내려주면 값 자체는
// 안 바뀌므로, seconds를 effect 의존성으로 쓰면 리셋이 안 됩니다. 매 전송마다 고유한
// resetKey(타임스탬프)를 넘겨서 값이 같아도 항상 리셋되도록 합니다.)
function useCountdown(seconds: number, active: boolean, resetKey: number): number {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(seconds)
    // seconds는 resetKey와 함께 갱신되는 값이라 의도적으로 의존성에서 제외합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  useEffect(() => {
    if (!active) return
    const timer = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [active])

  return remaining
}

export default function KakaoLink() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = isKakaoLinkState(location.state) ? location.state : null

  const methods = state?.verificationMethods ?? []
  const [method, setMethod] = useState<VerificationMethod | null>(methods[0] ?? null)

  const { mutate: linkWithPassword, isPending: isLinkingPassword } = useKakaoLink()
  const { mutate: sendLinkEmail, isPending: isSendingEmail } = useKakaoLinkEmail()
  const { mutate: confirmLinkEmail, isPending: isConfirmingEmail } = useConfirmKakaoLinkEmail()

  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [emailSentTo, setEmailSentTo] = useState('')
  const [codeTtlSeconds, setCodeTtlSeconds] = useState(0)
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0)
  const [sentAt, setSentAt] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [sessionExpired, setSessionExpired] = useState(false)

  const codeRemaining = useCountdown(codeTtlSeconds, Boolean(emailSentTo), sentAt)
  const resendRemaining = useCountdown(resendCooldownSeconds, Boolean(emailSentTo), sentAt)

  useEffect(() => {
    // 콜백을 거치지 않고 직접 들어온 경우처럼 연결 정보가 없으면 로그인으로 되돌립니다.
    if (!state) navigate('/login', { replace: true })
  }, [state, navigate])

  if (!state) return null

  const { linkingToken } = state

  const handleLoginSuccess = (response: LoginResponse) => {
    saveAuthSession(response.data)
    navigate('/', { replace: true })
  }

  const handleLinkError = (error: unknown) => {
    const { message, expired } = getKakaoLinkErrorMessage(error)
    setErrorMessage(message)
    setSessionExpired(expired)
  }

  const handleRestartKakaoLogin = () => {
    try {
      window.location.href = getKakaoAuthorizeUrl()
    } catch {
      setErrorMessage('카카오 로그인을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  const handlePasswordSubmit = () => {
    if (!password.trim()) {
      setErrorMessage('비밀번호를 입력해주세요.')
      return
    }
    setErrorMessage('')

    linkWithPassword(
      { linkingToken, password },
      { onSuccess: handleLoginSuccess, onError: handleLinkError },
    )
  }

  const handleSendEmail = () => {
    setErrorMessage('')

    sendLinkEmail(
      { linkingToken },
      {
        onSuccess: (response) => {
          setEmailSentTo(response.data.email)
          setCodeTtlSeconds(response.data.codeTtlSeconds)
          setResendCooldownSeconds(response.data.resendCooldownSeconds)
          setSentAt(Date.now())
          setCode('')
        },
        onError: handleLinkError,
      },
    )
  }

  const handleConfirmEmail = () => {
    if (!code.trim()) {
      setErrorMessage('인증번호를 입력해주세요.')
      return
    }
    setErrorMessage('')

    confirmLinkEmail(
      { linkingToken, code },
      { onSuccess: handleLoginSuccess, onError: handleLinkError },
    )
  }

  return (
    <main className={styles.container}>
      <div className={styles.authWrapper}>
        <LoginHeader
          className={styles.topSection}
          title="계정 연결"
          description={
            '이미 같은 이메일로 가입된 계정이 있어요.\n본인 확인 후 카카오 계정과 연결할게요.'
          }
        />

        <section className={styles.card}>
          {sessionExpired || !method ? (
            <>
              <ErrorMessage
                message={errorMessage || '본인 확인 방법을 확인할 수 없습니다. 다시 시도해주세요.'}
              />
              <Button onClick={handleRestartKakaoLogin}>카카오 로그인 다시 시작하기</Button>
            </>
          ) : (
            <>
              {methods.length > 1 && (
                <div className={linkStyles.methodTabs}>
                  <Button
                    variant={method === 'PASSWORD' ? 'filled' : 'outline'}
                    fullWidth={false}
                    onClick={() => {
                      setMethod('PASSWORD')
                      setErrorMessage('')
                    }}
                  >
                    비밀번호로 연결
                  </Button>
                  <Button
                    variant={method === 'EMAIL' ? 'filled' : 'outline'}
                    fullWidth={false}
                    onClick={() => {
                      setMethod('EMAIL')
                      setErrorMessage('')
                    }}
                  >
                    이메일 인증으로 연결
                  </Button>
                </div>
              )}

              {method === 'PASSWORD' && (
                <>
                  <InputField
                    label="비밀번호"
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setErrorMessage('')
                    }}
                  />
                  <Button onClick={handlePasswordSubmit} disabled={isLinkingPassword}>
                    {isLinkingPassword ? '연결 중...' : '연결하기'}
                  </Button>
                </>
              )}

              {method === 'EMAIL' &&
                (emailSentTo ? (
                  <>
                    <p className={linkStyles.emailSentText}>
                      {emailSentTo}로 인증번호를 보냈어요.{' '}
                      {codeRemaining > 0
                        ? `${formatSeconds(codeRemaining)} 후 만료`
                        : '인증번호가 만료됐어요. 재전송해주세요.'}
                    </p>
                    <InputField
                      label="인증번호"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="인증번호 6자리"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                        setErrorMessage('')
                      }}
                    />
                    <Button
                      onClick={handleConfirmEmail}
                      disabled={isConfirmingEmail || codeRemaining <= 0}
                    >
                      {isConfirmingEmail ? '확인 중...' : '확인'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSendEmail}
                      disabled={isSendingEmail || resendRemaining > 0}
                    >
                      {resendRemaining > 0
                        ? `인증번호 재전송 (${resendRemaining}초 후 가능)`
                        : '인증번호 재전송'}
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleSendEmail} disabled={isSendingEmail}>
                    {isSendingEmail ? '발송 중...' : '인증번호 받기'}
                  </Button>
                ))}

              {errorMessage && <ErrorMessage message={errorMessage} />}
            </>
          )}
        </section>
      </div>
    </main>
  )
}
