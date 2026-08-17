import { Link, useNavigate } from 'react-router-dom'
import InputField from '@/shared/components/InputField'
import Button from '@/shared/components/Button'
import { useRef, useState } from 'react'
import styles from './SignUpForm.module.css'
import ErrorMessage from './ErrorMessage'
import { useSignup } from '@/hooks/useSignup'
import { useSendVerificationEmail } from '@/hooks/useSendVerificationEmail'
import { useConfirmVerificationEmail } from '@/hooks/useConfirmVerificationEmail'
import { useCheckEmail } from '@/hooks/useCheckEmail'
import { isAxiosError } from 'axios'

// 서버 오류 응답에서 사용자에게 보여줄 문구를 뽑아냅니다.
// 400: 필드 단위 검증 메시지, 409: 이메일 중복, 429: 재시도까지 남은 시간 안내
function getErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback

  const status = error.response?.status
  const data = error.response?.data as
    | {
        message?: string
        retryAfterSeconds?: number
        errors?: { fieldErrors?: Record<string, string[]> }
      }
    | undefined

  if (status === 400) {
    // 400의 message는 "Invalid request"처럼 그대로 노출하기 어려운 값이라
    // fieldErrors(email/code 등 어느 필드든)의 안내 문구를 우선 사용합니다.
    const fieldMessage = Object.values(data?.errors?.fieldErrors ?? {})
      .flat()
      .find((message) => Boolean(message))

    return fieldMessage ?? fallback
  }

  if (status === 409) {
    return '이미 사용 중인 이메일입니다.'
  }

  if (status === 429) {
    const retryAfter = data?.retryAfterSeconds
    const base = data?.message ?? '요청이 너무 잦습니다. 잠시 후 다시 시도해주세요.'
    return retryAfter ? `${base}\n\n${retryAfter}초 후 다시 시도해주세요.` : base
  }

  return fallback
}

