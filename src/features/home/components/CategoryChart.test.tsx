import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { CategoryData } from '../types'
import CategoryChart from './CategoryChart'

const category = (overrides: Partial<CategoryData>): CategoryData => ({
  categoryCode: 'FOOD_SNACK',
  label: '음식',
  amount: 0,
  ratio: 0,
  color: '#286A6D',
  isOther: false,
  ...overrides,
})

function renderChart(summaryText: string, categories: CategoryData[]) {
  return render(
    <MemoryRouter>
      <CategoryChart categories={categories} hasRecords summaryText={summaryText} />
    </MemoryRouter>,
  )
}

describe('CategoryChart', () => {
  it('요약 문구를 문장마다 나누고 가장 많이 쓴 카테고리를 굵게 표시한다', () => {
    const { container } = renderChart('이번 달은 절약이 목적이셨네요. 음식 지출이 조금 많았어요', [
      category({ amount: 120000 }),
      category({ categoryCode: 'FASHION', label: '패션', amount: 90000 }),
    ])

    const sentences = container.querySelectorAll('p > span')
    expect(sentences).toHaveLength(2)
    expect(sentences[1]).toHaveTextContent('음식 지출이 조금 많았어요')
    expect(screen.getByText('음식', { selector: 'strong' })).toBeInTheDocument()
  })

  it('가장 많이 쓴 항목이 그 외이거나 문구에 없으면 굵게 표시하지 않는다', () => {
    renderChart('여러 곳에 고르게 썼어요', [
      category({ amount: 10000 }),
      category({ categoryCode: 'ETC', label: '그 외', amount: 50000, isOther: true }),
    ])

    expect(screen.getByText('여러 곳에 고르게 썼어요')).toBeInTheDocument()
    expect(document.querySelector('strong')).toBeNull()
  })
})
