import styles from './GoalProgress.module.css'

interface GoalProgressProps {
  current: number
  goal: number
}

function formatKRW(amount: number) {
  return amount.toLocaleString('ko-KR') + '원'
}

export default function GoalProgress({ current, goal }: GoalProgressProps) {
  const percent = Math.round((current / goal) * 100)

  return (
    <section className={styles.section}>
      <p className={styles.sectionLabel}>목표 달성률</p>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>이번 달 절약 목표</span>
          <span className={styles.badge}>{percent}% 달성</span>
        </div>

        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div
            className={styles.progressBar}
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className={styles.amounts}>
          <span className={styles.amount}>{formatKRW(current)}</span>
          <span className={styles.amount}>목표 {formatKRW(goal)}</span>
        </div>

        <p className={styles.remaining}>
          목표까지 {formatKRW(goal - current)} 남았어요
        </p>
      </div>
    </section>
  )
}
