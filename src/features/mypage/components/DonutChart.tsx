import styles from './DonutChart.module.css'

interface DonutChartProps {
  totalAmount: number
}

export default function DonutChart({ totalAmount }: DonutChartProps) {
  const formatted = totalAmount.toLocaleString('ko-KR') + '원'

  return (
    <div className={styles.chart}>
      <div className={styles.innerCircle}>
        <div className={styles.text}>
          <p className={styles.amount}>{formatted}</p>
        </div>
      </div>
    </div>
  )
}
