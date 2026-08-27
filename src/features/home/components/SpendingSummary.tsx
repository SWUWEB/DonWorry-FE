import { useNavigate } from 'react-router-dom'
import { formatKRW } from '@/shared/utils/currency'
import type { RemainingBudgetStatus } from '../types'
import styles from './SpendingSummary.module.css'

interface SpendingSummaryProps {
  monthlySpending: number
  comparisonRate: number | null
  comparisonMessage: string | null
  budgetStatus: RemainingBudgetStatus
  remainingBudget: number | null
  budgetMessage: string
}

function getSpendingTrend(comparisonRate: number | null): 'up' | 'down' | 'none' {
  if (!comparisonRate) return 'none'
  return comparisonRate > 0 ? 'up' : 'down'
}

function UpArrowIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M12.8337 4.08334L7.87533 9.04168L4.95866 6.12501L1.16699 9.91668"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33301 4.08334H12.833V7.58334"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DownArrowIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M12.8337 9.91668L7.87533 4.95834L4.95866 7.87501L1.16699 4.08334"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33301 9.91666H12.833V6.41666"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SpendingSummary({
  monthlySpending,
  comparisonRate,
  comparisonMessage,
  budgetStatus,
  remainingBudget,
  budgetMessage,
}: SpendingSummaryProps) {
  const navigate = useNavigate()
  const spendingTrend = getSpendingTrend(comparisonRate)

  const isBudgetUnset = budgetStatus === 'NOT_SET'
  const isOverBudget = budgetStatus === 'EXCEEDED'
  const budgetAmount = remainingBudget !== null ? formatKRW(Math.abs(remainingBudget)) : ''

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
        {comparisonMessage && <p className={styles.sub}>{comparisonMessage}</p>}
      </div>

      {/* 남은 예산 */}
      <div
        className={styles.card}
        onClick={isBudgetUnset ? () => navigate('/goal-amount') : undefined}
        role={isBudgetUnset ? 'button' : undefined}
        tabIndex={isBudgetUnset ? 0 : undefined}
        onKeyDown={
          isBudgetUnset
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate('/goal-amount')
                }
              }
            : undefined
        }
        style={isBudgetUnset ? { cursor: 'pointer' } : undefined}
      >
        <p className={styles.label}>남은 예산</p>
        {!isBudgetUnset && (
          <div className={styles.amountRow}>
            {isOverBudget ? <UpArrowIcon color="#EB0000" /> : <DownArrowIcon color="#2946D8" />}
            <p className={isOverBudget ? styles.amountRed : styles.amountBlue}>
              {isOverBudget ? '-' : ''}
              {budgetAmount}
            </p>
          </div>
        )}
        <p className={styles.sub}>{budgetMessage}</p>
      </div>
    </div>
  )
}
