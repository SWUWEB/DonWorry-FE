import { useState } from 'react'
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoWarningOutline,
  IoChevronDown,
} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import styles from './WithdrawForm.module.css'

export default function WithdrawForm() {
  const navigate = useNavigate()

  const [reason, setReason] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <section className={styles.warningBox}>
        <div className={styles.warningHeader}>
          <IoWarningOutline
            size={20}
            className={styles.warningIcon}
          />

          <span className={styles.warningTitle}>
            탈퇴 시 유의사항
          </span>
        </div>

        <ul className={styles.warningList}>
          <li>
            모든 데이터가 삭제되어 복구할 수 없습니다.
          </li>

          <li>
            탈퇴 후 재가입이 불가능합니다.
          </li>

          <li>
            이전 데이터는 복구되지 않습니다.
          </li>
        </ul>
      </section>

      {/* 탈퇴 사유 */}
      <div className={styles.inputGroup}>
        <label
          htmlFor="reason"
          className={styles.label}
        >
          탈퇴 사유
          <span className={styles.optional}>
            (선택)
          </span>
        </label>

        <div className={styles.selectWrapper}>
          <select
            id="reason"
            className={styles.select}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option
              value=""
              disabled
            >
              사유를 선택 해주세요
            </option>

            <option value="unused">
              사용 빈도가 낮아요
            </option>

            <option value="inconvenient">
              서비스 이용이 불편해요
            </option>

            <option value="privacy">
              개인정보가 걱정돼요
            </option>

            <option value="other">
              기타
            </option>
          </select>

          <IoChevronDown
            size={18}
            className={styles.selectIcon}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label
          htmlFor="password"
          className={styles.label}
        >
          비밀번호 확인
        </label>

        <div className={styles.inputWrapper}>
          <input
            id="password"
            type={
              showPassword
                ? 'text'
                : 'password'
            }
            autoComplete="current-password"
            className={styles.input}
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword,)}
            aria-label={
              showPassword
                ? '비밀번호 숨기기'
                : '비밀번호 보기'
            }
          >
            {showPassword ? (
              <IoEyeOffOutline size={18} />
            ) : (
              <IoEyeOutline size={18} />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className={styles.withdrawButton}
      >
        탈퇴하기
      </button>

      <button
        type="button"
        className={styles.cancelButton}
        onClick={() => navigate(-1)}
      >
        취소
      </button>
    </form>
  )
}