import styles from './CurrentGoalCard.module.css'

export default function CurrentGoalCard() {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>현재 목표 금액</span>
        <span className={styles.amount}>1,000,000원</span>
      </div>

      <div className={styles.rateRow}>
        <span className={styles.rateLabel}>목표 달성률</span>
        <span className={styles.rateValue}>60%</span>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill}></div>
      </div>

      <div className={styles.amountRow}>
        <span>600,000원</span>
        <span>1,000,000원</span>
      </div>
    </section>
  )
}