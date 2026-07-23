import { useState } from 'react'
import PrimaryButton from '@/features/auth/components/PrimaryButton'
import styles from './GoalSettingCard.module.css'

export default function GoalSettingCard() {
  const [goalAmount, setGoalAmount] = useState('')
  const [showGoal, setShowGoal] = useState(true)

  const handleSave = () => {
    if (!goalAmount.trim()) {
      alert('목표 금액을 입력해주세요.')
      return
    }
    alert('저장되었습니다.')
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>목표 설정</h2>

      <div className={styles.inputGroup}>
        <label htmlFor="goalAmount" className={styles.label}>
          목표 금액
        </label>

        <div className={styles.inputWrapper}>
          <input
            id="goalAmount"
            type="text"
            className={styles.input}
            placeholder="금액을 입력하세요"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
          />
          <span className={styles.unit}>원</span>
        </div>
      </div>

      <div className={styles.toggleSection}>
        <div>
          <p className={styles.toggleTitle}>목표 달성 표시</p>

          <p className={styles.toggleDescription}>
            마이페이지에서 목표 달성률을 표시합니다
          </p>
        </div>

        <button
          type="button"
          className={styles.toggle}
          aria-label="목표 달성 표시"
          onClick={() => setShowGoal(!showGoal)}
        >
          <div className={styles.toggleCircle} />
        </button>
      </div>

      <PrimaryButton onClick={handleSave}>
        저장하기
      </PrimaryButton>
    </section>
  )
}