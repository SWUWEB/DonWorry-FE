import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import defaultThumbnail from '@/assets/images/default-thumbnail.webp'
import RecordCard from './RecordCard'

function renderCard(thumbnail?: string) {
  return render(
    <MemoryRouter>
      <RecordCard
        id="7"
        title="투썸플레이스"
        category="카페/디저트"
        amount={5000}
        type="consume"
        thumbnail={thumbnail}
      />
    </MemoryRouter>,
  )
}

describe('RecordCard', () => {
  it('상품 이미지가 있으면 그 이미지를 보여준다', () => {
    renderCard('https://example.com/item.png')

    expect(screen.getByRole('img', { name: '투썸플레이스' })).toHaveAttribute(
      'src',
      'https://example.com/item.png',
    )
  })

  it('상품 이미지가 없으면 기본 코인 썸네일을 장식 이미지로 보여준다', () => {
    const { container } = renderCard()

    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', defaultThumbnail)
    expect(img).toHaveAttribute('alt', '')
  })
})
