import { formatKRW } from '@/shared/utils/currency'
import styles from './CurrentGoalCard.module.css'

interface CurrentGoalCardProps {
  goalAmount: number | null
  achievedAmount: number
  achievementRate: number
  isLoading?: boolean
  isError?: boolean
}

export default function CurrentGoalCard({
  goalAmount,
  achievedAmount,
  achievementRate,
  isLoading = false,
  isError = false,
}: CurrentGoalCardProps) {
  if (isLoading || isError || goalAmount === null) {
    const message = isLoading
      ? '목표 현황을 불러오는 중입니다.'
      : isError
        ? '목표 현황을 불러오지 못했습니다.'
        : '설정된 목표 금액이 없습니다.'

    return (
      <section className={styles.card}>
        <span className={styles.title}>현재 목표 금액</span>
        <p className={styles.status}>{message}</p>
      </section>
    )
  }

  const progress = Math.min(100, Math.max(0, achievementRate))

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>현재 목표 금액</span>
        <span className={styles.amount}>{formatKRW(goalAmount)}</span>
      </div>

      <div className={styles.rateRow}>
        <span className={styles.rateLabel}>목표 달성률</span>
        <span className={styles.rateValue}>{progress}%</span>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.amountRow}>
        <span>{formatKRW(achievedAmount)}</span>
        <span>{formatKRW(goalAmount)}</span>
      </div>
    </section>
  )
}
