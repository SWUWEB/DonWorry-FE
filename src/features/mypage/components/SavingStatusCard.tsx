import type { SavingStatus, GoalAchievement } from '../api/consumptionReportApi'
import styles from './SavingStatusCard.module.css'

interface SavingStatusCardProps {
  savingStatus: SavingStatus
  goalAchievement: GoalAchievement
}

export default function SavingStatusCard({ savingStatus, goalAchievement }: SavingStatusCardProps) {
  const { totalAttemptCount, skipped, consumed } = savingStatus
  const { status, achievementRate, savedAmount, remainingAmount } = goalAchievement

  const hasGoal = status !== 'NOT_SET'

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>통합 절약 현황</h2>
        <span className={styles.count}>총 {totalAttemptCount}번의 소비 시도 중</span>
      </div>

      <div className={styles.summary}>
        <div className={styles.leftCard}>
          <p className={styles.label}>참은 소비 (절약액)</p>
          <h3 className={styles.money}>₩ {skipped.amount.toLocaleString('ko-KR')}</h3>
          <span className={styles.desc}>방어 성공 {skipped.count}회</span>
        </div>

        <div className={styles.rightInfo}>
          <p className={styles.label}>실제 지출 금액</p>
          <h3 className={styles.money}>₩ {consumed.amount.toLocaleString('ko-KR')}</h3>
          <span className={styles.desc}>지출 결제 {consumed.count}회</span>
        </div>
      </div>

      {hasGoal && (
        <>
          <hr className={styles.divider} />
          <div className={styles.goalHeader}>
            <span className={styles.goalTitle}>🎯 절약 목표</span>
            <span className={styles.goalPercent}>{achievementRate}% 달성</span>
          </div>
          <div className={styles.progress}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.min(achievementRate, 100)}%` }}
            />
          </div>
          {remainingAmount != null && remainingAmount > 0 && (
            <p className={styles.remain}>{remainingAmount.toLocaleString('ko-KR')}원 남았어요!</p>
          )}
          {(status === 'ACHIEVED' || remainingAmount === 0) && (
            <p className={styles.remain}>목표 달성! 🎉</p>
          )}
        </>
      )}
    </div>
  )
}
