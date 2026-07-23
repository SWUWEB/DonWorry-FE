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
        <button className={styles.detailButton}>상세 보기 &gt;</button>
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
