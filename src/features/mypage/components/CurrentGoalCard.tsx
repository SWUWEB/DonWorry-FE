import { formatKRW } from '@/shared/utils/currency'
import styles from './CurrentGoalCard.module.css'

interface CurrentGoalCardProps {
  goalAmount: number
  achievedAmount: number
}
export default function CurrentGoalCard({ goalAmount, achievedAmount }: CurrentGoalCardProps) {
  const progress =
    goalAmount === 0 ? 0 : Math.min(100, Math.max(0, (achievedAmount / goalAmount) * 100))

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>현재 목표 금액</span>
        <span className={styles.amount}>{formatKRW(goalAmount)}</span>
      </div>

      <div className={styles.rateRow}>
        <span className={styles.rateLabel}>목표 달성률</span>
        <span className={styles.rateValue}>{Math.round(progress)}%</span>
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
