import { formatKRW } from '@/shared/utils/currency'
import styles from './GoalProgress.module.css'

interface GoalProgressProps {
  goalAmount: number | null
  goalCurrent: number
}

export default function GoalProgress({ goalAmount, goalCurrent }: GoalProgressProps) {
  const rawPercent = goalAmount ? Math.round((goalCurrent / goalAmount) * 100) : 0
  const percent = Math.min(100, rawPercent)
  const isAchieved = rawPercent >= 100

  return (
    <div className={styles.card}>
      <p className={styles.sectionLabel}>목표 달성률</p>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>이번 달 절약 목표</span>
        <span className={styles.badge}>{percent}% 달성</span>
      </div>

      <div className={styles.progressTrackWrap}>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className={styles.progressBar} style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className={styles.amounts}>
        <span className={styles.amount}>{formatKRW(goalCurrent)}</span>
        <span className={styles.amount}>
          {goalAmount ? `목표 ${formatKRW(goalAmount)}` : '목표 미설정'}
        </span>
      </div>

      {goalAmount === null ? (
        <p className={styles.remaining}>절약 목표를 설정해보세요.</p>
      ) : isAchieved ? (
        <p className={styles.remaining}>이번 달 절약 목표를 달성했어요!</p>
      ) : (
        <p className={styles.remaining}>
          목표까지{' '}
          <strong className={styles.remainingAmount}>{formatKRW(goalAmount - goalCurrent)}</strong>{' '}
          남았어요
        </p>
      )}
    </div>
  )
}
