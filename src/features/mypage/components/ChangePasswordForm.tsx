import { useState } from 'react'

import Button from '@/shared/components/Button'
import InputField from '@/shared/components/InputField'
import styles from './ChangePasswordForm.module.css'

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
     >
      <div className={styles.inputGroup}>
        <InputField
          label="현재 비밀번호"
          type="password"
          autoComplete="current-password"
          placeholder="현재 비밀번호를 입력하세요"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="새 비밀번호"
          type="password"
          autoComplete="new-password"
          placeholder="새 비밀번호를 입력하세요"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          helper="영문, 숫자, 특수문자 포함 8~16자"
        />
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="새 비밀번호 확인"
          type="password"
          autoComplete="new-password"
          placeholder="새 비밀번호를 다시 입력하세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className={styles.submitButtonWrapper}>
        <Button type="submit">
          변경하기
        </Button>
      </div>
    </form>
  )
}
