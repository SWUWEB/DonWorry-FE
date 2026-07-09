import styles from './CategoryChart.module.css'

const categories = [
  { label: '식비', height: 94, color: '#286A6D' },
  { label: '교통', height: 59, color: '#C7E3E3' },
  { label: '쇼핑', height: 78, color: '#E5F2F1' },
  { label: '저축', height: 46, color: '#C7E3E3' },
  { label: '기타', height: 55, color: '#2F7F82' },
]

const MAX_BAR_HEIGHT = 94

export default function CategoryChart() {
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
                height: `${(cat.height / MAX_BAR_HEIGHT) * 94}px`,
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
