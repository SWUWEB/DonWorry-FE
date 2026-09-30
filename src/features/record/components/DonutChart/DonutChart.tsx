import type { CSSProperties } from 'react'
import { Pie, PieChart } from 'recharts'
import styles from './DonutChart.module.css'

const EMPTY_FILL = 'var(--color-gray-100, #dddddd)'

interface DonutSegment {
  percent: number
  fill: string
}

interface DonutChartProps {
  segments: DonutSegment[]
  size?: number
  strokeWidth?: number
  centerLabel?: string
}

export default function DonutChart({
  segments,
  size = 100,
  strokeWidth = 28,
  centerLabel,
}: DonutChartProps) {
  const outerRadius = size / 2
  const innerRadius = outerRadius - strokeWidth

  const centerFillPercent = ((innerRadius * 2) / size) * 100

  const total = segments.reduce((sum, segment) => sum + segment.percent, 0)
  const chartData = total > 0 ? segments : [{ percent: 1, fill: EMPTY_FILL }]

  return (
    <div className={styles.wrapper} style={{ '--donut-size': `${size}px` } as CSSProperties}>
      <PieChart width={size} height={size}>
        <Pie
          data={chartData}
          dataKey="percent"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={90}
          endAngle={-270}
          stroke="none"
          isAnimationActive={false}
        />
      </PieChart>

      <div
        className={styles.centerFill}
        style={{ width: `${centerFillPercent}%`, height: `${centerFillPercent}%` }}
      />

      {centerLabel && <span className={styles.centerLabel}>{centerLabel}</span>}
    </div>
  )
}
