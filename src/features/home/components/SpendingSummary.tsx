import styles from './SpendingSummary.module.css'

interface SpendingSummaryProps {
  monthlySpending: number
  comparisonPercent: number
}

export default function SpendingSummary({ monthlySpending, comparisonPercent }: SpendingSummaryProps) {
  const comparisonLabel = `${comparisonPercent > 0 ? '+' : ''}${comparisonPercent}%`

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <p className={styles.label}>이번 달 지출</p>
        <p className={styles.amountRed}>{monthlySpending.toLocaleString()}원</p>
        <p className={styles.sub}>지난 달보다 {comparisonLabel}</p>
      </div>

      <div className={styles.card}>
        <p className={styles.label}>남은 예산</p>
        <p className={styles.amountBlue}>150,000원</p>
        <p className={styles.sub}>목표까지 남았어요</p>
      </div>
    </div>
  )
}
