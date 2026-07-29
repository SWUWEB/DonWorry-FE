import { useState } from 'react'
import {
  IoEyeOutline,
  IoEyeOffOutline,
} from 'react-icons/io5'

import styles from './ChangePasswordForm.module.css'

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <form className={styles.form}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>
          현재 비밀번호
        </label>

        <div className={styles.inputWrapper}>
          <input
            type={showCurrent ? 'text' : 'password'}
            className={styles.input}
            placeholder="현재 비밀번호를 입력하세요"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowCurrent(!showCurrent)}
            aria-label="현재 비밀번호 표시"
          >
            {showCurrent ? (
              <IoEyeOffOutline size={16} />
            ) : (
              <IoEyeOutline size={16} />
            )}
          </button>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          새 비밀번호
        </label>

        <div className={styles.inputWrapper}>
          <input
            type={showNew ? 'text' : 'password'}
            className={styles.input}
            placeholder="새 비밀번호를 입력하세요"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowNew(!showNew)}
            aria-label="새 비밀번호 표시"
          >
            {showNew ? (
              <IoEyeOffOutline size={16} />
            ) : (
              <IoEyeOutline size={16} />
            )}
          </button>
        </div>

        <p className={styles.helper}>
          영문, 숫자, 특수문자 포함 8~16자
        </p>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          새 비밀번호 확인
        </label>

        <div className={styles.inputWrapper}>
          <input
            type={showConfirm ? 'text' : 'password'}
            className={styles.input}
            placeholder="새 비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label="새 비밀번호 확인 표시"
          >
            {showConfirm ? (
              <IoEyeOffOutline size={16} />
            ) : (
              <IoEyeOutline size={16} />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className={styles.submitButton}
      >
        변경하기
      </button>
    </form>
  )
}