import styles from './CategoryChart.module.css'

interface Category {
  label: string
  amount: number
  color: string
}

interface CategoryChartProps {
  categories: Category[]
}

const MAX_BAR_HEIGHT = 94

export default function CategoryChart({ categories }: CategoryChartProps) {
  const maxAmount = Math.max(...categories.map((c) => c.amount)) || 1

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>카테고리별 지출</span>
        {/* TODO: 상세 화면 연결 후 button으로 교체 */}
        <span className={styles.detailButton}>상세 보기 &gt;</span>
      </div>

      <div className={styles.chartArea}>
        {categories.map((cat) => (
          <div key={cat.label} className={styles.barWrapper}>
            <div
              className={styles.bar}
              style={{
                height: `${(cat.amount / maxAmount) * MAX_BAR_HEIGHT}px`,
                backgroundColor: cat.color,
              }}
              aria-label={`${cat.label} ${cat.amount.toLocaleString('ko-KR')}원`}
              role="img"
            />
            <span className={styles.barLabel}>{cat.label}</span>
          </div>
        ))}
      </div>

      <p className={styles.message}>
        이번 달은 절약이 목적이셨네요.{' '}
        <strong className={styles.messageBold}>식비</strong> 지출이 조금 많았어요
      </p>
    </section>
  )
}
