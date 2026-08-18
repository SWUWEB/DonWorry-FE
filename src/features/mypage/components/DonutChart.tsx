import { formatKRW } from '@/shared/utils/currency'
import styles from './DonutChart.module.css'

interface DonutChartProps {
  totalAmount: number
}

export default function DonutChart({ totalAmount }: DonutChartProps) {
  return (
    <div className={styles.chart}>
      <div className={styles.innerCircle}>
        <div className={styles.text}>
          <p className={styles.amount}>{formatKRW(totalAmount)}</p>
        </div>
      </div>
    </div>
  )
}
