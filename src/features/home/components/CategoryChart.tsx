import { useNavigate } from 'react-router-dom'
import { formatKRW } from '@/shared/utils/currency'
import type { CategoryData } from '../types'
import styles from './CategoryChart.module.css'

interface CategoryChartProps {
  categories: CategoryData[]
  hasRecords: boolean
  topCategoryLabel: string
}

const MAX_BAR_HEIGHT = 62

export default function CategoryChart({
  categories,
  hasRecords,
  topCategoryLabel,
}: CategoryChartProps) {
  const navigate = useNavigate()
  const maxAmount = Math.max(...categories.map((c) => c.amount), 1)
  const totalAmount = categories.reduce((sum, c) => sum + c.amount, 0)
  const topPercent =
    totalAmount > 0 ? Math.round(((categories[0]?.amount ?? 0) / totalAmount) * 100) : 0

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>카테고리별 지출</span>
        <button className={styles.detailButton} onClick={() => navigate('/consumption-report')}>
          상세 보기 &gt;
        </button>
      </div>

      {hasRecords ? (
        <>
          <div className={styles.chartArea}>
            {categories.map((cat) => (
              <div
                key={cat.label}
                className={styles.barWrapper}
                onClick={() =>
                  cat.isOther
                    ? navigate('/record?filter=other')
                    : navigate(`/record?category=${encodeURIComponent(cat.label)}`)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}
              >
                <div
                  className={styles.bar}
                  style={{
                    height: `${(cat.amount / maxAmount) * MAX_BAR_HEIGHT}px`,
                    backgroundColor: cat.color,
                  }}
                  aria-label={`${cat.label} ${formatKRW(cat.amount)}`}
                />
                <span className={styles.barLabel}>{cat.label}</span>
              </div>
            ))}
          </div>
          <p className={styles.message}>
            이번 달에는 <strong className={styles.messageBold}>{topCategoryLabel}</strong> 소비가
            전체 지출의 {topPercent}%를 차지했어요.
          </p>
        </>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>이번 달 소비 기록이 아직 없어요.</p>
          <button className={styles.recordButton} onClick={() => navigate('/record')}>
            소비 기록하기
          </button>
        </div>
      )}
    </section>
  )
}
