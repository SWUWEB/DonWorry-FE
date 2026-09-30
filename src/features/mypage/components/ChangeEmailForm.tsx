import { HiOutlineCheckCircle } from 'react-icons/hi2'
import { useState, type FormEvent } from 'react'

import Button from '@/shared/components/Button'
import InputField from '@/shared/components/InputField'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { isUnauthorizedError } from '@/shared/utils/isUnauthorizedError'
import { useChangeEmail, useMe, useSendEmailChangeCode } from '../hooks/useUser'
import { useCountdown } from '@/shared/hooks/useCountdown'
import { getApiErrorMessage, getRetryAfterSeconds } from '@/shared/utils/apiError'

import styles from './ChangeEmailForm.module.css'

interface ChangeEmailFormProps {
  onUnauthorized?: () => void
}

export default function ChangeEmailForm({ onUnauthorized = () => {} }: ChangeEmailFormProps) {
  const { data: profile, isLoading, isError, error, refetch } = useMe()
  const sendCode = useSendEmailChangeCode()
  const changeEmail = useChangeEmail()
  const resend = useCountdown()
  const expiry = useCountdown()
  const confirmRetry = useCountdown()
  const [newEmail, setNewEmail] = useState('')
  const [sentEmail, setSentEmail] = useState('')
  const [code, setCode] = useState('')
  const [formError, setFormError] = useState('')
  const [saved, setSaved] = useState(false)
  const [mutationUnauthorized, setMutationUnauthorized] = useState(false)
  const isUnauthorized = isUnauthorizedError(error) || mutationUnauthorized
  const busy = sendCode.isPending || changeEmail.isPending
  const normalizedEmail = newEmail.trim()
  const canConfirm =
    sentEmail !== '' && sentEmail === normalizedEmail && expiry.remainingSeconds > 0

  const handleSend = () => {
    if (busy || !profile || resend.remainingSeconds > 0) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setFormError('올바른 이메일을 입력해주세요.')
      return
    }
    if (normalizedEmail.toLowerCase() === profile.email.toLowerCase()) {
      setFormError('현재 이메일과 다른 이메일을 입력해주세요.')
      return
    }
    setFormError('')
    setSaved(false)
    sendCode.mutate(
      { newEmail: normalizedEmail },
      {
        onSuccess: (result) => {
          setSentEmail(result.newEmail)
          setNewEmail(result.newEmail)
          setCode('')
          expiry.start(result.codeTtlSeconds)
          resend.start(result.resendCooldownSeconds)
        },
        onError: (err) => {
          setMutationUnauthorized(isUnauthorizedError(err))
          setFormError(getApiErrorMessage(err, '인증번호를 보내지 못했습니다. 다시 시도해주세요.'))
          resend.start(getRetryAfterSeconds(err))
        },
      },
    )
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (busy || !profile || confirmRetry.remainingSeconds > 0) return
    if (!canConfirm) {
      setFormError('변경할 이메일로 인증번호를 요청해주세요.')
      return
    }
    if (!/^\d{6}$/.test(code)) {
      setFormError('인증번호 6자리를 입력해주세요.')
      return
    }
    setFormError('')
    changeEmail.mutate(
      { newEmail: sentEmail, code },
      {
        onSuccess: () => {
          setSaved(true)
          setSentEmail('')
          setNewEmail('')
          setCode('')
          expiry.start(0)
        },
        onError: (err) => {
          setMutationUnauthorized(isUnauthorizedError(err))
          setFormError(getApiErrorMessage(err, '이메일을 변경하지 못했습니다. 다시 시도해주세요.'))
          confirmRetry.start(getRetryAfterSeconds(err))
        },
      },
    )
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.currentEmailCard}>
          <div>
            <p className={styles.cardLabel}>현재 이메일</p>
            <p className={styles.currentEmail}>
              {isLoading ? '불러오는 중...' : (profile?.email ?? '확인할 수 없음')}
            </p>
          </div>

          {profile?.email && <HiOutlineCheckCircle size={20} className={styles.checkIcon} />}
        </div>

        {isError && !isUnauthorized && (
          <div className={styles.errorRow}>
            <p className={styles.errorText} role="alert">
              현재 이메일을 불러오지 못했습니다.
            </p>
            <button
              type="button"
              className={styles.retryButton}
              disabled={busy}
              onClick={() => refetch()}
            >
              다시 시도
            </button>
          </div>
        )}

        <div className={styles.inputGroup}>
          <InputField
            label="새 이메일"
            type="email"
            autoComplete="email"
            maxLength={255}
            value={newEmail}
            readOnly={busy || !profile}
            onChange={(event) => {
              setNewEmail(event.target.value)
              setSentEmail('')
              setCode('')
              expiry.start(0)
              setFormError('')
              setSaved(false)
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSend}
            disabled={busy || !profile || !normalizedEmail || resend.remainingSeconds > 0}
          >
            {sendCode.isPending
              ? '발송 중...'
              : resend.remainingSeconds > 0
                ? `${resend.remainingSeconds}초 후 재전송`
                : '인증번호 받기'}
          </Button>
        </div>

        {sentEmail && (
          <div className={styles.inputGroup}>
            <p className={styles.expireText} role="status">
              {expiry.remainingSeconds > 0
                ? `${sentEmail}로 인증번호를 보냈습니다. 남은 시간 ${expiry.remainingSeconds}초`
                : '인증번호가 만료되었습니다. 다시 요청해주세요.'}
            </p>
            <InputField
              label="인증번호"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              readOnly={busy}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, ''))
                setFormError('')
              }}
            />
          </div>
        )}
        {formError && (
          <p className={styles.errorText} role="alert">
            {formError}
          </p>
        )}
        {saved && <p role="status">이메일이 변경되었습니다.</p>}
        <div className={styles.buttonWrapper}>
          <Button
            type="submit"
            disabled={
              busy ||
              !profile ||
              !canConfirm ||
              code.length !== 6 ||
              confirmRetry.remainingSeconds > 0
            }
          >
            {changeEmail.isPending
              ? '변경 중...'
              : confirmRetry.remainingSeconds > 0
                ? `${confirmRetry.remainingSeconds}초 후 다시 시도`
                : '이메일 변경'}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={isUnauthorized}
        title="로그인이 필요합니다."
        description="로그인 후 다시 이용해주세요."
        confirmText="로그인하기"
        onlyConfirm
        onCancel={onUnauthorized}
        onConfirm={onUnauthorized}
      />
    </>
  )
}
