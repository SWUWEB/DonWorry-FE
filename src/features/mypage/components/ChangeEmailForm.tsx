import { useState } from 'react'
import { HiOutlineCheckCircle, HiOutlineArrowPath } from 'react-icons/hi2'

import PrimaryButton from '@/features/auth/components/PrimaryButton'

import styles from './ChangeEmailForm.module.css'

export default function ChangeEmailForm() {
  const currentEmail = '00012@gmail.com'

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  return (
    <section className={styles.form}>
      <div className={styles.currentEmailCard}>
        <div>
          <p className={styles.cardLabel}>현재 이메일</p>
          <p className={styles.currentEmail}>{currentEmail}</p>
        </div>

        <HiOutlineCheckCircle
          size={20}
          className={styles.checkIcon}
        />
      </div>

      <div className={styles.inputGroup}>
        <label
          htmlFor="email"
          className={styles.label}
        >
          새 이메일 입력
        </label>

        <input
          id="email"
          className={styles.input}
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label
          htmlFor="code"
          className={styles.label}
        >
          이메일 인증
        </label>

        <div className={styles.codeWrapper}>
          <input
            id="code"
            className={styles.input}
            placeholder="인증번호 6자리"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <span className={styles.expireText}>
            만료됨
          </span>
        </div>

        <p className={styles.helper}>
          인증번호가 이메일로 발송되었습니다.
        </p>
      </div>

      {/* 안내 */}
      <div className={styles.noticeBox}>
        <ul>
          <li>인증 메일이 오지 않았나요?</li>
          <li>스팸함을 확인해주세요.</li>
          <li>5분 후 재발송 가능합니다.</li>
        </ul>
      </div>

      {/* 재발송 */}
      <button
        type="button"
        className={styles.resendButton}
      >
        <HiOutlineArrowPath size={16} />
        인증번호 재발송
      </button>

      <div className={styles.buttonWrapper}>
        <PrimaryButton>
          저장하기
        </PrimaryButton>
      </div>
    </section>
  )
}