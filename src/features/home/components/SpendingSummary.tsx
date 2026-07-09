import styles from './SpendingSummary.module.css'

export default function SpendingSummary() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <p className={styles.label}>이번 달 지출</p>
        <p className={styles.amountRed}>350,000원</p>
        <p className={styles.sub}>지난 달보다 +12%</p>
      </div>

      <div className={styles.card}>
        <p className={styles.label}>남은 예산</p>
        <p className={styles.amountBlue}>150,000원</p>
        <p className={styles.sub}>목표까지 남았어요</p>
      </div>
    </div>
  )
}
