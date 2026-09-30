import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HomeBanner from './HomeBanner'

describe('HomeBanner', () => {
  it('목표 진행 중이면 남은 금액을 표시한다', () => {
    render(<HomeBanner goalStatus="IN_PROGRESS" achievementRate={70} remainingAmount={150000} />)

    expect(screen.getByText('150,000원')).toBeInTheDocument()
    expect(screen.getByText(/목표까지/)).toHaveTextContent('목표까지 150,000원 남았어요')
  })

  it.each([
    ['IN_PROGRESS', null],
    ['NOT_SET', null],
    ['ACHIEVED', 0],
  ] as const)(
    '%s 상태이고 남은 금액이 %s이면 남은 금액을 표시하지 않는다',
    (goalStatus, amount) => {
      render(<HomeBanner goalStatus={goalStatus} achievementRate={100} remainingAmount={amount} />)

      expect(screen.queryByText(/목표까지/)).not.toBeInTheDocument()
    },
  )
})
