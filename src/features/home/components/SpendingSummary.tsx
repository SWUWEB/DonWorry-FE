import { useNavigate } from 'react-router-dom'
import { formatKRW } from '@/shared/utils/currency'
import styles from './SpendingSummary.module.css'

interface SpendingSummaryProps {
  monthlySpending: number
  lastMonthSpending: number | null
  budget: number | null
}

function getComparisonLabel(monthlySpending: number, lastMonthSpending: number | null): string | null {
  if (lastMonthSpending === null || lastMonthSpending === 0) return null
  const percent = Math.round(((monthlySpending - lastMonthSpending) / lastMonthSpending) * 100)
  if (percent === 0) return '지난달과 같아요'
  return `지난 달보다 ${percent > 0 ? '+' : ''}${percent}%`
}

function getSpendingTrend(monthlySpending: number, lastMonthSpending: number | null): 'up' | 'down' | 'none' {
  if (lastMonthSpending === null || lastMonthSpending === 0) return 'none'
  if (monthlySpending > lastMonthSpending) return 'up'
  if (monthlySpending < lastMonthSpending) return 'down'
  return 'none'
}

function UpArrowIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M12.8337 4.08334L7.87533 9.04168L4.95866 6.12501L1.16699 9.91668" stroke={color} strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.33301 4.08334H12.833V7.58334" stroke={color} strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DownArrowIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M12.8337 9.91668L7.87533 4.95834L4.95866 7.87501L1.16699 4.08334" stroke={color} strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.33301 9.91666H12.833V6.41666" stroke={color} strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SpendingSummary({ monthlySpending, lastMonthSpending, budget }: SpendingSummaryProps) {
  const navigate = useNavigate()
  const comparisonLabel = getComparisonLabel(monthlySpending, lastMonthSpending)
  const spendingTrend = getSpendingTrend(monthlySpending, lastMonthSpending)

  const isBudgetUnset = budget === null
  const remaining = budget !== null ? budget - monthlySpending : null
  const isOverBudget = remaining !== null && remaining < 0

  let budgetAmount: string
  let budgetSub: string

  if (isBudgetUnset) {
    budgetAmount = ''
    budgetSub = '이번 달 예산을 설정해주세요.'
  } else if (isOverBudget) {
    budgetAmount = formatKRW(Math.abs(remaining!))
    budgetSub = `예산을 ${formatKRW(Math.abs(remaining!))} 초과했어요`
  } else {
    budgetAmount = formatKRW(remaining!)
    budgetSub = '목표까지 남았어요'
  }

  return (
    <div className={styles.wrapper}>
      {/* 이번 달 지출 */}
      <div className={styles.card}>
        <p className={styles.label}>이번 달 지출</p>
        <div className={styles.amountRow}>
          {spendingTrend === 'up' && <UpArrowIcon color="#EB0000" />}
          {spendingTrend === 'down' && <DownArrowIcon color="#2946D8" />}
          <p className={styles.amountRed}>{formatKRW(monthlySpending)}</p>
        </div>
        {comparisonLabel && <p className={styles.sub}>{comparisonLabel}</p>}
      </div>

      {/* 남은 예산 */}
      <div
        className={styles.card}
        onClick={isBudgetUnset ? () => navigate('/budget') : undefined}
        role={isBudgetUnset ? 'button' : undefined}
        tabIndex={isBudgetUnset ? 0 : undefined}
        onKeyDown={isBudgetUnset ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/budget') } } : undefined}
        style={isBudgetUnset ? { cursor: 'pointer' } : undefined}
      >
        <p className={styles.label}>남은 예산</p>
        {!isBudgetUnset && (
          <div className={styles.amountRow}>
            {isOverBudget
              ? <UpArrowIcon color="#EB0000" />
              : <DownArrowIcon color="#2946D8" />
            }
            <p className={isOverBudget ? styles.amountRed : styles.amountBlue}>
              {isOverBudget ? '-' : ''}{budgetAmount}
            </p>
          </div>
        )}
        <p className={styles.sub}>{budgetSub}</p>
      </div>
    </div>
  )
}
