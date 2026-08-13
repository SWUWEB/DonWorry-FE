import { formatKRW } from '@/shared/utils/currency'
import styles from './DonutChart.module.css'

export interface DonutSegment {
  color: string
  ratio: number
}

interface DonutChartProps {
  totalAmount: number
  segments?: DonutSegment[]
}

// 카테고리 비율을 conic-gradient 구간으로 변환합니다.
// 합이 100에 못 미치면 남은 부분은 회색으로 채웁니다.
function buildGradient(segments: DonutSegment[]): string {
  const stops: string[] = []
  let cursor = 0

  for (const { color, ratio } of segments) {
    if (ratio <= 0) continue
    const next = Math.min(cursor + ratio, 100)
    stops.push(`${color} ${cursor}% ${next}%`)
    cursor = next
  }

  if (cursor < 100) {
    stops.push(`var(--color-gray-100, #e5e7eb) ${cursor}% 100%`)
  }

  return `conic-gradient(${stops.join(', ')})`
}

export default function DonutChart({ totalAmount, segments }: DonutChartProps) {
  const hasSegments = segments !== undefined && segments.length > 0

  return (
    <div
      className={styles.chart}
      style={hasSegments ? { background: buildGradient(segments) } : undefined}
    >
      <div className={styles.innerCircle}>
        <div className={styles.text}>
          <p className={styles.amount}>{formatKRW(totalAmount)}</p>
        </div>
      </div>
    </div>
  )
}
