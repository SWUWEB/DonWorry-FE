import styles from './BudgetCard.module.css'

export default function BudgetCard() {
  return (
    <section className={styles.card}>
      <div>
        <p className={styles.label}>이번 달 남은 예산</p>
        <h2 className={styles.amount}>₩ 155,000</h2>
      </div>

      <div className={styles.badge}>
        달성률 69%
      </div>
    </section>
  )
}