import { formatKRW } from '@/shared/utils/currency'
import styles from './BudgetCard.module.css'

type BudgetCardProps = {
  remainingAmount: number | null
  usageRate: number | null
  isLoading?: boolean
  isError?: boolean
}

export default function BudgetCard({
  remainingAmount,
  usageRate,
  isLoading = false,
  isError = false,
}: BudgetCardProps) {
  const statusMessage = isLoading
    ? '불러오는 중...'
    : isError
      ? '예산 정보를 불러오지 못했습니다.'
      : '이번 달 예산을 설정해주세요.'

  return (
    <section className={styles.card}>
      <div>
        <p className={styles.label}>이번 달 남은 금액</p>
        {remainingAmount === null || isLoading || isError ? (
          <p className={styles.status}>{statusMessage}</p>
        ) : (
          <h2 className={styles.amount}>{formatKRW(remainingAmount)}</h2>
        )}
      </div>

      {usageRate !== null && !isLoading && !isError && (
        <div className={styles.badge}>사용률 {usageRate}%</div>
      )}
    </section>
  )
}
