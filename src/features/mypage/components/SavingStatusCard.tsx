import styles from './SavingStatusCard.module.css'

interface SavingStatusCardProps {
  totalAttemptCount: number
  skipped: { amount: number; count: number }
  consumed: { amount: number; count: number }
  goalAchievement: {
    status: 'NOT_SET' | 'IN_PROGRESS' | 'ACHIEVED'
    achievementRate: number
    remainingAmount: number | null
  }
}

export default function SavingStatusCard({
  totalAttemptCount,
  skipped,
  consumed,
  goalAchievement,
}: SavingStatusCardProps) {
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

      <hr className={styles.divider} />

      <div className={styles.goalHeader}>
        <span className={styles.goalTitle}>🎯 절약 목표</span>

        <span className={styles.goalPercent}>
          {goalAchievement.status === 'NOT_SET'
            ? '목표 미설정'
            : `${goalAchievement.achievementRate}% 달성`}
        </span>
      </div>

      <div className={styles.progress}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.min(100, goalAchievement.achievementRate)}%` }}
        />
      </div>

      <p className={styles.remain}>
        {goalAchievement.status === 'NOT_SET'
          ? '마이페이지에서 목표 금액을 설정해보세요.'
          : `${(goalAchievement.remainingAmount ?? 0).toLocaleString('ko-KR')}원 남았어요!`}
      </p>
    </div>
  )
}
