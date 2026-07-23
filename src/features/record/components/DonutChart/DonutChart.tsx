import { Pie, PieChart } from 'recharts'
import styles from './DonutChart.module.css'

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

  return (
    <div className={styles.wrapper} style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <Pie
          data={segments}
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
        style={{ width: innerRadius * 2, height: innerRadius * 2 }}
      />

      {centerLabel && <span className={styles.centerLabel}>{centerLabel}</span>}
    </div>
  )
}