export default function SignUpForm() {
  const navigate = useNavigate()
  const { mutate, isPending: isSubmitting } = useSignup()
  const { mutate: sendEmail, isPending: isSendingEmail } = useSendVerificationEmail()
  const { mutate: confirmEmail, isPending: isConfirmingEmail } = useConfirmVerificationEmail()
  const { mutate: checkEmail, isPending: isCheckingEmail } = useCheckEmail()

  const [name, setName] = useState('')
  const [id, setId] = useState('')

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [verificationToken, setVerificationToken] = useState('')
  const [isEmailAvailable, setIsEmailAvailable] = useState(false)
  // 진행 중인 요청의 응답이 현재 입력값 기준으로 유효한지 판단하기 위한 최신 이메일
  const latestEmailRef = useRef(email)

  // 서버 응답 안내를 입력칸 아래에 표시하기 위한 상태
  type FieldStatus = { type: 'success' | 'error'; message: string } | null
  const [emailStatus, setEmailStatus] = useState<FieldStatus>(null)
  const [codeStatus, setCodeStatus] = useState<FieldStatus>(null)
  const [submitError, setSubmitError] = useState('')

  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')

  const [phone, setPhone] = useState('')

  const isValidId = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/.test(id)
  const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password)
  const isPasswordMatch = password === passwordCheck
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPhone = /^(01[016789])-?\d{3,4}-?\d{4}$/.test(phone)

  const canSubmit =
    name.trim() !== '' &&
    isValidId &&
    isValidEmail &&
    isValidPassword &&
    isPasswordMatch &&
    isValidPhone &&
    verificationToken !== '' &&
    isEmailAvailable

  const handleSubmit = () => {
    if (!canSubmit) return
    setSubmitError('')

    mutate(
      {
        name,
        loginId: id,
        email,
        emailVerificationToken: verificationToken,
        password,
        passwordConfirm: passwordCheck,
        phoneNumber: phone,
      },
      {
        onSuccess: () => {
          navigate('/onboarding')
        },
        onError: (error) => {
          setSubmitError(getErrorMessage(error, '회원가입에 실패했습니다.'))
        },
      },
    )
  }

  // 중복 확인을 통과한 이메일에만 인증 메일을 보냅니다.
  const handleRequestVerification = () => {
    if (!isValidEmail || isCheckingEmail || isSendingEmail) return

    // 요청이 도는 동안 사용자가 이메일을 바꿀 수 있으므로,
    // 응답이 돌아왔을 때 지금 입력된 이메일과 같을 때만 반영합니다.
    const requestedEmail = email
    const isStale = () => requestedEmail !== latestEmailRef.current
    setEmailStatus(null)

    checkEmail(requestedEmail, {
      onSuccess: (response) => {
        if (isStale()) return

        if (!response.data.available) {
          setIsEmailAvailable(false)
          setEmailStatus({ type: 'error', message: '이미 사용 중인 이메일입니다.' })
          return
        }

        setIsEmailAvailable(true)

        sendEmail(
          { email: requestedEmail },
          {
            onSuccess: (response) => {
              if (isStale()) return

              const { codeTtlSeconds, resendCooldownSeconds } = response.data
              const ttlMinutes = Math.floor(codeTtlSeconds / 60)
              setEmailStatus({
                type: 'success',
                message:
                  `인증 메일을 보냈어요. ${ttlMinutes > 0 ? `${ttlMinutes}분` : `${codeTtlSeconds}초`} 안에 입력해주세요.` +
                  (resendCooldownSeconds ? ` (재발송은 ${resendCooldownSeconds}초 후 가능)` : ''),
              })
            },
            onError: (error) => {
              if (isStale()) return
              setEmailStatus({
                type: 'error',
                message: getErrorMessage(error, '인증 메일 발송에 실패했습니다.'),
              })
            },
          },
        )
      },
      onError: (error) => {
        if (isStale()) return
        setEmailStatus({
          type: 'error',
          message: getErrorMessage(error, '이메일 확인에 실패했습니다. 잠시 후 다시 시도해주세요.'),
        })
      },
    })
  }

  const handleConfirmVerification = () => {
    if (!code.trim() || isConfirmingEmail) return

    const requestedEmail = email
    const isStale = () => requestedEmail !== latestEmailRef.current
    setCodeStatus(null)

    confirmEmail(
      { email: requestedEmail, code },
      {
        onSuccess: (response) => {
          // 이메일이 바뀐 뒤 도착한 토큰은 이전 이메일용이라 저장하지 않습니다.
          if (isStale()) return

          setVerificationToken(response.data.emailVerificationToken)
          setCodeStatus({ type: 'success', message: '이메일 인증이 완료되었습니다.' })
        },
        onError: (error) => {
          if (isStale()) return
          setCodeStatus({
            type: 'error',
            message: getErrorMessage(error, '인증번호가 올바르지 않거나 만료되었습니다.'),
          })
        },
      },
    )
  }

  return (
    <>
      <div className={styles.formField}>
        <InputField
          label="이름"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={styles.formField}>
        <InputField
          label="아이디"
          placeholder="영문, 숫자 조합 6~12자"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        {id.length > 0 && (
          <ErrorMessage
            type={isValidId ? 'success' : 'error'}
            message={
              isValidId ? '올바른 아이디 형식입니다.' : '영문, 숫자 조합 6~12자로 입력해주세요.'
            }
          />
        )}
      </div>

      <div className={styles.inputWithButton}>
        <label htmlFor="email" className={styles.label}>
          이메일
        </label>

        <div className={styles.row}>
          <input
            id="email"
            className={styles.input}
            placeholder="dontworry@google.com"
            value={email}
            onChange={(e) => {
              const nextEmail = e.target.value
              latestEmailRef.current = nextEmail
              setEmail(nextEmail)
              // 이메일이 바뀌면 이전 이메일로 받은 인증 결과는 모두 무효입니다.
              setIsEmailAvailable(false)
              setVerificationToken('')
              setCode('')
              setEmailStatus(null)
              setCodeStatus(null)
              setSubmitError('')
            }}
          />

          <button
            type="button"
            className={styles.smallButton}
            disabled={!isValidEmail || isCheckingEmail || isSendingEmail}
            onClick={handleRequestVerification}
          >
            인증하기
          </button>
        </div>
      </div>

      {email.length > 0 && (
        <ErrorMessage
          type={isValidEmail ? 'success' : 'error'}
          message={isValidEmail ? '올바른 이메일 형식입니다.' : '올바른 이메일 형식이 아닙니다.'}
        />
      )}

      {emailStatus && <ErrorMessage type={emailStatus.type} message={emailStatus.message} />}

      <div className={styles.inputWithButton}>
        <label htmlFor="verificationCode" className={styles.label}>
          인증번호
        </label>

        <div className={styles.row}>
          <input
            id="verificationCode"
            className={styles.input}
            placeholder="인증번호를 입력해주세요"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            type="button"
            className={styles.confirmButton}
            disabled={!code.trim() || isConfirmingEmail}
            onClick={handleConfirmVerification}
          >
            확인
          </button>
        </div>

        {codeStatus && <ErrorMessage type={codeStatus.type} message={codeStatus.message} />}
      </div>

      <div className={styles.formField}>
        <InputField
          label="비밀번호"
          placeholder="영문, 숫자, 특수문자 조합 8자 이상"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {password.length > 0 && (
          <ErrorMessage
            type={isValidPassword ? 'success' : 'error'}
            message={
              isValidPassword ? '올바른 비밀번호입니다.' : '비밀번호가 조건을 만족하지 않습니다.'
            }
          />
        )}
      </div>

      <div className={styles.formField}>
        <InputField
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력해주세요"
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />

        {password.length > 0 && passwordCheck.length > 0 && (
          <ErrorMessage
            type={isPasswordMatch ? 'success' : 'error'}
            message={isPasswordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
          />
        )}
      </div>

      <div className={styles.formField}>
        <InputField
          label="전화번호"
          placeholder="010-0000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {phone.length > 0 && (
          <ErrorMessage
            type={isValidPhone ? 'success' : 'error'}
            message={
              isValidPhone ? '올바른 전화번호 형식입니다.' : '010-0000-0000 형식으로 입력해주세요.'
            }
          />
        )}
      </div>

      {submitError && <ErrorMessage message={submitError} />}

      <div className={styles.buttonGroup}>
        <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
          회원가입
        </Button>
      </div>

      <p className={styles.loginLink}>
        이미 계정이 있으신가요?
        <Link to="/login" className={styles.loginLinkText}>
          로그인
        </Link>
      </p>
    </>
  )
}
