import { formatKRW } from '@/shared/utils/currency'
import type { GoalAchievementStatus } from '../types'
import styles from './GoalProgress.module.css'

interface GoalProgressProps {
  goalStatus: GoalAchievementStatus
  achievementRate: number
  remainingAmount: number | null
}

export default function GoalProgress({
  goalStatus,
  achievementRate,
  remainingAmount,
}: GoalProgressProps) {
  const percent = Math.min(100, Math.max(0, achievementRate))

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

      {goalStatus === 'NOT_SET' ? (
        <p className={styles.remaining}>절약 목표를 설정해보세요.</p>
      ) : goalStatus === 'ACHIEVED' ? (
        <p className={styles.remaining}>이번 달 절약 목표를 달성했어요!</p>
      ) : (
        <p className={styles.remaining}>
          목표까지{' '}
          <strong className={styles.remainingAmount}>
            {remainingAmount !== null ? formatKRW(remainingAmount) : ''}
          </strong>{' '}
          남았어요
        </p>
      )}
    </div>
  )
}
