import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DonutChart from './DonutChart'

describe('DonutChart', () => {
  it('비율이 모두 0이면 회색 도넛을 표시한다', () => {
    const { container } = render(
      <DonutChart
        segments={[
          { percent: 0, fill: 'red' },
          { percent: 0, fill: 'blue' },
        ]}
      />,
    )

    const sectors = container.querySelectorAll('.recharts-pie-sector path')
    expect(sectors).toHaveLength(1)
    expect(sectors[0]).toHaveAttribute('fill', 'var(--color-gray-100, #dddddd)')
  })

  it('비율이 있으면 전달받은 색상으로 표시한다', () => {
    const { container } = render(
      <DonutChart
        segments={[
          { percent: 70, fill: 'red' },
          { percent: 30, fill: 'blue' },
        ]}
      />,
    )

    const fills = Array.from(container.querySelectorAll('.recharts-pie-sector path')).map((path) =>
      path.getAttribute('fill'),
    )
    expect(fills).toEqual(['red', 'blue'])
  })
})
