import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import FindId from './FindId'

describe('FindId', () => {
  it('서버 endpoint가 없는 동안 발송 성공을 가장하지 않고 준비 중 상태를 안내한다', () => {
    render(
      <MemoryRouter>
        <FindId />
      </MemoryRouter>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('현재 아이디 찾기 기능은 준비 중입니다.')
    expect(screen.queryByRole('button', { name: '아이디 전송' })).not.toBeInTheDocument()
  })
})
