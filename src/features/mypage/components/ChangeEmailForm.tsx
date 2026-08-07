import { useState } from 'react'
import { HiOutlineCheckCircle, HiOutlineArrowPath } from 'react-icons/hi2'

import Button from '@/shared/components/Button'
import InputField from '@/shared/components/InputField'

import styles from './ChangeEmailForm.module.css'

export default function ChangeEmailForm() {
  const currentEmail = '00012@gmail.com'

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const isVerificationSent = false
  const isExpired = false

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
        <InputField
          label="새 이메일 입력"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="이메일 인증"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          autoComplete="one-time-code"
          placeholder="인증번호 6자리"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          rightElement={isExpired && <span className={styles.expireText}>만료됨</span>}
          helper={isVerificationSent ? '인증번호가 이메일로 발송되었습니다.' : undefined}
        />
      </div>

      <div className={styles.noticeBox}>
        <ul>
          <li>인증 메일이 오지 않았나요?</li>
          <li>스팸함을 확인해주세요.</li>
          <li>5분 후 재발송 가능합니다.</li>
        </ul>
      </div>

      <button
        type="button"
        className={styles.resendButton}
      >
        <HiOutlineArrowPath size={16} />
        인증번호 재발송
      </button>

      <div className={styles.buttonWrapper}>
        <Button>
          저장하기
        </Button>
      </div>
    </section>
  )
}