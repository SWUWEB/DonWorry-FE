import styles from './GoalProgress.module.css'

const CURRENT = 350000
const GOAL = 500000
const PERCENT = Math.round((CURRENT / GOAL) * 100)

function formatKRW(amount: number) {
  return amount.toLocaleString('ko-KR') + '원'
}

export default function GoalProgress() {
  return (
    <section className={styles.section}>
      <p className={styles.sectionLabel}>목표 달성률</p>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>이번 달 절약 목표</span>
          <span className={styles.badge}>{PERCENT}% 달성</span>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressBar}
            style={{ width: `${PERCENT}%` }}
          />
        </div>

        <div className={styles.amounts}>
          <span className={styles.amount}>{formatKRW(CURRENT)}</span>
          <span className={styles.amount}>목표 {formatKRW(GOAL)}</span>
        </div>

        <p className={styles.remaining}>
          목표까지 {formatKRW(GOAL - CURRENT)} 남았어요
        </p>
      </div>
    </section>
  )
}
