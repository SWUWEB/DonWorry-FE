import { useState } from 'react'
import Button from '@/shared/components/Button'
import InputField from '@/shared/components/InputField'
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
        <InputField
          label="목표 금액"
          placeholder="금액을 입력하세요"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
          rightElement={<span className={styles.unit}>원</span>}
        />
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

      <Button onClick={handleSave}>
        저장하기
      </Button>
    </section>
  )
}