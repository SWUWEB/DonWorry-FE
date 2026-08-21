import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HourlyWageCard from './HourlyWageCard'

function EditableHourlyWageCard() {
  const [hourlyWage, setHourlyWage] = useState('10000')

  return (
    <HourlyWageCard
      hourlyWage={hourlyWage}
      monthlyIncome={520000}
      spentAmount={743000}
      monthLabel="이번 달"
      onChangeHourlyWage={setHourlyWage}
    />
  )
}

describe('HourlyWageCard', () => {
  it('수입과 지출을 입력된 시급 기준 시간으로 환산한다', () => {
    render(<EditableHourlyWageCard />)

    expect(screen.getByLabelText('52시간')).toBeInTheDocument()
    expect(screen.getByLabelText('74.3시간')).toBeInTheDocument()
  })

  it('시급을 수정하면 환산 시간을 즉시 다시 계산한다', () => {
    render(<EditableHourlyWageCard />)

    fireEvent.click(screen.getByRole('button', { name: /10,000원/ }))
    const input = screen.getByLabelText('시급')

    expect(input).toHaveFocus()
    fireEvent.change(input, { target: { value: '20000원' } })

    expect(screen.getByDisplayValue('20000')).toBeInTheDocument()
    expect(screen.getByLabelText('26시간')).toBeInTheDocument()
    expect(screen.getByLabelText('37.2시간')).toBeInTheDocument()
  })

  it('시급이 없으면 계산할 수 없는 상태를 표시한다', () => {
    render(
      <HourlyWageCard
        hourlyWage=""
        monthlyIncome={520000}
        spentAmount={743000}
        monthLabel="이번 달"
        onChangeHourlyWage={() => undefined}
      />,
    )

    expect(screen.getAllByText('—')).toHaveLength(2)
  })

  it('유한하지 않은 수입은 시간으로 환산하지 않는다', () => {
    render(
      <HourlyWageCard
        hourlyWage="10000"
        monthlyIncome={null}
        spentAmount={743000}
        monthLabel="이번 달"
        onChangeHourlyWage={() => undefined}
      />,
    )

    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.queryByText(/∞/)).not.toBeInTheDocument()
  })
})
