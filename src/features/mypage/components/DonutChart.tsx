import styles from './DonutChart.module.css'

export default function DonutChart() {
  return (
    <div className={styles.chart}>
      <div className={styles.innerCircle}>
        <div className={styles.text}>
          <p className={styles.amount}>
            750,000원
          </p>

        </div>
      </div>
    </div>
  )
}