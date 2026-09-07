import { useState } from 'react'
import { isAxiosError } from 'axios'

import Button from '@/shared/components/Button'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import InputField from '@/shared/components/InputField'
import { isUnauthorizedError } from '@/shared/utils/isUnauthorizedError'
import { useChangePassword } from '../hooks/useUser'
import styles from './ChangePasswordForm.module.css'

const isValidPassword = (value: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,100}$/.test(value)

interface ChangePasswordFormProps {
  onUnauthorized?: () => void
}

export default function ChangePasswordForm({ onUnauthorized = () => {} }: ChangePasswordFormProps) {
  const { mutate: changePassword, isPending, error: changePasswordError } = useChangePassword()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!currentPassword.trim()) {
      setError('현재 비밀번호를 입력해주세요.')
      return
    }

    if (!isValidPassword(newPassword)) {
      setError('영문, 숫자, 특수문자 포함 8~100자로 입력해주세요.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.')
      return
    }

    setError('')
    setSaved(false)

    changePassword(
      { currentPassword, newPassword, newPasswordConfirm: confirmPassword },
      {
        onSuccess: () => {
          setSaved(true)
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        },
        onError: (err) => {
          const message = isAxiosError(err)
            ? (err.response?.data as { message?: string } | undefined)?.message
            : undefined

          setError(message ?? '비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.')
        },
      },
    )
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <InputField
            label="현재 비밀번호"
            type="password"
            autoComplete="current-password"
            placeholder="현재 비밀번호를 입력하세요"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value)
              setError('')
              setSaved(false)
            }}
          />
        </div>

        <div className={styles.inputGroup}>
          <InputField
            label="새 비밀번호"
            type="password"
            autoComplete="new-password"
            placeholder="새 비밀번호를 입력하세요"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value)
              setError('')
              setSaved(false)
            }}
            helper="영문, 숫자, 특수문자 포함 8~100자"
          />
        </div>

        <div className={styles.inputGroup}>
          <InputField
            label="새 비밀번호 확인"
            type="password"
            autoComplete="new-password"
            placeholder="새 비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setError('')
              setSaved(false)
            }}
          />
        </div>

        {error && (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        )}
        {saved && <p className={styles.formSuccess}>비밀번호가 변경되었습니다.</p>}

        <div className={styles.submitButtonWrapper}>
          <Button type="submit" disabled={isPending}>
            {isPending ? '변경 중...' : '변경하기'}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={isUnauthorizedError(changePasswordError)}
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
